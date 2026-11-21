from pathlib import Path
import os
from playwright.sync_api import sync_playwright
from datetime import datetime,timedelta
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

def setup(page,store=None):
    page.evaluate('''store=>{const state=store||{};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return state[k]??null},setItem(k,v){state[k]=String(v)},removeItem(k){delete state[k]}}});window.__store=state;}''',store)
    page.set_content(html,wait_until='load')

def state(page):return json.loads(page.evaluate('window.__store["mauven-prototype-v1"]'))
def task(label,days,done=True):
    dt=int((datetime.now()-timedelta(days=days)).timestamp()*1000)
    return dict(id='test-'+label.lower().replace(' ','-'),title=label,description='',dueDate=None,subtasks=[dict(id='sub-'+label,title='Details',completedAt=None)],createdAt=dt-700000,updatedAt=dt,completedAt=dt if done else None,deletedAt=None)
with sync_playwright() as p:
    browser=p.chromium.launch(**browser_options())
    ctx=browser.new_context(viewport={'width':1440,'height':960},device_scale_factor=1)
    pg=ctx.new_page();errors=[]
    pg.on('pageerror',lambda e: errors.append(str(e)))
    setup(pg)
    pg.locator('[data-action="show-tasks"]').click()
    pg.locator('#todo-new-name').fill('Initialize workspace')
    pg.locator('#todo-new-name').press('Enter')
    base=state(pg)
    tasks=[task('Today task',0),task('Weekly task',3),task('Monthly task',14),task('Quarterly task',45),task('Yearly task',140),task('Historical task',450),task('Pending task',0,False)]
    base['tasks']=tasks
    pg.close()
    pg=ctx.new_page();pg.on('pageerror',lambda e:errors.append(str(e)))
    setup(pg,{KEY:json.dumps(base)});pg.locator('[data-action="show-tasks"]').click()
    assert pg.locator('.todo-completed-count').inner_text()=='6'
    assert pg.locator('.todo-history-group').count()==0
    assert pg.locator('.todo-list[aria-label="Incomplete tasks"] .todo-item').count()==1
    pg.screenshot(path=str(folder/'preview-v091-collapsed.png'),full_page=True)
    pg.locator('[data-action="completed-toggle"]').click()
    names=pg.locator('.todo-history-group-label strong').all_inner_texts()
    assert names==['Today','Within Last 7 Days','Within Last 30 Days','Within Last 3 Months','Within This Year','Previous Years'],names
    assert pg.locator('[data-action="completed-group-toggle"]').count()==6
    assert pg.locator('.todo-history-group .todo-item').count()==1
    # One checkbox per row, and it toggles completion normally.
    assert pg.locator('.todo-history-group .todo-item-head input[type="checkbox"]').count()==1
    assert pg.locator('[data-completed-select]').count()==0
    assert pg.locator('[data-action="completed-group-toggle"][data-group="week"]').get_attribute('aria-expanded')=='false'
    pg.locator('[data-action="completed-group-toggle"][data-group="week"]').click()
    assert pg.locator('.todo-history-group .todo-item').count()==2
    pg.screenshot(path=str(folder/'preview-v091-history.png'),full_page=True)
    # Checkboxes on left still reopen completed tasks in normal mode.
    pg.locator('[data-task-toggle="test-today-task"]').click()
    assert state(pg)['tasks'][0]['completedAt'] is None
    assert pg.locator('.todo-completed-count').inner_text()=='5'
    pg.locator('.todo-list[aria-label="Incomplete tasks"] [data-task-toggle="test-today-task"]').click()
    assert state(pg)['tasks'][0]['completedAt'] is not None
    assert pg.locator('.todo-completed-count').inner_text()=='6'
    # Select mode renders one checkbox in same place, and selection stays on closed group.
    pg.locator('[data-action="completed-select-mode"]').click()
    assert pg.locator('[data-action="completed-select-mode"]').inner_text()=='Cancel'
    assert pg.locator('[data-task-toggle="test-today-task"]').count()==0
    assert pg.locator('.todo-history-group .todo-item-head input[type="checkbox"]').count()==2
    pg.locator('[data-completed-select="test-weekly-task"]').click()
    assert pg.locator('.todo-selection-count').inner_text()=='1 selected'
    pg.locator('[data-action="completed-group-toggle"][data-group="week"]').click()
    assert pg.locator('[data-completed-select="test-weekly-task"]').count()==0
    assert pg.locator('.todo-selection-count').inner_text()=='1 selected'
    assert pg.locator('[data-action="completed-clear-selected"]').is_enabled()
    # Cancel custom modal preserves all tasks and their trash state.
    pg.locator('[data-action="completed-clear-selected"]').click()
    assert pg.get_by_role('dialog').is_visible()
    assert 'Permanently delete 1 completed task' in pg.get_by_role('dialog').inner_text()
    assert 'cannot be undone' in pg.get_by_role('dialog').inner_text()
    pg.locator('#completed-delete-cancel').click()
    assert pg.get_by_role('dialog').count()==0
    assert len(state(pg)['tasks'])==7
    assert pg.locator('.todo-selection-count').inner_text()=='1 selected'
    # Select all includes collapsed groups; unselect the first (visible Today).
    pg.locator('[data-completed-select-all]').click()
    assert pg.locator('.todo-selection-count').inner_text()=='6 selected'
    pg.locator('[data-completed-select="test-today-task"]').click()
    assert pg.locator('.todo-selection-count').inner_text()=='5 selected'
    assert pg.locator('[data-completed-select-all]').evaluate('(el)=>el.indeterminate')
    pg.screenshot(path=str(folder/'preview-v091-select-mode.png'),full_page=True)
    pg.locator('[data-action="completed-clear-selected"]').click()
    pg.screenshot(path=str(folder/'preview-v091-confirm-dialog.png'),full_page=True)
    assert 'Permanently delete 5 completed tasks?' in pg.get_by_role('dialog').inner_text()
    pg.locator('[data-action="completed-confirm-delete"]').click()
    s=state(pg)
    assert len(s['tasks'])==2,[t['title'] for t in s['tasks']]
    assert set(t['title'] for t in s['tasks'])=={'Today task','Pending task'}
    assert all(t['deletedAt'] is None for t in s['tasks'])
    assert pg.locator('.todo-completed-count').inner_text()=='1'
    assert pg.locator('[data-action="completed-select-mode"]').inner_text()=='Select'
    assert pg.get_by_role('dialog').count()==0
    pg.locator('[data-action="show-trash"]').click()
    assert pg.locator('[data-action="task-restore"]').count()==0
    # Persisted data survives script reinitialization; no date default is retained.
    pg2=ctx.new_page();pg2.on('pageerror',lambda e:errors.append(str(e)))
    setup(pg2,pg.evaluate('window.__store'))
    pg2.locator('[data-action="show-tasks"]').click()
    assert pg2.locator('.todo-completed-count').inner_text()=='1'
    pg2.locator('#todo-new-name').fill('Undated new task')
    pg2.locator('#todo-new-name').press('Enter')
    assert next(t for t in state(pg2)['tasks'] if t['title']=='Undated new task')['dueDate'] is None
    # Selection mode Cancel leaves all task contents untouched.
    pg2.locator('[data-action="completed-toggle"]').click()
    pg2.locator('[data-action="completed-select-mode"]').click()
    pg2.locator('[data-completed-select="test-today-task"]').click()
    pg2.locator('[data-action="completed-select-mode"]').click()
    assert pg2.locator('[data-completed-select]').count()==0
    assert pg2.locator('.todo-completed-count').inner_text()=='1'
    # Mobile no horizontal overflow and accessible controls.
    mobile=ctx.new_page();mobile.set_viewport_size({'width':390,'height':844});mobile.on('pageerror',lambda e:errors.append(str(e)))
    setup(mobile,{KEY:json.dumps(base)})
    mobile.get_by_role('button',name='Open navigation').click()
    mobile.locator('[data-action="show-tasks"]').click()
    mobile.locator('[data-action="completed-toggle"]').click()
    mobile.locator('[data-action="completed-group-toggle"][data-group="week"]').click()
    mobile.locator('[data-action="completed-select-mode"]').click()
    mobile.locator('[data-completed-select-all]').click()
    mobile.screenshot(path=str(folder/'preview-v091-mobile.png'),full_page=True)
    dims=mobile.evaluate('''() => ({inner:innerWidth,body:document.documentElement.scrollWidth,scroll:document.querySelector('.app-main-scroll').scrollWidth})''')
    assert dims['body']<=dims['inner']+1,dims
    assert not errors,errors
    print('PASS: six exclusive completion buckets, independent collapse, one checkbox per completed row, select mode, selection preservation, select all across collapsed groups, modal Cancel/Confirm, permanent removal (not Trash), persistence, due-date default, mobile, no browser errors')
    for filename in ['preview-v091-collapsed.png','preview-v091-history.png','preview-v091-select-mode.png','preview-v091-confirm-dialog.png','preview-v091-mobile.png']:
        print(filename,(folder/filename).stat().st_size)
    browser.close()
