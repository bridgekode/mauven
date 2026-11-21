from pathlib import Path
import os
from playwright.sync_api import sync_playwright
import json
folder=Path(__file__).resolve().parents[1]
html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+(folder/'styles.css').read_text()+'</style></head><body><div id="app"></div><script>'+(folder/'app.js').read_text()+'</script></body></html>'
KEY='mauven-prototype-v1'

def browser_options():
    opts = dict(headless=True, args=['--no-sandbox','--disable-dev-shm-usage'])
    system_path = os.environ.get('MAUVEN_CHROMIUM_PATH')
    if system_path:
        opts['executable_path'] = system_path
    return opts

def setup(pg, store=None):
    pg.evaluate('''data=>{const store=data||{};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return store[k]??null},setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}}});window.__store=store;}''',store)
    pg.set_content(html,wait_until='load')

def state(pg):return json.loads(pg.evaluate(f'window.__store[{json.dumps(KEY)}]'))

with sync_playwright() as p:
    browser=p.chromium.launch(**browser_options())
    context=browser.new_context(viewport={'width':1440,'height':950})
    context.set_default_timeout(5000)
    pg=context.new_page(); errors=[];pg.on('pageerror',lambda e:errors.append(str(e)))
    setup(pg)
    assert pg.locator('[data-action="show-tasks"]').count()==1
    pg.locator('[data-action="show-tasks"]').click()
    assert pg.locator('.todo-heading h1').inner_text()=='To-do List'
    assert pg.locator('.todo-item').count()==2
    assert 'No due date' in pg.locator('.todo-list').inner_text()
    print('initial tasks:',pg.locator('.todo-list').inner_text()[:200])
    pg.screenshot(path=str(folder/'preview-todolist-v08.png'),full_page=True)
    pg.locator('#todo-new-name').fill('Write launch instructions')
    pg.locator('#todo-new-name').press('Enter')
    st=state(pg)
    t=next(t for t in st['tasks'] if t['title']=='Write launch instructions')
    taskid=t['id']
    assert t['dueDate'] is None,t
    assert pg.locator(f'.todo-item[data-task-id="{taskid}"] .todo-details').count()==1
    pg.locator(f'[data-task-desc="{taskid}"]').fill('Include setup, tests, and deployment steps.')
    pg.locator(f'[data-task-title="{taskid}"]').fill('Write Mauven launch instructions')
    pg.locator(f'[data-task-title="{taskid}"]').press('Tab')
    for txt in ['Document configuration','Explain Cloudflare routing','Test on mobile','Publish repository']:
        pg.locator('#subtask-new').fill(txt)
        pg.locator('[data-action="subtask-add"]').click()
    assert pg.locator(f'.todo-item[data-task-id="{taskid}"] .todo-subtask').count()==4
    assert '0/4 subtasks' in pg.locator(f'.todo-item[data-task-id="{taskid}"]').inner_text()
    sub1=pg.locator(f'.todo-item[data-task-id="{taskid}"] [data-subtask-toggle]').first
    sub1.check()
    assert '1/4 subtasks' in pg.locator(f'.todo-item[data-task-id="{taskid}"]').inner_text()
    # Completing all subtasks must not complete the parent.
    for cb in pg.locator(f'.todo-item[data-task-id="{taskid}"] [data-subtask-toggle]').all():
        if not cb.is_checked():cb.check()
    assert '4/4 subtasks' in pg.locator(f'.todo-item[data-task-id="{taskid}"]').inner_text()
    st=state(pg);t=next(t for t in st['tasks'] if t['id']==taskid)
    assert not t['completedAt'] and len(t['subtasks'])==4
    # Persist due date and verify calendar count.
    pg.locator(f'[data-task-due="{taskid}"]').fill('2026-11-21')
    st=state(pg);assert next(t for t in st['tasks'] if t['id']==taskid)['dueDate']=='2026-11-21'
    pg.screenshot(path=str(folder/'preview-todolist-details-v08.png'),full_page=True)
    pg.locator('[data-action="show-calendar"]').click()
    # Calendar is month-local, move if needed.
    pg.locator('[data-action="calendar-select"][data-date="2026-11-21"]').click() if pg.locator('[data-action="calendar-select"][data-date="2026-11-21"]').count() else None
    if pg.locator('[data-action="calendar-select"][data-date="2026-11-21"]').count()==0:
        raise AssertionError('Expected November 2026 for the current test date')
    assert pg.locator('.calendar-task-row').count()>=1
    assert pg.locator('.calendar-section-label h3').all_inner_texts()==['Tasks','Notes']
    assert pg.locator('[data-action="calendar-create-task"]').get_attribute('data-date')=='2026-11-21'
    pg.locator('#calendar-new-task').fill('Calendar-created task')
    pg.locator('#calendar-new-task').press('Enter')
    st=state(pg);assert next(t for t in st['tasks'] if t['title']=='Calendar-created task')['dueDate']=='2026-11-21'
    assert pg.locator('.calendar-task-row').count()>=2
    assert pg.locator('.calendar-note-row').count()>=0
    pg.screenshot(path=str(folder/'preview-calendar-tasks-v08.png'),full_page=True)
    # Open a day task; toggle parent completion, trash + restore.
    pg.locator('[data-action="calendar-open-task"]').first.click()
    assert pg.locator('.todo-details').count()==1
    pg.locator(f'[data-task-toggle="{taskid}"]').click()
    assert next(t for t in state(pg)['tasks'] if t['id']==taskid)['completedAt']
    pg.locator('[data-action="completed-toggle"]').click()
    if pg.locator(f'.todo-item[data-task-id="{taskid}"] .todo-details').count()==0:
        pg.locator(f'[data-action="task-expand"][data-id="{taskid}"]').first.click()
    pg.locator(f'[data-action="task-delete"][data-id="{taskid}"]').click()
    assert next(t for t in state(pg)['tasks'] if t['id']==taskid)['deletedAt']
    pg.locator('[data-action="show-trash"]').click()
    assert pg.locator(f'[data-action="task-restore"][data-id="{taskid}"]').count()==1
    pg.locator(f'[data-action="task-restore"][data-id="{taskid}"]').click()
    assert not next(t for t in state(pg)['tasks'] if t['id']==taskid)['deletedAt']
    # Persistence with v0.7 state and existing notes retained.
    pg.wait_for_timeout(600)
    persisted=pg.evaluate('window.__store')
    pg2=context.new_page();pg2.on('pageerror',lambda e:errors.append(str(e)));setup(pg2,persisted)
    assert len(state(pg2)['notes'])==len(state(pg)['notes'])
    assert next(t for t in state(pg2)['tasks'] if t['id']==taskid)['description']=='Include setup, tests, and deployment steps.'
    # Explicit migration test: no tasks key from v0.7.
    old={k:v for k,v in state(pg2).items() if k!='tasks'}
    migration=context.new_page();migration.on('pageerror',lambda e:errors.append(str(e)));setup(migration,{KEY:json.dumps(old)})
    migration.locator('[data-action="show-tasks"]').click()
    assert migration.locator('.todo-item').count()==0
    migration.locator('#todo-new-name').fill('First task after migration')
    migration.locator('[data-action="task-create"]').click()
    assert len(state(migration)['notes'])==len(old['notes'])
    assert len(state(migration)['tasks'])==1
    # Mobile navigation and selected calendar note/task list.
    mob=context.new_page();mob.set_viewport_size({'width':390,'height':844});mob.on('pageerror',lambda e:errors.append(str(e)));setup(mob)
    mob.get_by_role('button',name='Open navigation').click()
    mob.locator('[data-action="show-tasks"]').click()
    assert mob.locator('.todo-heading').is_visible()
    mob.locator('#todo-new-name').fill('Mobile task without due date')
    mob.locator('[data-action="task-create"]').click()
    assert any(t['title']=='Mobile task without due date' and t['dueDate'] is None for t in state(mob)['tasks'])
    mob.screenshot(path=str(folder/'preview-todolist-mobile-v08.png'),full_page=True)
    mob.get_by_role('button',name='Open navigation').click()
    mob.locator('[data-action="show-calendar"]').click()
    mob.locator('[data-action="calendar-select"][data-date="2026-11-21"]').click()
    assert mob.locator('.calendar-task-row').count()>=1
    mob.screenshot(path=str(folder/'preview-calendar-tasks-mobile-v08.png'),full_page=True)
    # look for horizontal page overflow in task view (not calendar grid only)
    mob.get_by_role('button',name='Open navigation').click()
    mob.locator('[data-action="show-tasks"]').click()
    dims=mob.evaluate('''() => ({inner:innerWidth,scroll:document.documentElement.scrollWidth,main:document.querySelector('.app-main-scroll').scrollWidth})''')
    assert dims['scroll']<=dims['inner']+1,dims
    assert not errors,errors
    print('PASS: todos, optional due dates, parent and subtask completion, progress, descriptions, title edits, calendar counting, calendar creation, trash/restore, old-data migration, persistence, mobile')
    browser.close()
