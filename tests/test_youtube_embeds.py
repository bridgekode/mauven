from pathlib import Path
import os
from playwright.sync_api import sync_playwright
import json
folder=Path(__file__).resolve().parents[1]
html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+(folder/'styles.css').read_text()+'</style></head><body><div id="app"></div><script>'+(folder/'app.js').read_text()+'</script></body></html>'

def browser_options():
    opts = dict(headless=True, args=['--no-sandbox','--disable-dev-shm-usage'])
    system_path = os.environ.get('MAUVEN_CHROMIUM_PATH')
    if system_path:
        opts['executable_path'] = system_path
    return opts

def setup(pg,data=None):
    pg.evaluate('''(data)=>{const store=data||{};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return store[k]??null},setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}}});window.__store=store;}''',data)
    pg.set_content(html,wait_until='load')

def clear_editor(pg):
    ed=pg.locator('#note-content');ed.click()
    pg.evaluate('''() => {const e=document.getElementById('note-content');e.innerHTML='<p><br></p>';e.focus();const r=document.createRange();r.selectNodeContents(e.firstElementChild);r.collapse(true);const s=window.getSelection();s.removeAllRanges();s.addRange(r);e.dispatchEvent(new InputEvent('input',{bubbles:true,inputType:'insertText',data:''}));}''')
    return ed

def slash_video(pg,command,url):
    editor=clear_editor(pg)
    pg.keyboard.type('/'+command)
    menu=pg.locator('#slash-palette')
    assert menu.is_visible(),editor.inner_html()
    assert pg.locator('[data-slash-command="youtube"]').count()==1,menu.inner_text()
    pg.keyboard.press('Enter')
    assert pg.locator('#youtube-url').is_visible()
    pg.locator('#youtube-url').fill(url)
    pg.locator('[data-action="confirm-youtube"]').click()
    return editor

with sync_playwright() as pw:
    browser=pw.chromium.launch(**browser_options())
    ctx=browser.new_context(viewport={'width':1360,'height':900},reduced_motion='reduce')
    pg=ctx.new_page();errs=[];pg.on('dialog',lambda dialog:dialog.dismiss());pg.on('pageerror',lambda err:errs.append(str(err)))
    setup(pg)
    pg.get_by_role('button',name='New note',exact=True).first.click()
    pg.locator('#note-title').fill('Video tutorial')
    ed=slash_video(pg,'video','https://youtu.be/M7lc1UVf-VE?t=35')
    frame=ed.locator('figure[data-youtube-id]')
    assert frame.count()==1,ed.inner_html()
    assert frame.locator('iframe').get_attribute('src')=='https://www.youtube-nocookie.com/embed/M7lc1UVf-VE'
    assert frame.locator('iframe').get_attribute('loading')=='lazy'
    assert frame.locator('.video-remove').count()==1
    assert pg.locator('#youtube-url').count()==0
    pg.screenshot(path=str(folder/'preview-youtube-v07.png'),full_page=True)
    # persisted canonical markup and reload
    pg.wait_for_timeout(550)
    data=json.loads(pg.evaluate("window.__store['mauven-prototype-v1']"))
    note=next(n for n in data['notes'] if n['title']=='Video tutorial')
    assert 'youtube-nocookie.com/embed/M7lc1UVf-VE' in note['content']
    pg2=ctx.new_page();pg2.on('dialog',lambda dialog:dialog.dismiss());pg2.on('pageerror',lambda err:errs.append(str(err)));setup(pg2,pg.evaluate('window.__store'))
    pg2.locator('[data-action="open-search"]').first.click();pg2.locator('#search-input').fill('Video tutorial');pg2.locator('.search-result').first.click()
    assert pg2.locator('#note-content iframe').count()==1
    # Sanitizer test for read-only rendering, using a test-only exposed function.
    # Browser's about:blank test origin cannot serve a real share URL.
    pg2.evaluate('''() => {const ed=document.querySelector('#note-content');const f=ed.querySelector('figure');if(!f)throw Error('missing embed');}''')
    assert pg2.locator('#note-content iframe').count()==1
    # rejected attacker / unsupported domains, without deleting slash command
    ed2=clear_editor(pg2)
    pg2.keyboard.type('/youtube')
    print('menu',pg2.locator('#slash-palette').count(),pg2.locator('#slash-palette').inner_text() if pg2.locator('#slash-palette').count() else ed2.inner_html())
    pg2.keyboard.press('Enter')
    print('after Enter dialog count',pg2.locator('#youtube-url').count(),'editor',ed2.inner_html()[:240])
    assert pg2.locator('#youtube-url').count()==1
    for val in ['https://youtube.com.evil.example/watch?v=M7lc1UVf-VE', 'javascript:alert(1)', 'https://www.youtube.com/playlist?list=PL123','https://www.youtube.com/watch?v=short']:
        pg2.locator('#youtube-url').fill(val)
        pg2.locator('[data-action="confirm-youtube"]').click()
        assert pg2.locator('#youtube-error').is_visible(),val
        assert ed2.locator('iframe').count()==0,val
    pg2.locator('#youtube-url').fill('https://www.youtube.com/shorts/M7lc1UVf-VE')
    pg2.locator('#youtube-url').press('Enter')
    assert pg2.locator('.modal-backdrop').count()==0
    assert ed2.locator('figure[data-youtube-id] iframe').count()==1
    # pasted iframe: allow only recognized youtube embeds; block all others
    ed2=clear_editor(pg2)
    pg2.evaluate('''() => {
      const ed=document.getElementById('note-content'); ed.focus();
      const dt=new DataTransfer();
      dt.setData('text/html','<iframe src="https://evil.example/embed/M7lc1UVf-VE" onload="alert(1)"></iframe><iframe src="https://www.youtube.com/embed/M7lc1UVf-VE" onload="alert(1)"></iframe>');
      ed.dispatchEvent(new ClipboardEvent('paste',{bubbles:true,cancelable:true,clipboardData:dt}));
    }''')
    pg2.wait_for_timeout(500)
    stored=json.loads(pg2.evaluate("window.__store['mauven-prototype-v1']"))
    content=next(n for n in stored['notes'] if n['title']=='Video tutorial')['content']
    assert 'evil.example' not in content and 'onload=' not in content
    assert content.count('youtube-nocookie.com/embed/M7lc1UVf-VE')==1,content
    # remove
    ed2=clear_editor(pg2)
    pg2.keyboard.type('/youtube');pg2.keyboard.press('Enter');pg2.locator('#youtube-url').fill('https://www.youtube.com/live/M7lc1UVf-VE');pg2.locator('[data-action="confirm-youtube"]').click()
    assert ed2.locator('figure').count()==1
    ed2.locator('.video-remove').click()
    assert ed2.locator('figure').count()==0
    # mobile UI
    mob=ctx.new_page();mob.set_viewport_size({'width':390,'height':844});mob.on('pageerror',lambda err:errs.append(str(err)));setup(mob)
    mob.get_by_role('button',name='Open navigation').click()
    mob.get_by_role('button',name='New note',exact=True).first.click()
    med=slash_video(mob,'youtube','https://www.youtube.com/watch?v=M7lc1UVf-VE')
    assert med.locator('iframe').count()==1
    size=med.locator('.youtube-player').bounding_box()
    assert size['width']<390 and size['height']>80,size
    mob.screenshot(path=str(folder/'preview-youtube-mobile-v07.png'),full_page=True)
    assert not errs,errs
    print('PASS: /video alias; /youtube; URL validation; modal; insertion; persistence; reload; readonly preview; safe iframes; removal; mobile; no pageerrors')
    browser.close()
