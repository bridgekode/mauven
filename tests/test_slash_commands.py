from pathlib import Path
import os
from playwright.sync_api import sync_playwright
import json,traceback
folder=Path(__file__).resolve().parents[1]
html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+(folder/'styles.css').read_text()+'</style></head><body><div id="app"></div><script>'+(folder/'app.js').read_text()+'</script></body></html>'

def browser_options():
    opts = dict(headless=True, args=['--no-sandbox','--disable-dev-shm-usage'])
    system_path = os.environ.get('MAUVEN_CHROMIUM_PATH')
    if system_path:
        opts['executable_path'] = system_path
    return opts

def setup(page,data=None):
    page.evaluate('''(data)=>{const store=data||{};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return store[k]??null},setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}}});window.__store=store;}''',data)
    page.set_content(html,wait_until='load')

def clear_editor(page):
    editor=page.locator('#note-content')
    editor.click()
    page.evaluate('''() => {const e=document.getElementById('note-content');e.innerHTML='<p><br></p>';const r=document.createRange();r.selectNodeContents(e.firstElementChild);r.collapse(true);const s=window.getSelection();s.removeAllRanges();s.addRange(r); e.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:''}));}''')
    return editor

def type_command(page,txt,choice='Enter'):
    editor=clear_editor(page)
    page.keyboard.type(txt,delay=18)
    assert page.locator('#slash-palette').is_visible(), (txt,editor.inner_html())
    if choice=='Enter':page.keyboard.press('Enter')
    elif choice=='click':page.locator('[data-slash-command]').first.click()
    else:page.keyboard.press(choice)
    return editor

with sync_playwright() as p:
    b=p.chromium.launch(**browser_options())
    ctx=b.new_context(viewport={'width':1390,'height':900})
    page=ctx.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    setup(page)
    page.get_by_role('button',name='New note',exact=True).first.click()
    page.locator('#note-title').fill('Slash command test')
    editor=type_command(page,'/tasks')
    print('tasks:',editor.inner_html()[:300]); assert editor.locator('ul[data-task-list] input[type="checkbox"]').count()==1
    page.keyboard.type('Finish launch')
    assert 'Finish launch' in editor.inner_text(),editor.inner_html()
    editor.locator('input[type="checkbox"]').first.check()
    page.wait_for_timeout(450)
    assert 'checked' in editor.inner_html()
    # aliases
    editor=type_command(page,'/checkbox')
    assert editor.locator('ul[data-task-list]').count()==1
    editor=type_command(page,'/todo')
    assert editor.locator('ul[data-task-list]').count()==1
    editor=type_command(page,'/h2')
    assert editor.locator('h2').count()==1
    page.keyboard.type('Topic')
    assert 'Topic' in editor.locator('h2').inner_text()
    editor=type_command(page,'/bullet')
    assert editor.locator('ul:not([data-task-list]) > li').count()==1
    editor=type_command(page,'/number')
    assert editor.locator('ol > li').count()==1
    editor=type_command(page,'/table')
    assert page.locator('.slash-dimensions').is_visible()
    page.locator('[data-slash-dimension="3"]').click()
    assert editor.locator('table tr').count()==3,editor.inner_html()
    assert editor.locator('table tr').first.locator('th').count()==3
    print('table:',editor.inner_html()[:480])
    editor=type_command(page,'/divider')
    assert editor.locator('hr').count()==1
    editor=type_command(page,'/highlight')
    assert editor.locator('mark').count()==1
    editor=type_command(page,'/codeblock')
    assert editor.locator('pre code').count()==1
    editor=type_command(page,'/date')
    assert editor.inner_text().strip()!=''
    # Slash palette navigation / filtering
    editor=clear_editor(page);page.keyboard.type('/')
    assert page.locator('#slash-palette [role="option"]').count()>10
    page.keyboard.type('imag')
    assert page.locator('#slash-palette [role="option"]').count()==1
    page.keyboard.press('Escape')
    assert page.locator('#slash-palette').count()==0
    # Markdown shortcuts
    for marker,tag in [('# ','h1'),('## ','h2'),('### ','h3'),('- ','ul'),('1. ','ol'),('> ','blockquote'),('[] ','ul[data-task-list]'),('[x] ','ul[data-task-list]')]:
        editor=clear_editor(page);page.keyboard.type(marker)
        assert editor.locator(tag).count()==1,(marker,editor.inner_html())
        if marker=='[x] ':assert editor.locator('input:checked').count()==1,editor.inner_html()
    print('markdown success')
    # table context commands (not menu when outside a table)
    editor=type_command(page,'/table');page.locator('[data-slash-dimension="2"]').click()
    cell=editor.locator('table tbody tr:first-child td:first-child');cell.click();page.keyboard.type('/rowbelow')
    assert page.locator('[data-slash-command="rowbelow"]').count()==1,page.locator('#slash-palette').inner_text()
    page.keyboard.press('Enter')
    assert editor.locator('table tr').count()==3,editor.inner_html()
    # persistence
    page.wait_for_timeout(650)
    state=json.loads(page.evaluate("window.__store['mauven-prototype-v1']"))
    n=next(n for n in state['notes'] if n['title']=='Slash command test')
    assert '<table>' in n['content'] and '</table>' in n['content']
    page.screenshot(path=str(folder/'preview-slash-commands-v06.png'),full_page=True)
    # reload
    pg=ctx.new_page();pg.on('pageerror',lambda e:errors.append(str(e)));setup(pg,page.evaluate('window.__store'))
    pg.locator('[data-action="open-search"]').first.click();pg.locator('#search-input').fill('Slash command test');pg.locator('.search-result').first.click()
    assert pg.locator('#note-content table').count()==1
    print('persistence success; errors:',errors)
    assert not errors,errors
    pg.close()
    # mobile
    mob=ctx.new_page();mob.set_viewport_size({'width':390,'height':844});mob.on('pageerror',lambda e:errors.append(str(e)));setup(mob,page.evaluate('window.__store'))
    mob.get_by_role('button',name='Open navigation').click();mob.locator('[data-action="open-search"]').first.click();mob.locator('#search-input').fill('Slash command test');mob.locator('.search-result').first.click()
    ed=clear_editor(mob);mob.keyboard.type('/task');assert mob.locator('#slash-palette').is_visible()
    mob.screenshot(path=str(folder/'preview-slash-commands-mobile-v06.png'),full_page=True)
    assert not errors,errors
    b.close()
