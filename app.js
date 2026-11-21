/* Mauven frontend prototype — local-only data, no server-side authentication or public sharing. */
(() => {
  'use strict';
  const STORAGE_KEY = 'mauven-prototype-v1';
  const BRAND_LOGO = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJNYXV2ZW4gbG9nbyI+CiAgPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMTUiIGZpbGw9IiM3MTQ2QjYiLz4KICA8cGF0aCBkPSJNMTUgNDNWMjFsMTcgMTggMTctMTh2MjIiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+Cjwvc3ZnPgo=';
  const app = document.getElementById('app');
  const now = Date.now();
  const minute = 60_000;
  const icons = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 13.5 7 4m0-11-7 4"/>',
    settings: '<path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.6 1.6 0 0 0 .32 1.77l.07.07-2.12 2.12-.07-.07a1.6 1.6 0 0 0-1.77-.32l-.1.04a1.6 1.6 0 0 0-1 1.49V21h-3v-.9a1.6 1.6 0 0 0-1-1.49l-.1-.04a1.6 1.6 0 0 0-1.77.32l-.07.07-2.12-2.12.07-.07A1.6 1.6 0 0 0 7.07 15l-.04-.1a1.6 1.6 0 0 0-1.49-1H5v-3h.54a1.6 1.6 0 0 0 1.49-1l.04-.1a1.6 1.6 0 0 0-.32-1.77l-.07-.07 2.12-2.12.07.07a1.6 1.6 0 0 0 1.77.32l.1-.04a1.6 1.6 0 0 0 1-1.49V4h3v.7a1.6 1.6 0 0 0 1 1.49l.1.04a1.6 1.6 0 0 0 1.77-.32l.07-.07 2.12 2.12-.07.07a1.6 1.6 0 0 0-.32 1.77l.04.1a1.6 1.6 0 0 0 1.49 1H21v3h-.31a1.6 1.6 0 0 0-1.49 1l-.04.1Z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6m5 4v7m4-7v7"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    arrowLeft: '<path d="m15 18-6-6 6-6"/>',
    arrowRight: '<path d="m9 18 6-6-6-6"/>',
    move: '<path d="m5 9-3 3 3 3m-3-3h14m3-3 3 3-3 3m3-3H9"/>',
    copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    external: '<path d="M14 3h7v7M10 14 21 3M21 13v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alert: '<path d="M10.3 3.5 2 18a2 2 0 0 0 1.8 3h16.4a2 2 0 0 0 1.8-3L13.7 3.5a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
    upload: '<path d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4"/>',
    download: '<path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3"/>',
    rotate: '<path d="M3 11a9 9 0 1 1 3 7M3 4v7h7"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    ordered: '<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M3 16h3v3H3v2h3"/>',
    quote: '<path d="M3 21c3 0 5-2 5-5v-4H3V4h8v12c0 4-3 7-8 7m10-2c3 0 5-2 5-5v-4h-5V4h8v12c0 4-3 7-8 7"/>',
    code: '<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-12-2 16"/>',
    spark: '<path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Zm7 15 .8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17Z"/>',
    keyboard: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 13h.01M10 13h.01M14 13h.01M18 13h.01M7 16h10"/>',
    lock: '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    archive: '<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    checklist: '<rect x="3" y="4" width="6" height="6" rx="1"/><path d="m4.5 7 1.4 1.4L8.5 5.5M13 7h8M3 17h6M13 17h8"/>',
    table: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 10h18M9 4v16M15 4v16"/>',
    video: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z"/>',
    todo: '<rect x="3" y="4" width="6" height="6" rx="1"/><path d="m4.5 7 1.4 1.4L8.5 5.5M13 7h8M4 17h6M13 17h8"/>',
    square: '<rect x="4" y="4" width="16" height="16" rx="4"/>',
    inbox: '<path d="M4 5h16l2 11v4H2v-4L4 5Z"/><path d="M2 16h6l2 3h4l2-3h6"/>',
  };
  const ico = (name, size='') => `<svg class="icon ${size}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.file}</svg>`;
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uuid = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const token = () => Array.from(crypto.getRandomValues(new Uint8Array(24)), x => x.toString(16).padStart(2, '0')).join('');
  const DEFAULT_NOTE_ICON = '📝';
  const pad = n => String(n).padStart(2,'0');
  function dateKey(timestamp) {
    const d = new Date(timestamp);
    const valid = Number.isNaN(d.getTime()) ? new Date() : d;
    return `${valid.getFullYear()}-${pad(valid.getMonth()+1)}-${pad(valid.getDate())}`;
  }
  function timeKey(timestamp) {
    const d = new Date(timestamp);
    const valid = Number.isNaN(d.getTime()) ? new Date() : d;
    return `${pad(valid.getHours())}:${pad(valid.getMinutes())}`;
  }
  const isDateKey = value => {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year,month,day] = value.split('-').map(Number);
    const d = new Date(year,month-1,day);
    return d.getFullYear()===year && d.getMonth()===month-1 && d.getDate()===day;
  };
  const isTimeKey = value => typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
  const assignedDate = note => isDateKey(note?.noteDate) ? note.noteDate : dateKey(note?.createdAt);
  const assignedTime = note => isTimeKey(note?.noteTime) ? note.noteTime : timeKey(note?.createdAt);
  const dateFromKey = key => { const [y,m,d]=key.split('-').map(Number); return new Date(y,m-1,d,12); };
  const longDate = key => dateFromKey(key).toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const shortDate = key => dateFromKey(key).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});
  const readableTime = value => {
    const [hours,minutes] = value.split(':').map(Number);
    return new Date(2000,0,1,hours,minutes).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'});
  };

  const EMOJI_SECTIONS = [
    {label:'Everyday', values:['📝','📄','📌','📎','📂','📚','📖','📅','✅','💬','💡','🗂️']},
    {label:'Work & learning', values:['🧠','💻','🛠️','📊','🔬','🧮','🎓','🚀','🎯','🔎','🧪','🗒️']},
    {label:'Life & creative', values:['🌿','☕','🌻','🎨','🎵','📸','✈️','🏠','❤️','⭐','🌙','🔥']}
  ];
  function normalizedIcon(note) {
    const choice = note?.icon;
    if (choice?.type === 'emoji' && typeof choice.value === 'string' && choice.value.length < 30) return choice;
    if (choice?.type === 'image' && typeof choice.value === 'string' && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i.test(choice.value) && choice.value.length < 150000) return choice;
    return {type:'emoji',value:DEFAULT_NOTE_ICON};
  }
  function noteIconMarkup(note, extra='') {
    const icon = normalizedIcon(note);
    return icon.type === 'image' ? `<span class="note-emoji ${extra} is-custom"><img alt="" loading="lazy" src="${escapeHTML(icon.value)}" /></span>` : `<span class="note-emoji ${extra}" aria-hidden="true">${escapeHTML(icon.value)}</span>`;
  }
  const relative = t => { const diff = Math.max(0, Date.now() - Number(t)); if (diff < 60_000) return 'Just now'; if (diff < 3_600_000) return `${Math.round(diff / minute)} min ago`; if (diff < 86_400_000) return `${Math.round(diff / 3_600_000)}h ago`; if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`; return new Date(t).toLocaleDateString(undefined, {day: 'numeric',month:'short'}); };
  const plain = html => { const d = document.createElement('div'); d.innerHTML = sanitizeHTML(html,true); d.querySelectorAll('figure[data-youtube-id]').forEach(f=>f.replaceWith(document.createTextNode('YouTube video '))); return d.textContent?.replace(/\s+/g, ' ').trim() || ''; };
  const allowedTags = new Set(['P','DIV','BR','H1','H2','H3','H4','STRONG','B','EM','I','U','S','DEL','UL','OL','LI','BLOCKQUOTE','PRE','CODE','A','HR','TABLE','THEAD','TBODY','TFOOT','TR','TH','TD','IMG','FIGURE','FIGCAPTION','SPAN','MARK','INPUT','IFRAME']);
  const blockedTags = new Set(['SCRIPT','STYLE','OBJECT','EMBED','SVG','MATH','FORM','META','LINK','TEMPLATE','VIDEO','AUDIO','CANVAS','BUTTON','SELECT','TEXTAREA']);
  const MAX_INLINE_IMAGE_DATA = 900000;
  const safeImageSource = src => {
    if (!src || typeof src !== 'string') return null;
    const url = src.trim();
    // Only raster images can be embedded as data. Remote references may stop working later.
    if (/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/i.test(url) && url.length < MAX_INLINE_IMAGE_DATA) return url;
    if (/^https:\/\//i.test(url) && !/\.svg(?:[?#]|$)/i.test(url) && url.length <= 2048) return url;
    return null;
  };
  // Only a recognized YouTube video ID ever reaches the iframe markup; pasted
  // arbitrary iframes, HTML attributes, and unknown providers are discarded.
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/;
  function youtubeIdFromUrl(value) {
    if(typeof value!=='string' || value.length>2048)return null;
    let url;
    try { url = new URL(value.trim()); } catch { return null; }
    if(url.protocol!=='https:' || url.username || url.password)return null;
    const host=url.hostname.toLowerCase();
    let id=null;
    if(host==='youtu.be' || host==='www.youtu.be') {
      const match=url.pathname.match(/^\/([\w-]{11})\/?$/);id=match?.[1]||null;
    } else if(['youtube.com','www.youtube.com','m.youtube.com','music.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host)) {
      if(url.pathname==='/watch') id=url.searchParams.get('v');
      else id=url.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{11})\/?$/)?.[1]||null;
    }
    return id && youtubeIdPattern.test(id) ? id : null;
  }
  function youtubeFigureHTML(id,readOnly=false){
    if(!youtubeIdPattern.test(id))return '';
    return `<figure class="youtube-embed" data-youtube-id="${id}" contenteditable="false">
      <div class="youtube-player"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video player" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
      <figcaption><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener noreferrer">Watch on YouTube</a></figcaption>
      ${readOnly?'':'<button class="video-remove" type="button" data-action="remove-embedded-video" title="Remove video from note" aria-label="Remove embedded video">×</button>'}
    </figure>`;
  }
  function normalizeChecklists(root) {
    // Common paste formats include native checkboxes, task-list metadata,
    // aria-checked controls, and list items beginning with [x] / [ ].
    for (const list of Array.from(root.querySelectorAll('ul,ol'))) {
      const items=Array.from(list.children).filter(child=>child.tagName==='LI');
      if (!items.length) continue;
      const hinted=/(task|checklist|todo|to-do)/i.test(`${list.getAttribute('data-type')||''} ${list.getAttribute('class')||''}`)
        || list.hasAttribute('data-task-list');
      const isTask=hinted || items.some(li=>li.querySelector('input[type="checkbox"],[role="checkbox"]')
        || li.hasAttribute('data-checked') || li.hasAttribute('aria-checked')
        || /^\s*\[[ xX]\]\s/.test(li.textContent||''));
      if (!isTask) continue;
      if (list.tagName==='OL') { const ul=root.ownerDocument.createElement('ul'); while(list.firstChild)ul.appendChild(list.firstChild);list.replaceWith(ul);ul.setAttribute('data-task-list','true'); }
      else list.setAttribute('data-task-list','true');
      for (const li of items) {
        let check=li.querySelector('input[type="checkbox"]');
        const pseudo=li.querySelector('[role="checkbox"]');
        const prefix=(li.firstChild?.nodeType===3 ? (li.firstChild.nodeValue||'').match(/^\s*\[([ xX])\]\s*/) : null);
        const dataStatus=li.getAttribute('data-checked') ?? li.getAttribute('aria-checked') ?? pseudo?.getAttribute('aria-checked');
        const checked=check ? check.hasAttribute('checked') : (dataStatus==='true' || dataStatus==='checked' || (prefix?.[1]||'').toLowerCase()==='x');
        if(pseudo) pseudo.remove();
        if(prefix && li.firstChild?.nodeType===3) li.firstChild.nodeValue=li.firstChild.nodeValue.slice(prefix[0].length);
        if(!check){check=root.ownerDocument.createElement('input');li.prepend(check);}
        check.setAttribute('type','checkbox');
        if(checked)check.setAttribute('checked','');else check.removeAttribute('checked');
      }
    }
  }
  function sanitizeHTML(html, readOnly=false) {
    const doc = new DOMParser().parseFromString(`<div id="sanitizer-root">${String(html || '')}</div>`, 'text/html');
    const root = doc.getElementById('sanitizer-root');
    normalizeChecklists(root);
    const walk = node => {
      for (const child of Array.from(node.childNodes)) {
        if (child.nodeType === 8) { child.remove(); continue; }
        if (child.nodeType !== 1) continue;
        const tag = child.tagName;
        if (tag === 'FIGURE' && child.hasAttribute('data-youtube-id')) {
          const id=child.getAttribute('data-youtube-id');
          if(youtubeIdPattern.test(id)){child.outerHTML=youtubeFigureHTML(id,readOnly);continue;}
          // Invalid video ID: never allow unknown iframe contents through.
        }
        if (tag === 'IFRAME') {
          const id=youtubeIdFromUrl(child.getAttribute('src'));
          if(id) child.outerHTML=youtubeFigureHTML(id,readOnly);
          else child.remove();
          continue;
        }
        if (blockedTags.has(tag)) { child.remove(); continue; }
        const href = tag === 'A' ? child.getAttribute('href') : null;
        const src = tag === 'IMG' ? safeImageSource(child.getAttribute('src')) : null;
        const alt = tag === 'IMG' ? String(child.getAttribute('alt')||'').slice(0,240) : null;
        const spanStyle = tag === 'SPAN' ? String(child.getAttribute('style')||'').toLowerCase() : '';
        const colSpan = ['TH','TD'].includes(tag) ? child.getAttribute('colspan') : null;
        const rowSpan = ['TH','TD'].includes(tag) ? child.getAttribute('rowspan') : null;
        const isTaskList = tag==='UL' && child.getAttribute('data-task-list')==='true';
        const taskCheckbox = tag==='INPUT' && child.getAttribute('type')==='checkbox' && child.parentElement?.tagName==='LI' && child.parentElement?.parentElement?.getAttribute('data-task-list')==='true';
        if(tag==='INPUT') {
          // Never keep pasted form inputs. A checkbox inside a task list is the only exception.
          if(!taskCheckbox){child.remove();continue;}
          const checked=child.hasAttribute('checked');
          Array.from(child.attributes).forEach(a=>child.removeAttribute(a.name));
          child.setAttribute('type','checkbox'); child.setAttribute('contenteditable','false');
          child.setAttribute('aria-label','Mark task complete');
          if(checked)child.setAttribute('checked','');
          if(readOnly)child.setAttribute('disabled','');
          continue;
        }
        if (tag === 'IMG') {
          // Avoid broken, dangerous and unlimited-length image payloads.
          if (!src) { child.remove(); continue; }
          Array.from(child.attributes).forEach(a=>child.removeAttribute(a.name));
          child.setAttribute('src',src);
          child.setAttribute('alt',alt);
          child.setAttribute('loading','lazy');
          child.setAttribute('decoding','async');
          child.setAttribute('referrerpolicy','no-referrer');
          continue;
        }
        walk(child);
        if (!allowedTags.has(tag)) { child.replaceWith(...Array.from(child.childNodes)); continue; }
        Array.from(child.attributes).forEach(a=>child.removeAttribute(a.name));
        if(isTaskList)child.setAttribute('data-task-list','true');
        if (tag === 'A' && href && /^(https?:\/\/|mailto:)/i.test(href.trim())) {
          child.setAttribute('href',href.trim()); child.setAttribute('target','_blank'); child.setAttribute('rel','noopener noreferrer');
        }
        if (['TH','TD'].includes(tag)) {
          if (/^[2-9]$|^1[0-2]$/.test(colSpan||'')) child.setAttribute('colspan',colSpan);
          if (/^[2-9]$|^1[0-2]$/.test(rowSpan||'')) child.setAttribute('rowspan',rowSpan);
        }
        if (tag === 'SPAN') {
          // Word, Google Docs and web articles often express basic rich formatting as styled spans.
          let wrapped = document.createDocumentFragment();
          wrapped.append(...Array.from(child.childNodes));
          const formats = [];
          if (/font-weight\s*:\s*(bold|[6-9]00)/.test(spanStyle)) formats.push('strong');
          if (/font-style\s*:\s*italic/.test(spanStyle)) formats.push('em');
          if (/text-decoration[^;]*underline/.test(spanStyle)) formats.push('u');
          if (/text-decoration[^;]*line-through/.test(spanStyle)) formats.push('s');
          for (const format of formats) { const wrapper=document.createElement(format);wrapper.append(wrapped);wrapped=document.createDocumentFragment();wrapped.append(wrapper); }
          child.replaceWith(wrapped);
        }
      }
    };
    walk(root);
    return root.innerHTML;
  }
  const seed = () => ({
    version: 1,
    projects: [
      {id:'p-learning',name:'Learning',createdAt:now-7*86_400_000},
      {id:'p-ideas',name:'Ideas & projects',createdAt:now-6*86_400_000},
      {id:'p-personal',name:'Personal',createdAt:now-5*86_400_000},
    ],
    notes: [
      {id:'n-welcome',icon:{type:'emoji',value:'🌿'},projectId:'p-personal',title:'Notes for the weekend',createdAt:now-5*86_400_000,updatedAt:now-4*minute,deletedAt:null,content:'<p>Some thoughts from the weekend. I have been making small changes to my routine and keeping track of what actually works.</p><h2>Things I want to remember</h2><ul><li>Make time to read, even if it is just a few pages.</li><li>Write things down while they are fresh.</li><li>Finish the small things before picking up more.</li></ul><p>Nothing groundbreaking. Just a useful place to start.</p>'},
      {id:'n-thinking',icon:{type:'emoji',value:'🧠'},projectId:'p-learning',title:'Notes on systems thinking',createdAt:now-4*86_400_000,updatedAt:now-67*minute,deletedAt:null,content:'<p>Systems thinking is about understanding relationships, feedback loops, and how small changes affect the whole.</p><h2>Three useful questions</h2><ol><li>What parts make up this system?</li><li>How do those parts influence each other?</li><li>What unintended outcomes might follow?</li></ol>'},
      {id:'n-ideas',icon:{type:'emoji',value:'💡'},projectId:'p-ideas',title:'Ideas worth building',createdAt:now-3*86_400_000,updatedAt:now-3*3_600_000,deletedAt:null,content:'<p>A simple list of things I might build someday.</p><ul><li>A delightful digital business card.</li><li>A small personal notes workspace.</li><li>A clean reading tracker.</li></ul><p><strong>Reminder:</strong> Ship something small before starting something new.</p>'},
      {id:'n-weekly',icon:{type:'emoji',value:'📅'},projectId:null,title:'This week, in focus',createdAt:now-2*86_400_000,updatedAt:now-21*3_600_000,deletedAt:null,content:'<h2>Priorities</h2><ul><li>Finish one meaningful piece of work.</li><li>Read and take useful notes.</li><li>Make space for curiosity.</li></ul><p>Small, steady progress adds up.</p>'},
      {id:'n-reading',icon:{type:'emoji',value:'📚'},projectId:'p-learning',title:'Reading list',createdAt:now-2*86_400_000,updatedAt:now-30*3_600_000,deletedAt:null,content:'<p>Books and articles worth revisiting.</p><ul><li>Designing calm interfaces</li><li>Writing as a tool for thought</li><li>Getting the fundamentals right</li></ul>'},
      {id:'n-checklist',icon:{type:'emoji',value:'✅'},projectId:'p-ideas',title:'A small launch checklist',createdAt:now-86_400_000,updatedAt:now-44*3_600_000,deletedAt:null,content:'<h2>Before publishing</h2><ul><li>Write a clear README.</li><li>Test the important flows.</li><li>Check accessibility and mobile layouts.</li><li>Make setup easy for others.</li></ul>'},
    ],
    shares: [],
    // Example data appears only in a brand-new demo. Existing workspaces migrate to an empty task list.
    tasks: [
      {id:'t-sample-1',title:'Review notes for today',description:'A quick example of a dated task. Change or delete it whenever you like.',dueDate:dateKey(now),createdAt:now-75*minute,updatedAt:now-75*minute,completedAt:null,deletedAt:null,subtasks:[{id:'s-sample-1',title:'Read recent notes',completedAt:null},{id:'s-sample-2',title:'Capture one takeaway',completedAt:null}]},
      {id:'t-sample-2',title:'Plan my next small project',description:'Tasks in Inbox do not need a due date.',dueDate:null,createdAt:now-2*60*minute,updatedAt:now-2*60*minute,completedAt:null,deletedAt:null,subtasks:[]}
    ]
  });
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return seed();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.notes) || !Array.isArray(parsed.projects) || !Array.isArray(parsed.shares)) return seed();
      return parsed;
    } catch { return seed(); }
  }
  let db = load();
  // Non-destructive upgrade of v0.7 workspaces. Task records never alter existing notes.
  if (!Array.isArray(db.tasks)) db.tasks=[];
  for (const task of db.tasks) {
    if (!Array.isArray(task.subtasks)) task.subtasks=[];
    if (!isDateKey(task.dueDate)) task.dueDate=null;
    if (typeof task.description!=='string') task.description='';
    if (!Number.isFinite(task.createdAt)) task.createdAt=Date.now();
    if (!Number.isFinite(task.updatedAt)) task.updatedAt=task.createdAt;
    task.completedAt ||= null;
    task.deletedAt ||= null;
    task.subtasks=task.subtasks.filter(sub=>sub && typeof sub.title==='string' && sub.id);
  }
  // Migrate v0.2 notes without altering their immutable creation timestamps.
  for (const n of db.notes) {
    if (!isDateKey(n.noteDate)) n.noteDate = dateKey(n.createdAt);
    if (!isTimeKey(n.noteTime)) n.noteTime = timeKey(n.createdAt);
  }
  let calendarMonth = new Date(new Date().getFullYear(),new Date().getMonth(),1);
  let selectedCalendarDate = dateKey(Date.now());

  let view = {type:'note', id: db.notes.some(n => n.id === 'n-welcome' && !n.deletedAt) ? 'n-welcome' : (db.notes.find(n => !n.deletedAt)?.id ?? null)};
  if (!view.id) view = {type:'all'};
  let expanded = new Set();
  let sidebarOpen = false;
  let saveTimer = null;
  let dirty = false;
  let draggingId = null;
  let modal = null;
  let activeTableCell = null;
  let expandedTaskId = null;
  // Selection is UI-only. Closing Completed never deletes or changes task data.
  let completedCollapsed = true;
  let completedSelectionMode = false;
  // Completion groups are UI state, not stored task data. Today starts expanded.
  const expandedCompletedGroups = new Set(['today']);
  const selectedCompletedIds = new Set();
  let pendingCompletedDeletionIds = null;
  const liveTasks = () => db.tasks.filter(t=>!t.deletedAt);
  const remainingTasks = () => liveTasks().filter(t=>!t.completedAt).length;
  const subtasksDone = task => (task.subtasks||[]).filter(sub=>sub.completedAt).length;
  const taskDue = task => isDateKey(task?.dueDate) ? task.dueDate : null;
  const onDayTasks = day => liveTasks().filter(t=>taskDue(t)===day)
    .sort((a,b)=>(Boolean(a.completedAt)-Boolean(b.completedAt)) || (Number(b.createdAt)-Number(a.createdAt)) || a.id.localeCompare(b.id));
  function rerenderAtScroll() {
    const top=document.querySelector('.app-main-scroll')?.scrollTop || 0;
    render();const el=document.querySelector('.app-main-scroll');if(el)el.scrollTop=top;
  }
  function createTask(title, dueDate=null, fromCalendar=false) {
    const clean=String(title||'').trim().slice(0,180);
    if (!clean) {toast('Enter a task name');return null;}
    if(dueDate!==null && !isDateKey(dueDate)){toast('Choose a valid date');return null;}
    const created=Date.now();
    const task={id:uuid(),title:clean,description:'',dueDate,subtasks:[],createdAt:created,updatedAt:created,completedAt:null,deletedAt:null};
    db.tasks.push(task);save();
    if(view.type==='calendar' && fromCalendar) rerenderAtScroll();
    else {expandedTaskId=task.id;nav('tasks');}
    toast('Task added');return task;
  }
  function taskById(id) {return db.tasks.find(t=>t.id===id&&!t.deletedAt);}
  function toggleTask(id) {
    const t=taskById(id);if(!t)return;
    t.completedAt=t.completedAt?null:Date.now();
    if(!t.completedAt)selectedCompletedIds.delete(id);
    t.updatedAt=Date.now();save();rerenderAtScroll();
  }
  function setAllCompletedSelected(selected) {
    if (!completedSelectionMode) return;
    const ids=liveTasks().filter(t=>t.completedAt).map(t=>t.id);
    selectedCompletedIds.clear();
    if(selected)for(const id of ids)selectedCompletedIds.add(id);
    rerenderAtScroll();
  }
  function toggleCompletedSelectionMode() {
    completedSelectionMode=!completedSelectionMode;
    selectedCompletedIds.clear();
    rerenderAtScroll();
  }
  function toggleCompletedGroup(id) {
    const valid=['today','week','month','three-months','this-year','previous-years'];
    if(!valid.includes(id))return;
    if(expandedCompletedGroups.has(id))expandedCompletedGroups.delete(id);
    else expandedCompletedGroups.add(id);
    rerenderAtScroll();
  }
  function openClearSelectedCompletedDialog() {
    if(!completedSelectionMode)return;
    const ids=liveTasks().filter(t=>t.completedAt && selectedCompletedIds.has(t.id)).map(t=>t.id);
    if(!ids.length)return;
    const count=ids.length;
    showModal(`${modalHead(`Permanently delete ${count} completed ${count===1?'task':'tasks'}?`)}
      <div class="todo-permanent-warning" role="alert">${ico('alert','small')}<p><strong>This action cannot be undone.</strong><br>Selected tasks and their subtasks will be permanently deleted. They cannot be restored from Trash.</p></div>
      <div class="modal-actions"><button type="button" class="button" data-action="close-modal" id="completed-delete-cancel">Cancel</button><button type="button" class="button todo-confirm-delete" data-action="completed-confirm-delete">${ico('trash','tiny')} Delete permanently</button></div>`);
    pendingCompletedDeletionIds=ids;
    document.getElementById('completed-delete-cancel')?.focus();
  }
  function confirmClearSelectedCompleted() {
    if(!Array.isArray(pendingCompletedDeletionIds) || !pendingCompletedDeletionIds.length)return;
    // Validate again before mutation: incomplete or already removed tasks can never be purged here.
    const eligible=new Set(liveTasks().filter(t=>t.completedAt && selectedCompletedIds.has(t.id)).map(t=>t.id));
    const ids=new Set(pendingCompletedDeletionIds.filter(id=>eligible.has(id)));
    if(!ids.size){closeModal();rerenderAtScroll();return;}
    const before=db.tasks;
    db.tasks=db.tasks.filter(t=>!ids.has(t.id));
    // Don't display success or lose the in-memory tasks if browser storage failed.
    if(!save()){db.tasks=before;return;}
    if(ids.has(expandedTaskId))expandedTaskId=null;
    completedSelectionMode=false;
    selectedCompletedIds.clear();
    closeModal();
    rerenderAtScroll();
    toast(`${ids.size} completed ${ids.size===1?'task':'tasks'} permanently deleted`);
  }
  function calendarMonthsAgo(reference,months) {
    const year=reference.getFullYear(),month=reference.getMonth()-months;
    const lastDay=new Date(year,month+1,0).getDate();
    return new Date(year,month,Math.min(reference.getDate(),lastDay),0,0,0,0);
  }
  function completedTaskGroups(completed) {
    const today=new Date();today.setHours(0,0,0,0);
    const day7=new Date(today);day7.setDate(day7.getDate()-7);
    const day30=new Date(today);day30.setDate(day30.getDate()-30);
    const three=calendarMonthsAgo(today,3).getTime();
    const startYear=new Date(today.getFullYear(),0,1).getTime();
    const buckets=[
      {id:'today',label:'Today',items:[]},
      {id:'week',label:'Within Last 7 Days',items:[]},
      {id:'month',label:'Within Last 30 Days',items:[]},
      {id:'three-months',label:'Within Last 3 Months',items:[]},
      {id:'this-year',label:'Within This Year',items:[]},
      {id:'previous-years',label:'Previous Years',items:[]}
    ];
    for(const task of completed) {
      const done=Number(task.completedAt);
      // Exclusive buckets. The rolling three-month period takes precedence over
      // calendar-year grouping when a year boundary is crossed.
      const index=done>=today.getTime()?0:done>=day7.getTime()?1:done>=day30.getTime()?2:done>=three?3:done>=startYear?4:5;
      buckets[index].items.push(task);
    }
    return buckets.filter(group=>group.items.length);
  }
  function toggleSubtask(id,subId) {
    const t=taskById(id),sub=t?.subtasks.find(s=>s.id===subId);if(!sub)return;
    sub.completedAt=sub.completedAt?null:Date.now();t.updatedAt=Date.now();save();rerenderAtScroll();
  }
  function addSubtask(id,title) {
    const t=taskById(id),clean=String(title||'').trim().slice(0,180);
    if(!t||!clean){toast('Enter a subtask name');return;}
    t.subtasks.push({id:uuid(),title:clean,completedAt:null});t.updatedAt=Date.now();save();rerenderAtScroll();
    document.getElementById('subtask-new')?.focus();
  }
  function deleteTask(id) {
    const t=taskById(id);if(!t)return;
    t.deletedAt=Date.now();t.updatedAt=t.deletedAt;
    if(expandedTaskId===id)expandedTaskId=null;
    selectedCompletedIds.delete(id);
    save();rerenderAtScroll();toast('Task moved to Trash');
  }
  function restoreTask(id) {
    const t=db.tasks.find(t=>t.id===id&&t.deletedAt);if(!t)return;
    t.deletedAt=null;t.updatedAt=Date.now();save();nav('trash');toast('Task restored');
  }
  const currentNote = () => db.notes.find(n => n.id === view.id && !n.deletedAt);
  const currentProject = () => db.projects.find(p => p.id === view.id);
  const notes = () => db.notes.filter(n => !n.deletedAt).sort((a,b) => Number(b.updatedAt)-Number(a.updatedAt));
  const projectName = id => db.projects.find(p => p.id === id)?.name || 'Unfiled';
  const countNotes = id => db.notes.filter(n => !n.deletedAt && n.projectId === id).length;
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); dirty = false; updateStatus('Saved locally'); return true; }
    catch { updateStatus('Save failed', true); toast('Storage is unavailable or full. Export your notes.', 'error'); return false; }
  }
  function scheduleSave() {
    dirty = true; updateStatus('Saving…'); clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { save(); renderSidebar(); updateBreadcrumb(); updateWordCount(); }, 450);
  }
  function flushSave() { if (dirty) { clearTimeout(saveTimer); save(); } }
  function updateStatus(message, error=false) {
    const el = document.getElementById('save-status');
    if (!el) return;
    el.className = 'status' + (message === 'Saving…' ? ' saving' : '');
    el.innerHTML = `<span class="status-dot" style="${error ? 'background:#c34c60' : ''}"></span><span>${escapeHTML(message)}</span>`;
  }
  function toast(message) {
    let wrap = document.querySelector('.toasts');
    if (!wrap) { wrap = document.createElement('div'); wrap.className='toasts'; document.body.appendChild(wrap); }
    const item = document.createElement('div'); item.className='toast'; item.innerHTML=`${ico('check', 'tiny')}<span>${escapeHTML(message)}</span>`;
    wrap.appendChild(item); setTimeout(()=>item.remove(), 3400);
  }
  function nav(type, id) { flushSave(); view={type,id}; sidebarOpen=false; render(); document.querySelector('.app-main-scroll')?.scrollTo(0,0); }
  function createNote(projectId=null) {
    flushSave(); const created=Date.now(); const note={id:uuid(),projectId,title:'',icon:{type:'emoji',value:DEFAULT_NOTE_ICON},content:'',createdAt:created,updatedAt:created,noteDate:dateKey(created),noteTime:timeKey(created),deletedAt:null};
    db.notes.push(note); save(); nav('note',note.id);
    requestAnimationFrame(()=>document.querySelector('#note-title')?.focus());
    toast(projectId ? `Note created in ${projectName(projectId)}` : 'New note created');
  }
  function createProject(name) {
    const trimmed=String(name||'').trim().slice(0,80); if (!trimmed) return toast('Add a project name');
    const p={id:uuid(),name:trimmed,createdAt:Date.now()}; db.projects.push(p); expanded.add(p.id); save(); closeModal(); nav('project',p.id); toast('Project created');
  }
  function moveNote(noteId, projectId) {
    const note=db.notes.find(n=>n.id===noteId && !n.deletedAt);
    if (!note || (projectId && !db.projects.some(p=>p.id===projectId))) return;
    if (note.projectId === projectId) { closeModal(); return; }
    note.projectId=projectId; note.updatedAt=Date.now();
    save(); closeModal(); render(); toast(projectId ? `Moved to ${projectName(projectId)}` : 'Moved to Unfiled');
  }
  function deleteNote(id) {
    const n=db.notes.find(n=>n.id===id && !n.deletedAt); if(!n) return;
    n.deletedAt=Date.now(); save(); closeModal(); nav('all'); toast('Note moved to Trash');
  }
  function restoreNote(id) {
    const n=db.notes.find(n=>n.id===id && n.deletedAt); if(!n) return;
    n.deletedAt=null; n.updatedAt=Date.now(); save(); nav('note',id); toast('Note restored');
  }
  function deleteProject(id) {
    const p=db.projects.find(p=>p.id===id); if (!p) return;
    if (!confirm(`Delete "${p.name}"? Its notes will become Unfiled, not deleted.`)) return;
    db.notes.forEach(n=> { if(n.projectId===id) n.projectId=null; });
    db.projects=db.projects.filter(x=>x.id!==id); db.shares=db.shares.filter(s=>!(s.type==='project' && s.targetId===id)); save(); closeModal(); nav('all'); toast('Project deleted; notes preserved');
  }
  function noteSidebarRow(n, nested=false) {
    const active=view.type==='note' && view.id===n.id;
    return `<button type="button" draggable="true" data-note-id="${escapeHTML(n.id)}" class="recent-row ${active?'active':''}" data-action="open-note" data-id="${escapeHTML(n.id)}" title="Drag into a project, or click to open">${noteIconMarkup(n,'nav-note-emoji')}<span class="label">${escapeHTML(n.title || 'Untitled')}</span></button>`;
  }
  function renderSidebar() {
    const target=document.getElementById('sidebar-scroll'); if (!target) return;
    const rows=db.projects.map(p=>{
      const active=view.type==='project' && view.id===p.id; const expandedNow=expanded.has(p.id);
      const nested=notes().filter(n=>n.projectId===p.id);
      return `<div class="project-group">
        <div class="nav-row ${active?'active':''}" data-drop-target="${escapeHTML(p.id)}">
          <button class="icon-btn" data-action="toggle-project" data-id="${escapeHTML(p.id)}" title="${expandedNow?'Collapse':'Expand'} project" aria-label="${expandedNow?'Collapse':'Expand'} ${escapeHTML(p.name)}" style="padding:0">${ico(expandedNow?'chevronDown':'chevronRight','tiny')}</button>
          <button class="project-name-btn" data-action="open-project" data-id="${escapeHTML(p.id)}" style="flex:1;min-width:0;text-align:left;border:0;background:none;padding:0;display:flex;gap:9px;align-items:center;color:inherit;font:inherit;cursor:pointer">${ico('book','small')}<span class="label" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHTML(p.name)}</span></button>
          <span class="count">${countNotes(p.id)}</span>
        </div>
        ${expandedNow ? `<div class="project-nested">${nested.length ? nested.map(n=>noteSidebarRow(n,true)).join('') : '<div class="sidebar-empty" style="padding:4px 8px">No notes yet</div>'}<button class="recent-row" data-action="new-note-project" data-id="${escapeHTML(p.id)}" style="color:var(--purple)">${ico('plus','tiny')}<span class="label">Add note</span></button></div>` : ''}
      </div>`;
    }).join('');
    target.innerHTML=`
      <section class="sidebar-section calendar-nav-section">
        <button class="calendar-nav ${view.type==='calendar'?'active':''}" data-action="show-calendar" aria-label="Open calendar">${ico('calendar','small')}<span>Calendar</span>${ico('arrowRight','tiny')}</button>
        <button class="calendar-nav ${view.type==='tasks'?'active':''}" data-action="show-tasks" aria-label="Open To-do List">${ico('todo','small')}<span>To-do List</span><span class="todo-nav-count">${remainingTasks()||''}</span></button>
      </section>
      <section class="sidebar-section">
        <div class="section-heading"><span>Projects</span><button aria-label="Create project" title="Create project" data-action="create-project">${ico('plus','tiny')}</button></div>
        ${rows || '<div class="sidebar-empty">Projects keep related notes together.</div>'}
        <div class="nav-row ${view.type==='unfiled'?'active':''}" data-drop-target="unfiled" style="margin-top:8px">
          ${ico('folder','small')}<button data-action="show-unfiled" class="label" style="border:0;background:none;color:inherit;text-align:left;font:inherit;cursor:pointer;padding:0">Unfiled</button><span class="count">${countNotes(null)}</span>
        </div>
      </section>
      <section class="sidebar-section"><div class="section-heading"><span>Recents</span><button data-action="show-all" title="View all notes" aria-label="View all notes">${ico('arrowRight','tiny')}</button></div>
        ${notes().length ? notes().map(n=>noteSidebarRow(n)).join('') : '<div class="sidebar-empty">Nothing here yet. Create your first note.</div>'}
      </section>`;
  }
  const crumb = () => {
    if (view.type==='note') { const n=currentNote(); return `<span>${escapeHTML(projectName(n?.projectId))}</span><span class="slash">/</span><strong>${escapeHTML(n?.title || 'Untitled')}</strong>`; }
    if (view.type==='project') return `<span>Projects</span><span class="slash">/</span><strong>${escapeHTML(currentProject()?.name || 'Project')}</strong>`;
    return `<strong>${view.type==='calendar'?'Calendar':view.type==='tasks'?'To-do List':view.type==='trash'?'Trash':view.type==='unfiled'?'Unfiled notes':'All notes'}</strong>`;
  };
  function updateBreadcrumb() { const el=document.getElementById('breadcrumb'); if(el) el.innerHTML=crumb(); }
  function renderTopbar() {
    const isNote=view.type==='note' && currentNote(), isProject=view.type==='project' && currentProject();
    return `<header class="topbar"><div class="topbar-left">
        <button class="icon-btn mobile-only" aria-label="Open navigation" title="Open navigation" data-action="sidebar-toggle">${ico('menu','large')}</button>
        <div id="breadcrumb" class="topbar-breadcrumb">${crumb()}</div>
      </div><div class="topbar-right">
        <div id="save-status" class="status"><span class="status-dot"></span><span>Saved locally</span></div>
        ${isNote || isProject ? `<button class="button share-main" data-action="share" data-type="${isNote?'note':'project'}" data-id="${escapeHTML(view.id)}">${ico('share','tiny')} Share</button>` : ''}
        ${isNote ? `<button class="icon-btn" title="Move note" aria-label="Move note" data-action="move-dialog" data-id="${escapeHTML(view.id)}">${ico('move')}</button><button class="icon-btn" title="More note actions" aria-label="More note actions" data-action="note-more" data-id="${escapeHTML(view.id)}">${ico('more')}</button>` : ''}
      </div></header>`;
  }
  function toolbar() {
    const btn=(label,title,cmd,val='')=>`<button type="button" class="tool-btn" data-format="${escapeHTML(cmd)}" ${val?`data-value="${escapeHTML(val)}"`:''} title="${escapeHTML(title)}" aria-label="${escapeHTML(title)}">${label}</button>`;
    return `<div class="editor-toolbar" role="toolbar" aria-label="Text formatting">
      ${btn('<strong>B</strong>','Bold','bold')}${btn('<em>I</em>','Italic','italic')}${btn('<u>U</u>','Underline','underline')}
      <span class="tool-divider"></span>${btn('H1','Heading 1','formatBlock','h1')}${btn('H2','Heading 2','formatBlock','h2')}${btn('¶','Paragraph','formatBlock','p')}
      <span class="tool-divider"></span>${btn(ico('list','small'),'Bullet list','insertUnorderedList')}${btn(ico('ordered','small'),'Numbered list','insertOrderedList')}${btn(ico('quote','small'),'Blockquote','formatBlock','blockquote')}
      <span class="tool-divider"></span>${btn(ico('link','small'),'Add link','link')}${btn(ico('code','small'),'Code block','formatBlock','pre')}
      <span class="tool-divider"></span><button type="button" class="tool-btn image-tool" data-action="insert-checklist" title="Insert interactive checklist" aria-label="Insert checklist">${ico('checklist','small')}<span>Tasks</span></button>
      <button type="button" class="tool-btn image-tool" data-action="insert-table" title="Insert simple table" aria-label="Insert table">${ico('table','small')}<span>Table</span></button>
      <button type="button" class="tool-btn image-tool" data-action="insert-editor-image" aria-label="Insert image" title="Insert an image">${ico('upload','small')}<span>Image</span></button>
      <input class="hidden" id="note-body-image-upload" type="file" accept="image/png,image/jpeg,image/webp" multiple aria-label="Choose images to insert" />
    </div><div id="table-tools" class="table-tools hidden" role="toolbar" aria-label="Edit selected table">
      <span class="table-tools-label">Table</span>
      <button type="button" data-action="table-add-row">+ Row</button>
      <button type="button" data-action="table-add-column">+ Column</button>
      <span class="tool-divider"></span>
      <button type="button" data-action="table-delete-row">− Row</button>
      <button type="button" data-action="table-delete-column">− Column</button>
      <button type="button" data-action="table-delete" class="table-delete">Delete table</button>
    </div>`;
  }
  function renderEditor() {
    const n=currentNote(); if(!n){view={type:'all'};return renderList('all');}
    return `<section class="editor-wrap">
      <div class="editor-topline"><button class="editor-project" data-action="move-dialog" data-id="${escapeHTML(n.id)}">${ico(n.projectId?'book':'folder','tiny')} ${escapeHTML(projectName(n.projectId))} ${ico('chevronDown','tiny')}</button><span class="editor-date">Edited ${escapeHTML(relative(n.updatedAt))}</span></div>
      <div class="note-icon-row"><button class="note-icon-control" type="button" data-action="edit-note-icon" data-id="${escapeHTML(n.id)}" title="Change note icon" aria-label="Change note icon">${noteIconMarkup(n,'editor-emoji')}<span class="icon-edit-indicator">${ico('plus','tiny')}</span></button></div>
      <textarea id="note-title" class="editor-title" rows="1" placeholder="Untitled" spellcheck="true" maxlength="180" aria-label="Note title">${escapeHTML(n.title)}</textarea>
      <div class="note-date-fields" aria-label="Note date and time">
        <span class="note-date-label">${ico('calendar','tiny')} Dated</span>
        <label class="sr-only" for="note-date">Note date</label><input type="date" id="note-date" value="${escapeHTML(assignedDate(n))}" aria-label="Note date" />
        <span class="note-date-separator">at</span>
        <label class="sr-only" for="note-time">Note time</label><input type="time" id="note-time" value="${escapeHTML(assignedTime(n))}" aria-label="Note time" />
      </div>
      ${toolbar()}
      <p class="slash-hint">Type <kbd>/</kbd> for blocks and formatting · <kbd>#</kbd> + space for a heading</p>
      <div id="note-content" class="editor-body" contenteditable="true" role="textbox" aria-label="Note content" aria-multiline="true" spellcheck="true" data-placeholder="Write anything, or type / for commands…">${sanitizeHTML(n.content)}</div>
      <div class="editor-footer"><span class="tip">Created ${escapeHTML(shortDate(dateKey(n.createdAt)))} · ${escapeHTML(readableTime(timeKey(n.createdAt)))}</span><span id="word-count">${plain(n.content).split(/\s+/).filter(Boolean).length} words</span></div>
    </section>`;
  }
  function updateWordCount() { const el=document.getElementById('word-count'); const n=currentNote(); if (el && n) el.textContent=`${plain(n.content).split(/\s+/).filter(Boolean).length} words`; }
  function renderProject() {
    const p=currentProject(); if (!p) return renderList('all');
    const items=notes().filter(n=>n.projectId===p.id);
    return `<section class="collection-wrap"><div class="collection-hero"><div class="collection-book">${ico('book')}</div>
      <div><div class="eyebrow">Project</div><h1 class="collection-title">${escapeHTML(p.name)}</h1><p class="collection-desc">${items.length} ${items.length===1?'note':'notes'} in this project</p>
        <div class="collection-actions"><button class="button button-primary" data-action="new-note-project" data-id="${escapeHTML(p.id)}">${ico('plus','tiny')} New note</button><button class="button" data-action="rename-project" data-id="${escapeHTML(p.id)}">Rename</button><button class="button button-danger" data-action="remove-project" data-id="${escapeHTML(p.id)}">Delete project</button></div>
      </div></div><div class="list-heading"><h2>Notes</h2><span style="font-size:11px;color:#aaa0ad">Newest updates first</span></div>
      ${items.length ? `<div class="note-cards">${items.map(noteCard).join('')}</div>` : `<div class="empty-state"><div class="empty-icon">${ico('file','large')}</div><h3>Your project is ready</h3><p>Add a note or move one here from the sidebar.</p><button class="button button-primary" data-action="new-note-project" data-id="${escapeHTML(p.id)}">${ico('plus','tiny')} Create a note</button></div>`}
    </section>`;
  }
  function noteCard(n) {
    return `<button type="button" draggable="true" data-note-id="${escapeHTML(n.id)}" class="note-card" data-action="open-note" data-id="${escapeHTML(n.id)}">${noteIconMarkup(n,'card-note-emoji')}<strong>${escapeHTML(n.title||'Untitled')}</strong><span class="excerpt">${escapeHTML(plain(n.content)||'No content yet')}</span><span class="date">${escapeHTML(shortDate(assignedDate(n)))} · ${escapeHTML(readableTime(assignedTime(n)))} · ${escapeHTML(projectName(n.projectId))}</span></button>`;
  }
  function renderList(type) {
    if(type==='trash')return renderTrash();
    const isTrash=type==='trash';
    const items=isTrash ? db.notes.filter(n=>n.deletedAt).sort((a,b)=>b.deletedAt-a.deletedAt) : (type==='unfiled' ? notes().filter(n=>n.projectId===null) : notes());
    const title=isTrash?'Trash':type==='unfiled'?'Unfiled notes':'All notes';
    const subtitle=isTrash?'Deleted notes stay here until you remove them permanently.':type==='unfiled'?'Notes that haven’t been assigned to a project.':'Every note, newest first.';
    return `<section class="all-wrap"><div class="eyebrow">Your workspace</div><h1 class="collection-title" style="margin-top:13px">${title}</h1><p class="collection-desc">${subtitle}</p>
      <div class="list-heading"><h2>${items.length} ${items.length===1?'note':'notes'}</h2>${!isTrash?`<button class="button button-primary" data-action="new-note">${ico('plus','tiny')} New note</button>`:''}</div>
      ${items.length ? isTrash ? `<div style="display:grid;gap:10px">${items.map(n=>`<div class="settings-item"><div><strong>${escapeHTML(n.title||'Untitled')}</strong><span>Deleted ${relative(n.deletedAt)}</span></div><div style="display:flex;gap:7px"><button class="button" data-action="restore-note" data-id="${escapeHTML(n.id)}">Restore</button><button class="button button-danger" data-action="purge-note" data-id="${escapeHTML(n.id)}">Delete forever</button></div></div>`).join('')}</div>` : `<div class="note-cards">${items.map(noteCard).join('')}</div>` : `<div class="empty-state"><div class="empty-icon">${ico(isTrash?'trash':'file','large')}</div><h3>${isTrash?'Nothing in the Trash':'A blank page awaits'}</h3><p>${isTrash?'Deleted notes will appear here.':'Start capturing your ideas in a new note.'}</p>${!isTrash?`<button class="button button-primary" data-action="new-note">${ico('plus','tiny')} Create a note</button>`:''}</div>`}
    </section>`;
  }
  function taskProgress(t) {
    const size=t.subtasks.length;
    return size ? `<span class="todo-progress">${subtasksDone(t)}/${size} subtasks</span>` : '';
  }
  function renderTaskRow(t) {
    const open=expandedTaskId===t.id;
    const selecting=!!t.completedAt && completedSelectionMode;
    return `<article class="todo-item ${t.completedAt?'done':''} ${selecting?'selection-mode':''}" data-task-id="${escapeHTML(t.id)}">
      <div class="todo-item-head">
        ${selecting?`<input class="todo-checkbox" type="checkbox" data-completed-select="${escapeHTML(t.id)}" ${selectedCompletedIds.has(t.id)?'checked':''} aria-label="Select ${escapeHTML(t.title)} for permanent deletion" />`:`<input class="todo-checkbox" type="checkbox" data-task-toggle="${escapeHTML(t.id)}" ${t.completedAt?'checked':''} aria-label="${t.completedAt?'Reopen':'Complete'} ${escapeHTML(t.title)}" />`}
        <button type="button" class="todo-item-summary" data-action="task-expand" data-id="${escapeHTML(t.id)}" aria-expanded="${open}">
          <span class="todo-task-name">${escapeHTML(t.title)}</span>
          <span class="todo-item-meta">${taskDue(t)?`<span>${ico('calendar','tiny')} ${escapeHTML(shortDate(t.dueDate))}</span>`:'<span>No due date</span>'}${taskProgress(t)}</span>
        </button>
        <button type="button" class="todo-expand-icon icon-btn" data-action="task-expand" data-id="${escapeHTML(t.id)}" aria-label="${open?'Collapse':'Expand'} task">${ico(open?'chevronDown':'chevronRight','small')}</button>
      </div>
      ${open?`<div class="todo-details">
        <div class="todo-field"><label for="task-name-${escapeHTML(t.id)}">Task name</label><input class="todo-text-input" id="task-name-${escapeHTML(t.id)}" data-task-title="${escapeHTML(t.id)}" maxlength="180" value="${escapeHTML(t.title)}"/></div>
        <div class="todo-field todo-date-field"><label for="task-date-${escapeHTML(t.id)}">Due date</label><div class="todo-date-control"><input id="task-date-${escapeHTML(t.id)}" data-task-due="${escapeHTML(t.id)}" type="date" value="${escapeHTML(t.dueDate||'')}"/><button class="todo-clear-date" data-action="task-clear-date" data-id="${escapeHTML(t.id)}" type="button" ${t.dueDate?'':'disabled'}>Clear</button></div></div>
        <div class="todo-subtasks-head"><strong>Subtasks</strong><span>${subtasksDone(t)}/${t.subtasks.length}</span></div>
        <div class="todo-subtasks">${t.subtasks.map(s=>`<div class="todo-subtask"><input class="todo-checkbox" type="checkbox" data-subtask-toggle="${escapeHTML(t.id)}" data-sub-id="${escapeHTML(s.id)}" ${s.completedAt?'checked':''} aria-label="Complete ${escapeHTML(s.title)}"/><input type="text" data-subtask-title="${escapeHTML(t.id)}" data-sub-id="${escapeHTML(s.id)}" value="${escapeHTML(s.title)}" maxlength="180" aria-label="Subtask name" class="todo-subtitle ${s.completedAt?'complete':''}"/><button type="button" class="icon-btn" data-action="subtask-delete" data-id="${escapeHTML(t.id)}" data-sub-id="${escapeHTML(s.id)}" aria-label="Remove subtask">${ico('x','tiny')}</button></div>`).join('')}
          <div class="todo-add-subtask"><input id="subtask-new" type="text" maxlength="180" placeholder="Add a subtask…" aria-label="New subtask" data-parent="${escapeHTML(t.id)}"/><button type="button" class="button" data-action="subtask-add" data-id="${escapeHTML(t.id)}">${ico('plus','tiny')} Add</button></div></div>
        <div class="todo-field"><label for="task-desc-${escapeHTML(t.id)}">Description / notes</label><textarea id="task-desc-${escapeHTML(t.id)}" data-task-desc="${escapeHTML(t.id)}" rows="3" placeholder="Details, context, or a reminder…">${escapeHTML(t.description)}</textarea></div>
        <div class="todo-details-footer"><span>${t.completedAt?'Completed':'Incomplete'} · Created ${escapeHTML(shortDate(dateKey(t.createdAt)))}</span><button type="button" class="todo-delete" data-action="task-delete" data-id="${escapeHTML(t.id)}">${ico('trash','tiny')} Move to Trash</button></div>
      </div>`:''}
    </article>`;
  }
  function renderTodos() {
    const all=liveTasks();
    const pending=all.filter(t=>!t.completedAt).sort((a,b)=>Number(b.createdAt)-Number(a.createdAt));
    const completed=all.filter(t=>t.completedAt).sort((a,b)=>Number(b.completedAt)-Number(a.completedAt)||a.id.localeCompare(b.id));
    const eligible=new Set(completed.map(t=>t.id));
    for(const id of selectedCompletedIds)if(!eligible.has(id))selectedCompletedIds.delete(id);
    const count=selectedCompletedIds.size;
    const allSelected=completed.length>0 && count===completed.length;
    const grouped=completedTaskGroups(completed);
    return `<section class="todo-wrap"><header class="todo-heading"><div class="eyebrow">Your workspace</div><h1>To-do List</h1><p>A clear place for things you need to do. Dates are optional.</p></header>
      <div class="todo-inbox-head"><div>${ico('inbox','small')}<strong>Inbox</strong></div><span>${pending.length} open ${pending.length===1?'task':'tasks'}</span></div>
      <div class="todo-create"><label class="sr-only" for="todo-new-name">New task name</label><input id="todo-new-name" maxlength="180" placeholder="Add a task…" autocomplete="off"/><div class="todo-create-bottom"><div><label for="todo-new-date">Due date (optional)</label><input id="todo-new-date" type="date" /></div><button type="button" class="button button-primary" data-action="task-create">${ico('plus','tiny')} Add task</button></div></div>
      <div class="todo-list" aria-label="Incomplete tasks">${pending.length?pending.map(renderTaskRow).join(''):`<div class="todo-empty">No open tasks. Add something when it comes to mind.</div>`}</div>
      <section class="todo-completed" aria-label="Completed task history">
        <div class="todo-completed-top">
          <button type="button" class="todo-completed-heading" data-action="completed-toggle" aria-expanded="${!completedCollapsed}" aria-controls="completed-history">
            <span class="todo-completed-label">${ico(completedCollapsed?'chevronRight':'chevronDown','small')}<strong>Completed</strong><span class="todo-completed-count">${completed.length}</span></span>
          </button>
          ${!completedCollapsed&&completed.length?`<button type="button" class="todo-select-mode ${completedSelectionMode?'active':''}" data-action="completed-select-mode" aria-pressed="${completedSelectionMode}">${completedSelectionMode?'Cancel':'Select'}</button>`:''}
        </div>
        ${!completedCollapsed?`<div id="completed-history" class="todo-completed-content">
          ${completed.length?`${completedSelectionMode?`<div class="todo-bulk-toolbar">
            <label class="todo-select-all"><input id="completed-select-all" type="checkbox" data-completed-select-all ${allSelected?'checked':''} aria-label="Select all completed tasks"/><span>Select all</span></label>
            <span class="todo-selection-count" aria-live="polite">${count} selected</span>
            <button class="todo-clear-selected" type="button" data-action="completed-clear-selected" ${count?'':'disabled'}>${ico('trash','tiny')} Clear selected</button>
          </div>`:''}${grouped.map(group=>`<section class="todo-history-group" aria-label="Completed ${escapeHTML(group.label)}">
            <button type="button" class="todo-history-group-head" data-action="completed-group-toggle" data-group="${group.id}" aria-expanded="${expandedCompletedGroups.has(group.id)}" aria-controls="completed-group-${group.id}">
              <span class="todo-history-group-label">${ico(expandedCompletedGroups.has(group.id)?'chevronDown':'chevronRight','tiny')}<strong>${escapeHTML(group.label)}</strong></span>
              <span class="todo-history-group-count">${group.items.length}</span>
            </button>
            ${expandedCompletedGroups.has(group.id)?`<div id="completed-group-${group.id}" class="todo-list" aria-label="Completed tasks ${escapeHTML(group.label)}">${group.items.map(renderTaskRow).join('')}</div>`:''}
          </section>`).join('')}`:`<div class="todo-empty">No completed tasks yet.</div>`}
          <p class="todo-completed-hint">Grouped by completion time, newest first.${completedSelectionMode?' Selection includes tasks in collapsed groups.':''}</p>
        </div>`:''}
      </section>
    </section>`;
  }
  function renderTrash() {
    const notesGone=db.notes.filter(n=>n.deletedAt).sort((a,b)=>b.deletedAt-a.deletedAt);
    const tasksGone=db.tasks.filter(t=>t.deletedAt).sort((a,b)=>b.deletedAt-a.deletedAt);
    return `<section class="all-wrap"><div class="eyebrow">Your workspace</div><h1 class="collection-title" style="margin-top:13px">Trash</h1><p class="collection-desc">Notes and tasks stay here until you permanently delete them.</p>
      <div class="list-heading"><h2>Notes (${notesGone.length})</h2></div>
      ${notesGone.length?`<div class="todo-trash-list">${notesGone.map(n=>`<div class="settings-item"><div><strong>${escapeHTML(n.title||'Untitled')}</strong><span>Deleted ${relative(n.deletedAt)}</span></div><div class="todo-trash-actions"><button class="button" data-action="restore-note" data-id="${escapeHTML(n.id)}">Restore</button><button class="button button-danger" data-action="purge-note" data-id="${escapeHTML(n.id)}">Delete forever</button></div></div>`).join('')}</div>`:'<p class="todo-trash-empty">No deleted notes.</p>'}
      <div class="list-heading"><h2>Tasks (${tasksGone.length})</h2></div>
      ${tasksGone.length?`<div class="todo-trash-list">${tasksGone.map(t=>`<div class="settings-item"><div><strong>${escapeHTML(t.title)}</strong><span>Deleted ${relative(t.deletedAt)}</span></div><div class="todo-trash-actions"><button class="button" data-action="task-restore" data-id="${escapeHTML(t.id)}">Restore</button><button class="button button-danger" data-action="task-purge" data-id="${escapeHTML(t.id)}">Delete forever</button></div></div>`).join('')}</div>`:'<p class="todo-trash-empty">No deleted tasks.</p>'}
    </section>`;
  }
  function calendarNotes(key) {
    return db.notes.filter(n=>!n.deletedAt && assignedDate(n)===key)
      .sort((a,b)=>assignedTime(b).localeCompare(assignedTime(a)) || Number(b.createdAt)-Number(a.createdAt) || a.id.localeCompare(b.id));
  }
  function renderCalendar() {
    const year=calendarMonth.getFullYear(), month=calendarMonth.getMonth();
    const first=new Date(year,month,1), offset=(first.getDay()+6)%7;
    const totalDays=new Date(year,month+1,0).getDate();
    const cellCount=Math.ceil((offset+totalDays)/7)*7;
    const counts=new Map(), taskCounts=new Map();
    for (const n of db.notes) if (!n.deletedAt) counts.set(assignedDate(n),(counts.get(assignedDate(n))||0)+1);
    for (const t of liveTasks()) if(taskDue(t))taskCounts.set(t.dueDate,(taskCounts.get(t.dueDate)||0)+1);
    const today=dateKey(Date.now());
    const cells=Array.from({length:cellCount},(_,i)=>{
      const d=new Date(year,month,1-offset+i), key=dateKey(d), count=counts.get(key)||0, taskCount=taskCounts.get(key)||0;
      const other=d.getMonth()!==month, selected=selectedCalendarDate===key;
      return `<button type="button" class="calendar-day ${other?'outside':''} ${key===today?'today':''} ${selected?'selected':''}" data-action="calendar-select" data-date="${key}" aria-pressed="${selected}" aria-label="${escapeHTML(longDate(key))}, ${count} ${count===1?'note':'notes'}, ${taskCount} ${taskCount===1?'task':'tasks'}"><span class="cal-day-number">${d.getDate()}</span>${count?`<span class="cal-note-count">${count} ${count===1?'note':'notes'}</span>`:''}${taskCount?`<span class="cal-task-count">${taskCount} ${taskCount===1?'task':'tasks'}</span>`:''}</button>`;
    }).join('');
    const items=selectedCalendarDate ? calendarNotes(selectedCalendarDate):[];
    const dayTasks=selectedCalendarDate?onDayTasks(selectedCalendarDate):[];
    const selection=selectedCalendarDate && calendarMonth.getFullYear()===dateFromKey(selectedCalendarDate).getFullYear() && calendarMonth.getMonth()===dateFromKey(selectedCalendarDate).getMonth();
    return `<section class="calendar-wrap">
      <div class="calendar-intro"><div><div class="eyebrow">Notes and tasks, by day</div><h1>Calendar</h1><p>Notes appear on their assigned dates. Tasks appear on their due dates.</p></div></div>
      <div class="calendar-nav-controls"><h2>${escapeHTML(calendarMonth.toLocaleDateString(undefined,{month:'long',year:'numeric'}))}</h2><div class="calendar-month-actions"><button class="button" data-action="calendar-today">Today</button><button class="icon-btn calendar-month-arrow" data-action="calendar-prev" aria-label="Previous month" title="Previous month">${ico('arrowLeft')}</button><button class="icon-btn calendar-month-arrow" data-action="calendar-next" aria-label="Next month" title="Next month">${ico('arrowRight')}</button></div></div>
      <div class="calendar-grid" role="group" aria-label="Month calendar">
        ${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(w=>`<div class="calendar-weekday">${w}</div>`).join('')}
        ${cells}
      </div>
      <div class="calendar-results" aria-live="polite">
        ${selection ? `<div class="calendar-results-heading"><div><h2>${escapeHTML(longDate(selectedCalendarDate))}</h2><span>${items.length} ${items.length===1?'note':'notes'} · ${dayTasks.length} ${dayTasks.length===1?'task':'tasks'}</span></div><span class="calendar-order">${ico('clock','tiny')} Notes: newest time first</span></div>
          <div class="calendar-section-label"><h3>Tasks</h3><span>${dayTasks.filter(t=>t.completedAt).length}/${dayTasks.length} completed</span></div>
          ${dayTasks.length?`<div class="calendar-task-list">${dayTasks.map(t=>`<div class="calendar-task-row"><input class="todo-checkbox" type="checkbox" data-task-toggle="${escapeHTML(t.id)}" ${t.completedAt?'checked':''} aria-label="Complete ${escapeHTML(t.title)}"/><button class="calendar-task-open" data-action="calendar-open-task" data-id="${escapeHTML(t.id)}"><strong class="${t.completedAt?'task-complete':''}">${escapeHTML(t.title)}</strong>${t.subtasks.length?`<small>${subtasksDone(t)}/${t.subtasks.length} subtasks</small>`:''}</button>${ico('arrowRight','tiny')}</div>`).join('')}</div>`:'<p class="calendar-no-notes">No tasks due on this date.</p>'}
          <div class="cal-task-create"><input id="calendar-new-task" maxlength="180" placeholder="Add task for this day…" aria-label="New task for selected day"/><button class="button" data-action="calendar-create-task" data-date="${escapeHTML(selectedCalendarDate)}">${ico('plus','tiny')} Add task</button></div>
          <div class="calendar-section-label"><h3>Notes</h3><span>${items.length} ${items.length===1?'note':'notes'}</span></div>
          ${items.length ? `<div class="calendar-note-list">${items.map(n=>`<button class="calendar-note-row" data-action="open-note" data-id="${escapeHTML(n.id)}">${noteIconMarkup(n,'calendar-note-icon')}<span class="calendar-note-info"><strong>${escapeHTML(n.title||'Untitled')}</strong><small>${escapeHTML(projectName(n.projectId))}</small></span><time datetime="${escapeHTML(assignedDate(n)+'T'+assignedTime(n))}">${escapeHTML(readableTime(assignedTime(n)))}</time>${ico('arrowRight','tiny')}</button>`).join('')}</div>`:
          `<div class="calendar-no-notes">No notes on this date.</div>`}
        `:`<div class="calendar-no-selection">Choose a day to see its notes and tasks.</div>`}
      </div>
    </section>`;
  }
  function shiftCalendarMonth(offset) {
    calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+offset,1);
    selectedCalendarDate=null;
    render();
  }
  function selectCalendarDate(key) {
    if (!isDateKey(key)) return;
    selectedCalendarDate=key;
    const d=dateFromKey(key);
    calendarMonth=new Date(d.getFullYear(),d.getMonth(),1);
    render();
    document.querySelector('.calendar-results')?.scrollIntoView({behavior:'smooth',block:'nearest'});
  }
  function render() {
    const sidebar=`<aside id="sidebar" class="sidebar ${sidebarOpen?'open':''}" aria-label="Workspace navigation">
      <div class="sidebar-top"><div class="brand"><img class="brand-icon" src="${BRAND_LOGO}" alt="Mauven logo"/><div><div class="brand-name">mauven<span class="brand-period">.</span></div></div></div>
      <div class="sidebar-controls"><button class="new-note-btn" data-action="new-note">${ico('plus','small')} New note</button>
      <button class="search-trigger" data-action="open-search">${ico('search','small')} <span>Search notes</span><kbd>⌘ K</kbd></button></div></div>
      <div id="sidebar-scroll" class="sidebar-scroll"></div>
      <div class="sidebar-bottom"><div class="workspace-chip"><span class="workspace-avatar">M</span><div class="workspace-meta"><div class="workspace-title">My workspace</div><div class="workspace-subtitle">Local workspace · prototype</div></div><button class="icon-btn" title="Settings" aria-label="Settings" data-action="open-settings">${ico('settings')}</button></div></div></aside>`;
    app.innerHTML=`<div class="app-shell">${sidebar}${sidebarOpen?`<div class="sidebar-overlay" data-action="sidebar-toggle" aria-hidden="true"></div>`:''}<main class="main">${renderTopbar()}<div class="app-main-scroll">${view.type==='note'?renderEditor():view.type==='project'?renderProject():view.type==='calendar'?renderCalendar():view.type==='tasks'?renderTodos():renderList(view.type)}</div></main></div>`;
    renderSidebar(); autosizeTitle();
    const selectAll=document.getElementById('completed-select-all');
    if(selectAll)selectAll.indeterminate=selectedCompletedIds.size>0&&!selectAll.checked;
    document.title=`${view.type==='note'?(currentNote()?.title||'Untitled'):view.type==='project'?currentProject()?.name:view.type==='calendar'?'Calendar':view.type==='tasks'?'To-do List':'Notes'} · Mauven`;
  }
  function autosizeTitle() { const t=document.getElementById('note-title'); if(t){t.style.height='auto'; t.style.height=Math.max(50,t.scrollHeight)+'px';} }
  function closeModal() { document.querySelector('.modal-backdrop')?.remove(); modal=null; pendingVideoInsertion=null; pendingCompletedDeletionIds=null; }
  function showModal(content,wide=false,search=false) {
    closeModal(); const overlay=document.createElement('div'); overlay.className='modal-backdrop'; overlay.innerHTML=`<div class="modal ${wide?'modal-wide':''} ${search?'search-modal':''}" role="dialog" aria-modal="true" aria-label="Mauven dialog">${content}</div>`;
    overlay.addEventListener('mousedown',e=>{if(e.target===overlay)closeModal();}); document.body.appendChild(overlay); modal=overlay;
    overlay.querySelector('input')?.focus();
  }
  const modalHead=(title,subtitle='')=>`<div class="modal-head"><div><h2>${escapeHTML(title)}</h2>${subtitle?`<p class="modal-subtitle">${escapeHTML(subtitle)}</p>`:''}</div><button class="icon-btn" title="Close" aria-label="Close" data-action="close-modal">${ico('x')}</button></div>`;
  function openCreateProject() { showModal(`${modalHead('Create a project','A home for related notes, ideas, and plans.')}<label class="field-label" for="project-input">Project name</label><input maxlength="80" class="text-field" id="project-input" placeholder="e.g. Things I’m learning"/><div class="modal-actions"><button class="button" data-action="close-modal">Cancel</button><button class="button button-primary" data-action="create-project-submit">${ico('plus','tiny')} Create project</button></div>`); }
  function openRenameProject(id) { const p=db.projects.find(p=>p.id===id);if(!p)return;showModal(`${modalHead('Rename project')}<label class="field-label" for="project-input">Project name</label><input maxlength="80" class="text-field" id="project-input" value="${escapeHTML(p.name)}"/><div class="modal-actions"><button class="button" data-action="close-modal">Cancel</button><button class="button button-primary" data-action="rename-project-submit" data-id="${escapeHTML(id)}">Save name</button></div>`); }
  function openMoveDialog(id) {
    const n=db.notes.find(n=>n.id===id&&!n.deletedAt);if(!n)return;
    showModal(`${modalHead('Move note','Pick where this note should live. It will always remain visible in Recents.')}
      <div class="settings-item"><div><strong>Unfiled</strong><span>Keep the note outside projects</span></div><button class="button ${!n.projectId?'button-quiet':''}" data-action="move-to-project" data-id="${escapeHTML(n.id)}" data-project="">${!n.projectId?'Current':'Move here'}</button></div>
      ${db.projects.map(p=>`<div class="settings-item"><div><strong>${ico('book','tiny')} ${escapeHTML(p.name)}</strong><span>${countNotes(p.id)} notes</span></div><button class="button ${n.projectId===p.id?'button-quiet':''}" data-action="move-to-project" data-id="${escapeHTML(n.id)}" data-project="${escapeHTML(p.id)}">${n.projectId===p.id?'Current':'Move here'}</button></div>`).join('')}`);
  }
  function openNoteIconPicker(id) {
    const note = db.notes.find(n => n.id === id && !n.deletedAt);
    if (!note) return;
    const current = normalizedIcon(note);
    showModal(`${modalHead('Note icon','Pick an emoji or upload a small image. Each note has its own icon.')}
      <div class="icon-picker-current">${noteIconMarkup(note,'picker-current-emoji')}<div><strong>${escapeHTML(note.title||'Untitled')}</strong><span>Current note icon</span></div></div>
      <div class="icon-picker-sections">${EMOJI_SECTIONS.map(section=>`<div class="icon-picker-section"><h3>${escapeHTML(section.label)}</h3><div class="emoji-grid">${section.values.map(emoji=>`<button type="button" class="emoji-option ${current.type==='emoji'&&current.value===emoji?'selected':''}" data-action="pick-note-emoji" data-id="${escapeHTML(id)}" data-emoji="${escapeHTML(emoji)}" title="Use ${escapeHTML(emoji)} as note icon" aria-label="Use ${escapeHTML(emoji)} as note icon">${escapeHTML(emoji)}</button>`).join('')}</div></div>`).join('')}</div>
      <div class="icon-picker-bottom"><input class="hidden" id="note-icon-upload" type="file" accept="image/png,image/jpeg,image/webp" data-note-id="${escapeHTML(id)}" aria-label="Upload an icon" /><button type="button" class="button" data-action="upload-note-icon">${ico('upload','tiny')} Upload an image</button><button type="button" class="button button-quiet" data-action="reset-note-icon" data-id="${escapeHTML(id)}">Reset to default</button></div><p class="upload-hint">PNG, JPEG, or WebP · maximum 5 MB · resized to fit local storage. SVG and animated images are not accepted.</p>`);
  }
  function setNoteIcon(id, choice) {
    const note = db.notes.find(n => n.id === id && !n.deletedAt);
    if (!note) return;
    const previous = note.icon;
    note.icon = choice;
    note.updatedAt = Date.now();
    if (!save()) { note.icon = previous; return; }
    closeModal(); render(); toast('Note icon updated');
  }
  async function handleNoteIconUpload(input) {
    const file = input.files?.[0]; const id = input.dataset.noteId;
    if (!file || !id) return;
    if (!['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 5*1024*1024) { toast('Choose a PNG, JPEG, or WebP image under 5 MB'); return; }
    try {
      // Convert uploads to bounded, static raster thumbnails before storing locally.
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable');
      const size = Math.min(bitmap.width,bitmap.height), x=(bitmap.width-size)/2, y=(bitmap.height-size)/2;
      ctx.drawImage(bitmap,x,y,size,size,0,0,128,128);bitmap.close?.();
      const url = canvas.toDataURL('image/webp',.83);
      if (url.length > 100000 || !/^data:image\/(webp|png);base64,/.test(url)) throw new Error('Icon too large');
      setNoteIcon(id,{type:'image',value:url});
    } catch { toast('Could not read that image. Try another PNG, JPEG, or WebP file.'); }
  }
  function openNoteMore(id) {
    const n=db.notes.find(n=>n.id===id&&!n.deletedAt);if(!n)return;
    showModal(`${modalHead('Note options',n.title||'Untitled')}<div class="settings-item"><div><strong>Change note icon</strong><span>Choose an emoji or upload your own image</span></div><button class="button" data-action="edit-note-icon" data-id="${escapeHTML(id)}">Customize</button></div><div class="settings-item"><div><strong>Move to a project</strong><span>Place this note in a different collection</span></div><button class="button" data-action="move-dialog" data-id="${escapeHTML(id)}">${ico('move','tiny')} Move</button></div>
      <div class="settings-item"><div><strong>Make a copy</strong><span>Duplicate this note as an editable copy</span></div><button class="button" data-action="duplicate-note" data-id="${escapeHTML(id)}">Duplicate</button></div>
      <div class="settings-item"><div><strong>Move to Trash</strong><span>Recoverable from the Trash section</span></div><button class="button button-danger" data-action="delete-note" data-id="${escapeHTML(id)}">${ico('trash','tiny')} Delete</button></div>`);
  }
  function shareUrl(share) {
    const url=new URL(window.location.href); url.search='';url.hash='';url.searchParams.set('view',share.type);url.searchParams.set('token',share.token);return url.toString();
  }
  function openShare(type,id) {
    const target=type==='note'?db.notes.find(n=>n.id===id&&!n.deletedAt):db.projects.find(p=>p.id===id);
    if(!target)return;
    const old=db.shares.find(s=>s.type===type&&s.targetId===id);
    const url=old?shareUrl(old):'';
    showModal(`${modalHead(`Share ${type==='note'?'note':'project'}`,'Read-only link preview for this frontend prototype.')}
      <div class="share-preview"><div class="purple-spot">${type==='note'?noteIconMarkup(target,'share-note-emoji'):ico('book')}</div><div><strong>${escapeHTML(target.title||target.name||'Untitled')}</strong><span>${type==='project'?'Anyone with a valid project link can see every note currently in this collection.':'A visitor can view this note but cannot change it.'}</span></div></div>
      <div class="notice">${ico('alert','small')} <div><strong>Local preview only.</strong> Notes live in this browser's storage. These links do NOT work on other devices or browsers. Real public sharing and secure access control require the Cloudflare backend.</div></div>
      ${old?`<label class="field-label">Preview link</label><div class="share-link-row"><input readonly class="text-field" id="share-link" value="${escapeHTML(url)}" aria-label="Local preview link"/><button class="button button-primary" data-action="copy-share">${ico('copy','tiny')} Copy</button></div>
        <div class="modal-actions" style="justify-content:space-between"><button class="button button-danger" data-action="revoke-share" data-type="${type}" data-id="${escapeHTML(id)}">Revoke link</button><button class="button" data-action="open-share-preview" data-type="${type}" data-id="${escapeHTML(id)}">${ico('external','tiny')} Open preview</button></div>`:
        `<div class="modal-actions"><button class="button" data-action="close-modal">Cancel</button><button class="button button-primary" data-action="generate-share" data-type="${type}" data-id="${escapeHTML(id)}">${ico('link','tiny')} Create preview link</button></div>`}`);
  }
  function openSettings() {
    showModal(`${modalHead('Workspace settings','Your demo data stays in this browser unless you export it.')}
      <div class="notice">${ico('alert','small')} <div><strong>Prototype only:</strong> no authentication, backend, or synchronized storage. Do not enter sensitive information. This is not ready for a public production deployment.</div></div>
      <div class="settings-item"><div><strong>Export notes, tasks & projects</strong><span>Download a portable JSON backup of your local demo workspace.</span></div><button class="button" data-action="export">${ico('download','tiny')} Export</button></div>
      <div class="settings-item"><div><strong>Restore sample workspace</strong><span>Clear local changes and restore the original sample notes.</span></div><button class="button button-danger" data-action="reset-demo">Reset</button></div>
      <div class="settings-item"><div><strong>About Mauven</strong><span>Notes, kept simple · v0.8 local prototype</span></div><span style="font-size:11px;color:#9a93a1">Made for the web</span></div>`);
  }
  function openSearch() {
    showModal(`<div class="search-input-wrap">${ico('search','large')}<input id="search-input" autocomplete="off" placeholder="Search titles and notes…" aria-label="Search notes"/><button class="icon-btn" title="Close search" aria-label="Close search" data-action="close-modal">${ico('x')}</button></div><div class="search-results" id="search-results"></div>`,true,true);
    renderSearchResults('');
  }
  function renderSearchResults(q) {
    const el=document.getElementById('search-results'); if(!el)return;
    const term=q.trim().toLocaleLowerCase();
    const results=notes().filter(n=> !term || `${n.title} ${plain(n.content)} ${projectName(n.projectId)}`.toLocaleLowerCase().includes(term));
    el.innerHTML=results.length ? results.slice(0,60).map(n=>`<button class="search-result" data-action="open-search-note" data-id="${escapeHTML(n.id)}">${noteIconMarkup(n,'search-note-emoji')}<span><strong>${escapeHTML(n.title||'Untitled')}</strong><small>${escapeHTML(projectName(n.projectId))} · ${escapeHTML(relative(n.updatedAt))}</small></span></button>`).join('') : '<div class="search-empty">No notes found. Try another search term.</div>';
  }
  function exportData() {
    const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`mauven-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Backup exported');
  }
  function resetDemo() {
    if(!confirm('Reset Mauven? This permanently removes your local changes, including share previews. Export first if needed.')) return;
    db=seed(); save();closeModal();expanded=new Set();nav('note','n-welcome');toast('Sample workspace restored');
  }
  function formatSelection(cmd,val) {
    const el=document.getElementById('note-content');if(!el)return;el.focus();
    if(cmd==='link') {
      const input=prompt('Enter a URL (https:// or mailto:)');if (!input)return;
      if(!/^(https?:\/\/|mailto:)/i.test(input.trim())) return toast('Only http(s) and mailto links are supported');
      document.execCommand('createLink',false,input.trim());
    } else { document.execCommand(cmd,false,val||null); }
    const n=currentNote();if(n){n.content=sanitizeHTML(el.innerHTML);n.updatedAt=Date.now();scheduleSave();}
  }
  // Local prototype: images are embedded as bounded, compressed raster data URLs.
  // Production must upload these to durable object storage rather than the D1 document body.
  function selectionWithinEditor(editor) {
    const selection=window.getSelection();
    if (!selection || !selection.rangeCount) return null;
    const range=selection.getRangeAt(0);
    return editor.contains(range.commonAncestorContainer) ? range.cloneRange() : null;
  }
  function restoreSelection(editor,range) {
    editor.focus();
    if (!range || !editor.contains(range.commonAncestorContainer)) return;
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
  }
  function persistEditor(editor=document.getElementById('note-content')) {
    const note=currentNote();
    if(!editor || !note) return;
    // HTML checkbox checked *properties* change on interaction; sync the attribute used for persistence.
    for(const box of editor.querySelectorAll('ul[data-task-list] input[type="checkbox"]')){
      if(box.checked) box.setAttribute('checked',''); else box.removeAttribute('checked');
    }
    note.content=sanitizeHTML(editor.innerHTML);
    note.updatedAt=Date.now();scheduleSave();
  }
  function insertIntoEditor(html, range, expectedId) {
    const editor=document.getElementById('note-content');
    if (!editor || currentNote()?.id !== expectedId) { toast('Open the original note before inserting content');return false; }
    restoreSelection(editor,range);
    const clean=sanitizeHTML(html);
    if (!clean) return false;
    const hasBlock=/<(?:table|ul|ol)\b/i.test(clean);
    if(hasBlock){
      // Native insertHTML may nest a pasted table within the previous checklist item.
      // Insert structured blocks as siblings, then put the caret after the new block.
      const selection=window.getSelection();
      const insertion=selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : document.createRange();
      if(!selection?.rangeCount){insertion.selectNodeContents(editor);insertion.collapse(false);}
      const ancestor=insertion.startContainer.nodeType===1?insertion.startContainer:insertion.startContainer.parentElement;
      const enclosing=ancestor?.closest?.('li,table,p,blockquote');
      if(enclosing && editor.contains(enclosing)){
        const parent=enclosing.tagName==='LI'?enclosing.closest('ul,ol'):enclosing;
        if(parent && editor.contains(parent)){insertion.setStartAfter(parent);insertion.collapse(true);}
      }
      insertion.deleteContents();
      const fragment=insertion.createContextualFragment(clean);
      const last=fragment.lastChild;
      insertion.insertNode(fragment);
      if(last){
        const end=document.createRange();
        if(last.nodeType===1 && last.tagName==='P'){end.selectNodeContents(last);end.collapse(false);}
        else {end.setStartAfter(last);end.collapse(true);}
        const sel=window.getSelection();sel.removeAllRanges();sel.addRange(end);
        editor.__savedSelection=end.cloneRange();
      }
    }else{
      // Legacy command remains appropriate for small inline paste in the v0.x prototype.
      const inserted=document.execCommand('insertHTML',false,clean);
      if(!inserted){
        const selection=window.getSelection();
        if(selection?.rangeCount){
          const current=selection.getRangeAt(0);current.deleteContents();
          const fragment=current.createContextualFragment(clean);current.insertNode(fragment);
        }else editor.insertAdjacentHTML('beforeend',clean);
      }
    }
    persistEditor(editor);
    return true;
  }
  function textToHTML(text) {
    const lines=String(text).replace(/\r\n?/g,'\n').split('\n');
    // Sheets / Excel / copied markdown tables commonly put cells in tab-separated text.
    const data=lines.filter(line=>line.trim().length);
    if(data.length>=2 && data.length<=120 && data.every(line=>line.includes('\t'))) {
      const grid=data.map(line=>line.split('\t'));
      const width=grid[0].length;
      if(width>=2 && width<=20 && grid.every(row=>row.length===width)) {
        return `<table><tbody>${grid.map(row=>`<tr>${row.map(cell=>`<td>${escapeHTML(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table><p><br></p>`;
      }
    }
    let out='',open=false;
    for(const line of lines){
      const match=line.match(/^\s*(?:[-*]\s*)?\[([ xX])\]\s+(.*)$/);
      if(match){
        if(!open){out+='<ul data-task-list="true">';open=true;}
        out+=`<li><input type="checkbox"${match[1].toLowerCase()==='x'?' checked':''} contenteditable="false"> ${escapeHTML(match[2])}</li>`;
      } else {
        if(open){out+='</ul>';open=false;}
        out+=escapeHTML(line)||'<br>';out+='<br>';
      }
    }
    if(open)out+='</ul>';
    return out;
  }
  function editorSavedRange(){
    const editor=document.getElementById('note-content');
    return editor?.__savedSelection || (editor?selectionWithinEditor(editor):null);
  }
  function insertChecklist(){
    const note=currentNote();if(!note)return;
    insertIntoEditor('<ul data-task-list="true"><li><input type="checkbox" contenteditable="false"> New task</li></ul><p><br></p>',editorSavedRange(),note.id);
  }
  function insertTable(){
    const note=currentNote();if(!note)return;
    const html='<table><thead><tr><th>Column 1</th><th>Column 2</th></tr></thead><tbody><tr><td><br></td><td><br></td></tr><tr><td><br></td><td><br></td></tr></tbody></table><p><br></p>';
    if(insertIntoEditor(html,editorSavedRange(),note.id)) toast('Click a table cell to add or remove rows and columns');
  }
  function selectedCell(){
    const editor=document.getElementById('note-content');
    if(activeTableCell?.isConnected && editor?.contains(activeTableCell))return activeTableCell;
    const sel=window.getSelection();
    const node=sel?.anchorNode;
    const el=node?.nodeType===1?node:node?.parentElement;
    const cell=el?.closest?.('td,th');
    return editor?.contains(cell)?cell:null;
  }
  function syncTableTools(){
    const editor=document.getElementById('note-content');
    const tools=document.getElementById('table-tools');
    if(!editor||!tools)return;
    const cell=selectedCell();
    tools.classList.toggle('hidden',!cell);
  }
  function tableAction(action){
    const cell=selectedCell();
    const editor=document.getElementById('note-content');
    if(!cell||!editor)return;
    const table=cell.closest('table');
    if(!table)return;
    const rows=Array.from(table.rows);
    const width=rows[0]?.cells.length||0;
    // Keeping the operations deliberately simple: merged cells remain readable/editable,
    // but structural editing is restricted to a rectangular grid.
    if(action!=='table-delete' && rows.some(row=>row.cells.length!==width || Array.from(row.cells).some(c=>c.hasAttribute('rowspan') || c.hasAttribute('colspan')))){
      toast('Row and column tools require a table without merged cells');return;
    }
    const row=cell.closest('tr'),rowIndex=rows.indexOf(row),columnIndex=Array.from(row.cells).indexOf(cell);
    if(action==='table-add-row' || action==='table-row-above' || action==='table-row-below'){
      if(rows.length>=60)return toast('Maximum 60 rows in a table');
      const inserted=document.createElement('tr');
      row.parentElement.insertBefore(inserted, action==='table-row-above' ? row : row.nextSibling);
      for(let c=0;c<width;c++){
        const tag=row.parentElement.tagName==='THEAD'?'th':'td';
        const td=document.createElement(tag);td.innerHTML='<br>';inserted.append(td);
      }
      activeTableCell=inserted.cells[Math.min(columnIndex,width-1)];
    } else if(action==='table-add-column' || action==='table-column-left' || action==='table-column-right'){
      if(width>=20)return toast('Maximum 20 columns in a table');
      for(const r of rows){
        const inserted=document.createElement(r.parentElement?.tagName==='THEAD'?'th':'td');
        inserted.innerHTML='<br>';
        r.insertBefore(inserted,r.cells[columnIndex+(action==='table-column-left'?0:1)]||null);
      }
      activeTableCell=row.cells[columnIndex+(action==='table-column-left'?0:1)];
    } else if(action==='table-delete-row' || action==='table-remove-row'){
      if(rows.length<=1)return toast('Keep at least one row, or delete the table');
      row.remove();
      const next=table.rows[Math.min(rowIndex,table.rows.length-1)];
      activeTableCell=next?.cells[Math.min(columnIndex,next.cells.length-1)]||null;
    } else if(action==='table-delete-column' || action==='table-remove-column'){
      if(width<=1)return toast('Keep at least one column, or delete the table');
      for(const r of rows)r.cells[columnIndex]?.remove();
      activeTableCell=row.cells[Math.min(columnIndex,row.cells.length-1)]||null;
    } else if(action==='table-delete'){
      table.remove();activeTableCell=null;
    }
    persistEditor(editor);syncTableTools();
    if(activeTableCell){
      const r=document.createRange();r.selectNodeContents(activeTableCell);r.collapse(false);
      const sel=window.getSelection();sel.removeAllRanges();sel.addRange(r);
    }else editor.focus();
  }
  async function imageToInlineData(file) {
    if (!file || !['image/png','image/jpeg','image/webp'].includes(file.type) || file.size > 10*1024*1024) throw Error('Use PNG, JPEG or WebP files under 10 MB');
    const bitmap=await createImageBitmap(file);
    try {
      let maxSide=1600;
      for (let attempt=0;attempt<6;attempt++) {
        const scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));
        const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));
        const ctx=canvas.getContext('2d');if(!ctx)throw Error('Image conversion unavailable');
        ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
        const data=canvas.toDataURL('image/webp', attempt<3?.78:.62);
        if (/^data:image\/(webp|png);base64,/.test(data) && data.length < MAX_INLINE_IMAGE_DATA) return data;
        maxSide=Math.round(maxSide*.78);
      }
      throw Error('Image is too large for browser-only storage');
    } finally {bitmap.close?.();}
  }
  async function insertImageFiles(files,range,noteId) {
    const images=Array.from(files).filter(file=>file.type?.startsWith('image/'));
    if (!images.length)return;
    let added=0;
    for (const file of images.slice(0,8)) {
      try {
        const data=await imageToInlineData(file);
        if (insertIntoEditor(`<figure><img src="${data}" alt="${escapeHTML(file.name||'Pasted image')}"></figure><p><br></p>`,range,noteId)) added++;
        // After each image, insert the next one at the current caret.
        range=selectionWithinEditor(document.getElementById('note-content'));
      } catch(err) {toast(err.message||'Could not add image');}
    }
    if (images.length>8)toast('Maximum 8 images at once');
    if (added)toast(`${added} ${added===1?'image':'images'} added · stored in this browser`);
  }
  async function handleBodyImageUpload(input) {
    const files=Array.from(input.files||[]);input.value='';
    const editor=document.getElementById('note-content'),note=currentNote();
    if (!editor || !note || !files.length)return;
    const range=editor.__savedSelection || selectionWithinEditor(editor);
    await insertImageFiles(files,range,note.id);
  }
  function copyText(value) {
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(value).then(()=>toast('Preview link copied'),()=>toast('Clipboard unavailable; select and copy the link'));
    else {const input=document.getElementById('share-link');input?.select();toast('Select and copy the preview link');}
  }
  function renderReadOnly() {
    const params=new URLSearchParams(window.location.search);const type=params.get('view'), tok=params.get('token'), noteId=params.get('note');
    const s=db.shares.find(x=>x.type===type&&x.token===tok);
    const target=s ? (type==='note' ? db.notes.find(n=>n.id===s.targetId && !n.deletedAt) : db.projects.find(p=>p.id===s.targetId)) : null;
    const brand=`<div class="brand"><img class="brand-icon" src="${BRAND_LOGO}" alt="Mauven logo"/><div class="brand-name">mauven<span class="brand-period">.</span></div></div>`;
    const banner=`<div class="preview-banner"><strong>Local read-only preview.</strong> This works only in the browser that stores the demo notes. It is NOT a public share link.</div>`;
    if (!target) { app.innerHTML=`<div class="preview-app">${banner}<header class="preview-header">${brand}<span style="font-size:12px;color:#a19ba8">Read-only preview</span></header><div class="preview-error"><div style="color:var(--purple)">${ico('lock','large')}</div><h1>Preview not available</h1><p>This link may be revoked, invalid, or from another browser.</p><a class="button" href="./">Return to Mauven</a></div></div>`;return; }
    if (type==='note') {
      app.innerHTML=`<div class="preview-app">${banner}<header class="preview-header">${brand}<span style="font-size:12px;color:#958e9d">${ico('lock','tiny')} Read-only</span></header><article class="preview-content">${noteIconMarkup(target,'preview-note-emoji')}<div class="eyebrow">Shared note preview</div><h1>${escapeHTML(target.title||'Untitled')}</h1><p class="collection-desc">Last updated ${escapeHTML(relative(target.updatedAt))}</p><div class="editor-body">${sanitizeHTML(target.content,true)}</div></article></div>`;
    } else {
      const projectNotes=notes().filter(n=>n.projectId===target.id);
      let selected=noteId?projectNotes.find(n=>n.id===noteId):null;
      app.innerHTML=`<div class="preview-app">${banner}<header class="preview-header">${brand}<span style="font-size:12px;color:#958e9d">${ico('lock','tiny')} Read-only</span></header>
        ${selected?`<article class="preview-content"><a href="${escapeHTML(shareUrl(s))}" style="font-size:12px;text-decoration:none">${ico('arrowLeft','tiny')} Back to ${escapeHTML(target.name)}</a>${noteIconMarkup(selected,'preview-note-emoji')}<h1>${escapeHTML(selected.title||'Untitled')}</h1><div class="editor-body">${sanitizeHTML(selected.content,true)}</div></article>`:
        `<section class="preview-content"><div class="eyebrow">Shared project preview</div><h1>${escapeHTML(target.name)}</h1><p class="collection-desc">${projectNotes.length} notes · read-only</p><div class="note-cards" style="margin-top:34px">${projectNotes.map(n=>`<a class="note-card" style="text-decoration:none" href="${escapeHTML(shareUrl(s))}&amp;note=${encodeURIComponent(n.id)}">${noteIconMarkup(n,'card-note-emoji')}<strong>${escapeHTML(n.title||'Untitled')}</strong><span class="excerpt">${escapeHTML(plain(n.content))}</span><span class="date">${escapeHTML(relative(n.updatedAt))}</span></a>`).join('')}</div></section>`}</div>`;
    }
  }

  // v0.6: a lightweight slash palette. All commands create regular, persisted HTML.
  // No dependency or network access is required; the editor remains local-only.
  const SLASH_COMMANDS=[
    {id:'text',label:'Text',description:'Normal paragraph',icon:'file',aliases:['paragraph','p'],group:'Basic'},
    {id:'h1',label:'Heading 1',description:'Large heading',icon:'file',aliases:['heading1'],group:'Basic'},
    {id:'h2',label:'Heading 2',description:'Section heading',icon:'file',aliases:['heading2'],group:'Basic'},
    {id:'h3',label:'Heading 3',description:'Small heading',icon:'file',aliases:['heading3'],group:'Basic'},
    {id:'tasks',label:'Task list',description:'Interactive checkboxes',icon:'checklist',aliases:['checkbox','todo','checklist'],group:'Lists'},
    {id:'bullet',label:'Bulleted list',description:'Unordered list',icon:'list',aliases:['bullets','list'],group:'Lists'},
    {id:'number',label:'Numbered list',description:'Ordered list',icon:'ordered',aliases:['numbers','ordered'],group:'Lists'},
    {id:'quote',label:'Quote',description:'Block quotation',icon:'quote',aliases:['blockquote'],group:'Blocks'},
    {id:'divider',label:'Divider',description:'Horizontal rule',icon:'more',aliases:['hr','separator'],group:'Blocks'},
    {id:'table',label:'Table',description:'Choose a small grid',icon:'table',aliases:['grid'],group:'Blocks'},
    {id:'image',label:'Image',description:'Upload an image',icon:'upload',aliases:['photo','picture'],group:'Blocks'},
    {id:'youtube',label:'YouTube video',description:'Embed a video from a link',icon:'video',aliases:['video','yt'],group:'Blocks'},
    {id:'codeblock',label:'Code block',description:'Multiline code',icon:'code',aliases:['pre'],group:'Blocks'},
    {id:'date',label:'Date',description:'Insert today’s date',icon:'calendar',aliases:['today'],group:'Insert'},
    {id:'time',label:'Time',description:'Insert current time',icon:'clock',aliases:['now'],group:'Insert'},
    {id:'bold',label:'Bold',description:'Insert bold text',icon:'file',aliases:['b'],group:'Formatting'},
    {id:'italic',label:'Italic',description:'Insert italic text',icon:'file',aliases:['i'],group:'Formatting'},
    {id:'underline',label:'Underline',description:'Insert underlined text',icon:'file',aliases:['u'],group:'Formatting'},
    {id:'strike',label:'Strikethrough',description:'Insert struck-through text',icon:'file',aliases:['strikethrough'],group:'Formatting'},
    {id:'highlight',label:'Highlight',description:'Insert highlighted text',icon:'file',aliases:['mark'],group:'Formatting'},
    {id:'link',label:'Link',description:'Insert a web link',icon:'link',aliases:['url'],group:'Insert'},
    {id:'code',label:'Inline code',description:'Insert a code span',icon:'code',aliases:['inlinecode'],group:'Formatting'},
    {id:'rowabove',label:'Row above',description:'Insert table row above',icon:'table',context:'table',group:'Table'},
    {id:'rowbelow',label:'Row below',description:'Insert table row below',icon:'table',context:'table',group:'Table'},
    {id:'columnleft',label:'Column left',description:'Insert table column before',icon:'table',context:'table',group:'Table'},
    {id:'columnright',label:'Column right',description:'Insert table column after',icon:'table',context:'table',group:'Table'},
    {id:'deleterow',label:'Delete row',description:'Remove current table row',icon:'trash',context:'table',group:'Table'},
    {id:'deletecolumn',label:'Delete column',description:'Remove current table column',icon:'trash',context:'table',group:'Table'},
    {id:'deletetable',label:'Delete table',description:'Remove entire table',icon:'trash',context:'table',group:'Table'}
  ];
  let pendingVideoInsertion=null;
  let slashState=null;
  let slashIndex=0;
  let slashDimensionMode=false;
  let shortcutBusy=false;
  function hideSlashMenu(){
    document.getElementById('slash-palette')?.remove();
    slashState=null;slashDimensionMode=false;
  }
  function setCaret(node,atEnd=false){
    const r=document.createRange();r.selectNodeContents(node);r.collapse(!atEnd);
    const selection=window.getSelection();selection.removeAllRanges();selection.addRange(r);
    const editor=document.getElementById('note-content');if(editor)editor.__savedSelection=r.cloneRange();
  }
  function slashCandidate(){
    const editor=document.getElementById('note-content');
    const r=editor&&selectionWithinEditor(editor);
    if(!r || !r.collapsed)return null;
    const node=r.startContainer;
    const el=node.nodeType===1?node:node.parentElement;
    if(!el || el.closest('pre,code') || !editor.contains(el))return null;
    const block=el.closest('p,div,h1,h2,h3,blockquote,li,td,th')||editor;
    if(block!==editor && !editor.contains(block))return null;
    const leading=document.createRange();leading.selectNodeContents(block);
    try{leading.setEnd(r.startContainer,r.startOffset);}catch{return null;}
    const before=leading.toString().replace(/\u00a0/g,' ');
    const match=before.match(/^\s*\/([a-z0-9-]*)$/i);
    if(!match)return null;
    const tail=block.textContent||'';
    return {block,range:r,query:match[1].toLowerCase(),before,sole:tail.trim()===before.trim(),noteId:currentNote()?.id,tableCell:el.closest('td,th')};
  }
  function matchesForSlash(state){
    const q=state.query;
    return SLASH_COMMANDS.filter(c=>(!c.context||!!state.tableCell)
      && (!q || c.id.includes(q) || c.label.toLowerCase().includes(q) || c.aliases?.some(a=>a.includes(q))));
  }
  function slashPalettePosition(state,menu){
    const editor=document.getElementById('note-content');
    if(!editor || !state)return;
    let rect=state.range.getBoundingClientRect();
    if(!rect.width&&!rect.height)rect=state.block.getBoundingClientRect();
    const width=Math.min(310,window.innerWidth-24);
    let left=Math.min(Math.max(12,rect.left),window.innerWidth-width-12);
    const above=window.innerHeight-rect.bottom<Math.min(menu.offsetHeight+15,330) && rect.top>menu.offsetHeight+15;
    let top=above ? rect.top-menu.offsetHeight-8 : rect.bottom+9;
    top=Math.max(8,Math.min(top,window.innerHeight-menu.offsetHeight-8));
    menu.style.left=`${left}px`;menu.style.top=`${top}px`;menu.style.width=`${width}px`;
  }
  function renderSlashMenu(){
    if(!slashState)return;
    const list=matchesForSlash(slashState);
    let menu=document.getElementById('slash-palette');
    if(!menu){menu=document.createElement('div');menu.id='slash-palette';menu.className='slash-palette';menu.setAttribute('role','listbox');menu.setAttribute('aria-label','Editor slash commands');document.body.append(menu);}
    if(slashDimensionMode){
      menu.innerHTML=`<div class="slash-heading">INSERT TABLE <span>Esc to cancel</span></div><p class="slash-description">Choose a size (you can add rows and columns later).</p><div class="slash-dimensions">${[2,3,4,5].map(n=>`<button type="button" data-slash-dimension="${n}" aria-label="Insert ${n} by ${n} table">${n} × ${n}</button>`).join('')}</div>`;
    }else if(!list.length){menu.innerHTML='<div class="slash-empty">No matching commands</div>';}
    else {
      slashIndex=Math.min(slashIndex,list.length-1);
      menu.innerHTML=`<div class="slash-heading">${slashState.query?'COMMANDS':'INSERT A BLOCK'} <span>↑ ↓ navigate · ↵ select</span></div><div class="slash-items">${list.map((c,i)=>`<button type="button" role="option" aria-selected="${i===slashIndex}" data-slash-command="${c.id}" class="slash-option${i===slashIndex?' active':''}"><span class="slash-option-icon">${ico(c.icon,'small')}</span><span class="slash-option-main"><strong>${escapeHTML(c.label)}</strong><small>${escapeHTML(c.description)}</small></span><span class="slash-shortcut">/${c.id}</span></button>`).join('')}</div>`;
    }
    slashPalettePosition(slashState,menu);
    menu.querySelector('.slash-option.active')?.scrollIntoView({block:'nearest'});
  }
  function refreshSlashMenu(){
    const state=slashCandidate();
    if(!state){hideSlashMenu();return;}
    if(!slashState || slashState.query!==state.query)slashIndex=0;
    slashState=state;slashDimensionMode=false;renderSlashMenu();
  }
  function replaceTypedCommand(state){
    const editor=document.getElementById('note-content');
    if(!editor || !editor.contains(state.block) || currentNote()?.id!==state.noteId)return false;
    restoreSelection(editor,state.range);
    const deletion=document.createRange();deletion.selectNodeContents(state.block);
    try{deletion.setEnd(state.range.startContainer,state.range.startOffset);}catch{return false;}
    deletion.deleteContents();
    setCaret(state.block);
    editor.focus();
    return true;
  }
  function replaceEmptyBlock(html,state,focusSelector=''){
    const editor=document.getElementById('note-content');
    const block=state.block;
    const fragment=document.createRange().createContextualFragment(sanitizeHTML(html));
    const first=fragment.firstElementChild;
    const following=fragment.lastElementChild;
    if(!first)return;
    if(block!==editor && ['P','DIV','H1','H2','H3','BLOCKQUOTE'].includes(block.tagName)
      && !block.textContent?.trim() && !block.querySelector('img,table,ul,ol')){
      block.replaceWith(fragment);
    }else if(block===editor){
      const r=window.getSelection()?.getRangeAt(0);
      if(r){r.insertNode(fragment);}else editor.append(fragment);
    }else{
      const outer=block.closest('ul,ol,table')||block;
      outer.after(fragment);
    }
    const target=focusSelector==='__following__' ? following : focusSelector ? first.querySelector(focusSelector)||first : first;
    setCaret(target,['LI','CODE','TD','TH'].includes(target.tagName));
    persistEditor(editor);
  }
  function convertBlockTag(state,tag){
    const editor=document.getElementById('note-content'), block=state.block;
    const target=document.createElement(tag);
    if(block!==editor && ['P','DIV','H1','H2','H3','BLOCKQUOTE'].includes(block.tagName)){
      while(block.firstChild)target.append(block.firstChild);
      if(!target.textContent?.trim())target.innerHTML='<br>';
      block.replaceWith(target);
    }else if(block===editor){
      target.innerHTML='<br>';
      const r=window.getSelection()?.getRangeAt(0);
      if(r){r.insertNode(target);}else editor.append(target);
    }else{
      // In a list/table cell, keep the containing structure intact.
      target.innerHTML='<br>';block.append(target);
    }
    setCaret(target);persistEditor(editor);
  }
  function insertInlineAfterSlash(html,selectText=false){
    const editor=document.getElementById('note-content');
    const selection=window.getSelection();
    if(!editor||!selection?.rangeCount)return;
    const r=selection.getRangeAt(0);r.deleteContents();
    const frag=r.createContextualFragment(sanitizeHTML(html));
    const first=frag.firstChild;
    const last=frag.lastChild;
    if(!first)return;
    r.insertNode(frag);
    const chosen=document.createRange();
    if(selectText && first.nodeType===1){chosen.selectNodeContents(first);}
    else {chosen.setStartAfter(last);chosen.collapse(true);}
    selection.removeAllRanges();selection.addRange(chosen);
    editor.__savedSelection=chosen.cloneRange();persistEditor(editor);
  }
  function tableMarkup(size){
    const rows=[];
    for(let i=0;i<size;i++)rows.push(`<tr>${Array.from({length:size},()=>i===0?'<th><br></th>':'<td><br></td>').join('')}</tr>`);
    return `<table><thead>${rows[0]}</thead><tbody>${rows.slice(1).join('')}</tbody></table><p><br></p>`;
  }
  function openVideoDialog(state) {
    if(!state || !currentNote() || state.noteId!==currentNote().id)return;
    hideSlashMenu();
    showModal(`${modalHead('Embed YouTube video','Paste a YouTube URL to place a playable video in your note.')}
      <label class="field-label" for="youtube-url">YouTube video link</label>
      <input class="text-field" id="youtube-url" inputmode="url" type="url" autocomplete="off" spellcheck="false" placeholder="https://www.youtube.com/watch?v=..." aria-describedby="youtube-error youtube-help" />
      <p id="youtube-error" class="video-input-error hidden" role="alert"></p>
      <p id="youtube-help" class="text-help">Supports regular YouTube videos, youtu.be links, Shorts, and live video links. Public playback depends on the video owner allowing embeds.</p>
      <div class="modal-actions"><button class="button" data-action="close-modal" type="button">Cancel</button><button class="button button-primary" type="button" data-action="confirm-youtube">Embed video</button></div>`);
    pendingVideoInsertion=state;
  }
  function confirmYoutube() {
    const input=document.getElementById('youtube-url');
    const id=youtubeIdFromUrl(input?.value);
    const state=pendingVideoInsertion;
    if(!id){
      const error=document.getElementById('youtube-error');
      if(error){error.textContent='Enter a valid YouTube video URL (not a playlist or another website).';error.classList.remove('hidden');}
      input?.setAttribute('aria-invalid','true');input?.focus();return;
    }
    if(!state || state.noteId!==currentNote()?.id){closeModal();pendingVideoInsertion=null;toast('Open the original note before inserting the video');return;}
    // Insert at the original slash position, not wherever focus moved in the dialog.
    closeModal();pendingVideoInsertion=null;
    if(!replaceTypedCommand(state))return;
    replaceEmptyBlock(youtubeFigureHTML(id)+'<p><br></p>',state,'__following__');
    toast('YouTube video embedded');
  }
  function removeYoutube(button) {
    const figure=button.closest('figure[data-youtube-id]');
    const editor=document.getElementById('note-content');
    if(!figure || !editor?.contains(figure))return;
    const next=figure.nextElementSibling;
    figure.remove();
    if(next && editor.contains(next))setCaret(next);
    else{const p=document.createElement('p');p.append(document.createElement('br'));editor.append(p);setCaret(p);}
    editor.focus();persistEditor(editor);toast('Video removed');
  }
  function runSlashCommand(id,dimension=2){
    const state=slashState;
    if(!state)return;
    const command=SLASH_COMMANDS.find(c=>c.id===id);
    if(!command)return;
    if(command.context==='table'&&!state.tableCell)return;
    if(id==='table'&&dimension===0){slashDimensionMode=true;renderSlashMenu();return;}
    if(id==='youtube'){openVideoDialog(state);return;}
    hideSlashMenu();
    if(!replaceTypedCommand(state))return;
    const editor=document.getElementById('note-content');
    const tags={text:'p',h1:'h1',h2:'h2',h3:'h3',quote:'blockquote'};
    if(tags[id])convertBlockTag(state,tags[id]);
    else if(['tasks','bullet','number','codeblock','table','divider'].includes(id)){
      const html=id==='tasks'?'<ul data-task-list="true"><li><input type="checkbox" contenteditable="false" aria-label="Mark task complete">&nbsp;</li></ul><p><br></p>'
        :id==='bullet'?'<ul><li><br></li></ul><p><br></p>'
        :id==='number'?'<ol><li><br></li></ol><p><br></p>'
        :id==='codeblock'?'<pre><code><br></code></pre><p><br></p>'
        :id==='divider'?'<hr><p><br></p>':tableMarkup(dimension);
      replaceEmptyBlock(html,state,id==='tasks'?'li':id==='bullet'||id==='number'?'li':id==='codeblock'?'code':id==='table'?'td':id==='divider'?'__following__':'');
      if(id==='table')toast('Click a cell to edit its rows and columns');
    }else if(id==='image'){
      persistEditor(editor);
      const r=selectionWithinEditor(editor);if(r)editor.__savedSelection=r;
      document.getElementById('note-body-image-upload')?.click();
    }else if(['date','time'].includes(id)){
      const d=new Date();
      insertInlineAfterSlash(escapeHTML(id==='date'?d.toLocaleDateString(undefined,{day:'numeric',month:'long',year:'numeric'}):d.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})));
    }else if(['bold','italic','underline','strike','highlight','code'].includes(id)){
      const style={bold:['strong','Bold text'],italic:['em','Italic text'],underline:['u','Underlined text'],strike:['s','Strikethrough text'],highlight:['mark','Highlighted text'],code:['code','code']}[id];
      insertInlineAfterSlash(`<${style[0]}>${style[1]}</${style[0]}>`,true);
    }else if(id==='link'){
      const saved=selectionWithinEditor(editor);
      const raw=prompt('Paste the link URL (https:// or mailto:)');
      if(!raw){persistEditor(editor);return;}
      const url=raw.trim();
      if(!/^https?:\/\/[^\s<>"']+$/i.test(url)&&!/^mailto:[^\s<>"']+$/i.test(url)){toast('Enter a valid http(s) or mailto URL');persistEditor(editor);return;}
      restoreSelection(editor,saved);
      insertInlineAfterSlash(`<a href="${escapeHTML(url)}">Link text</a>&nbsp;`,true);
    }else if(command.context==='table'){
      activeTableCell=state.tableCell;
      const mapped={rowabove:'table-row-above',rowbelow:'table-row-below',columnleft:'table-column-left',columnright:'table-column-right',deleterow:'table-remove-row',deletecolumn:'table-remove-column',deletetable:'table-delete'};
      tableAction(mapped[id]);
    }
  }
  function markdownShortcut(){
    const editor=document.getElementById('note-content');
    const r=editor&&selectionWithinEditor(editor);
    if(!r||!r.collapsed)return false;
    const at=r.startContainer.nodeType===1?r.startContainer:r.startContainer.parentElement;
    if(!at||at.closest('pre,code,table')||!editor.contains(at))return false;
    const block=at.closest('p,div')||editor;
    if(!editor.contains(block)&&block!==editor)return false;
    const preceding=document.createRange();preceding.selectNodeContents(block);
    try{preceding.setEnd(r.startContainer,r.startOffset);}catch{return false;}
    const before=preceding.toString().replace(/\u00a0/g,' ');
    const actions={'# ':'h1','## ':'h2','### ':'h3','- ':'bullet','* ':'bullet','1. ':'number','> ':'quote','[] ':'tasks','[x] ':'checked-tasks','[X] ':'checked-tasks'};
    const action=actions[before];
    if(!action || block.textContent?.trim()!==before.trim())return false;
    // Only apply at start of an otherwise empty paragraph.
    shortcutBusy=true;
    const del=document.createRange();del.selectNodeContents(block);del.setEnd(r.startContainer,r.startOffset);del.deleteContents();
    const state={block,range:selectionWithinEditor(editor),noteId:currentNote()?.id};
    if(['h1','h2','h3','quote'].includes(action))convertBlockTag(state,action==='quote'?'blockquote':action);
    else if(action==='tasks'||action==='checked-tasks')replaceEmptyBlock(`<ul data-task-list="true"><li><input type="checkbox" contenteditable="false" aria-label="Mark task complete"${action==='checked-tasks'?' checked':''}>&nbsp;</li></ul><p><br></p>`,state,'li');
    else if(action==='bullet'||action==='number')replaceEmptyBlock(`<${action==='bullet'?'ul':'ol'}><li><br></li></${action==='bullet'?'ul':'ol'}><p><br></p>`,state,'li');
    shortcutBusy=false;
    hideSlashMenu();return true;
  }
  document.addEventListener('mousedown',event=>{
    if(event.target.closest('#slash-palette button'))event.preventDefault();
  },true);
  document.addEventListener('click',event=>{
    const dimension=event.target.closest('[data-slash-dimension]');
    if(dimension){runSlashCommand('table',Number(dimension.dataset.slashDimension));return;}
    const cmd=event.target.closest('[data-slash-command]');
    if(cmd){runSlashCommand(cmd.dataset.slashCommand,cmd.dataset.slashCommand==='table'?0:2);return;}
    if(slashState && !event.target.closest('#slash-palette,#note-content'))hideSlashMenu();
  },true);
  window.addEventListener('resize',()=>{if(slashState)renderSlashMenu();});
  document.addEventListener('scroll',event=>{if(slashState && event.target.closest?.('.app-main-scroll'))hideSlashMenu();},true);

  // Primary interaction handlers (delegation survives sidebar and editor re-renders).
  document.addEventListener('click', event => {
    const format=event.target.closest('[data-format]');
    if(format){formatSelection(format.dataset.format,format.dataset.value);return;}
    const el=event.target.closest('[data-action]');if(!el)return;
    const action=el.dataset.action,id=el.dataset.id,type=el.dataset.type;
    switch(action) {
      case 'new-note':createNote();break;
      case 'insert-editor-image':document.getElementById('note-body-image-upload')?.click();break;
      case 'confirm-youtube':confirmYoutube();break;
      case 'remove-embedded-video':removeYoutube(el);break;
      case 'insert-checklist':insertChecklist();break;
      case 'insert-table':insertTable();break;
      case 'table-add-row':case 'table-add-column':case 'table-delete-row':case 'table-delete-column':case 'table-delete':tableAction(action);break;
      case 'new-note-project':createNote(id);break;
      case 'create-project':openCreateProject();break;
      case 'create-project-submit':createProject(document.getElementById('project-input')?.value);break;
      case 'open-note':nav('note',id);break;
      case 'open-project':expanded.add(id);nav('project',id);break;
      case 'toggle-project':expanded.has(id)?expanded.delete(id):expanded.add(id);renderSidebar();break;
      case 'show-unfiled':nav('unfiled');break;
      case 'show-all':nav('all');break;
      case 'show-calendar':nav('calendar');break;
      case 'show-tasks':nav('tasks');break;
      case 'completed-toggle':completedCollapsed=!completedCollapsed;rerenderAtScroll();break;
      case 'completed-group-toggle':toggleCompletedGroup(el.dataset.group);break;
      case 'completed-select-mode':toggleCompletedSelectionMode();break;
      case 'completed-clear-selected':openClearSelectedCompletedDialog();break;
      case 'completed-confirm-delete':confirmClearSelectedCompleted();break;
      case 'task-create':createTask(document.getElementById('todo-new-name')?.value, document.getElementById('todo-new-date')?.value||null);break;
      case 'calendar-create-task':createTask(document.getElementById('calendar-new-task')?.value,el.dataset.date,true);break;
      case 'task-expand':expandedTaskId=expandedTaskId===id?null:id;rerenderAtScroll();break;
      case 'calendar-open-task':expandedTaskId=id;nav('tasks');break;
      case 'task-clear-date':{const t=taskById(id);if(!t)break;t.dueDate=null;t.updatedAt=Date.now();save();rerenderAtScroll();break;}
      case 'subtask-add':addSubtask(id,document.querySelector('#subtask-new[data-parent="'+CSS.escape(id)+'"]')?.value);break;
      case 'subtask-delete':{const t=taskById(id);if(!t)break;t.subtasks=t.subtasks.filter(s=>s.id!==el.dataset.subId);t.updatedAt=Date.now();save();rerenderAtScroll();break;}
      case 'task-delete':deleteTask(id);break;
      case 'task-restore':restoreTask(id);break;
      case 'task-purge':if(confirm('Permanently delete this task? This cannot be undone.')){db.tasks=db.tasks.filter(t=>t.id!==id);save();rerenderAtScroll();toast('Task deleted permanently');}break;
      case 'calendar-prev':shiftCalendarMonth(-1);break;
      case 'calendar-next':shiftCalendarMonth(1);break;
      case 'calendar-today':selectCalendarDate(dateKey(Date.now()));break;
      case 'calendar-select':selectCalendarDate(el.dataset.date);break;
      case 'show-trash':nav('trash');break;
      case 'sidebar-toggle':sidebarOpen=!sidebarOpen;render();break;
      case 'open-search':openSearch();break;
      case 'open-search-note':closeModal();nav('note',id);break;
      case 'close-modal':closeModal();break;
      case 'open-settings':openSettings();break;
      case 'share':openShare(type,id);break;
      case 'generate-share':db.shares.push({id:uuid(),type,targetId:id,token:token(),createdAt:Date.now()});save();openShare(type,id);toast('Local preview link created');break;
      case 'revoke-share':db.shares=db.shares.filter(s=>!(s.type===type&&s.targetId===id));save();openShare(type,id);toast('Preview link revoked');break;
      case 'copy-share':copyText(document.getElementById('share-link')?.value||'');break;
      case 'open-share-preview':{const s=db.shares.find(s=>s.type===type&&s.targetId===id);if(s)window.open(shareUrl(s),'_blank','noopener,noreferrer');break;}
      case 'move-dialog':openMoveDialog(id);break;
      case 'move-to-project':moveNote(id,el.dataset.project||null);break;
      case 'note-more':openNoteMore(id);break;
      case 'edit-note-icon':openNoteIconPicker(id);break;
      case 'pick-note-emoji':setNoteIcon(id,{type:'emoji',value:el.dataset.emoji});break;
      case 'upload-note-icon':document.getElementById('note-icon-upload')?.click();break;
      case 'reset-note-icon':setNoteIcon(id,{type:'emoji',value:DEFAULT_NOTE_ICON});break;
      case 'delete-note':deleteNote(id);break;
      case 'duplicate-note':{const original=db.notes.find(n=>n.id===id);if(!original)break;const duplicate={...original,id:uuid(),title:(original.title||'Untitled')+' (copy)',createdAt:Date.now(),updatedAt:Date.now(),noteDate:dateKey(Date.now()),noteTime:timeKey(Date.now())};db.notes.push(duplicate);save();closeModal();nav('note',duplicate.id);toast('Note duplicated');break;}
      case 'restore-note':restoreNote(id);break;
      case 'purge-note':if(confirm('Permanently delete this note? This cannot be undone.')){db.notes=db.notes.filter(n=>n.id!==id);db.shares=db.shares.filter(s=>!(s.type==='note'&&s.targetId===id));save();render();toast('Note deleted permanently');}break;
      case 'rename-project':openRenameProject(id);break;
      case 'rename-project-submit':{const p=db.projects.find(p=>p.id===id);const name=document.getElementById('project-input')?.value?.trim();if(!p||!name)return;p.name=name.slice(0,80);save();closeModal();render();toast('Project renamed');break;}
      case 'remove-project':deleteProject(id);break;
      case 'export':exportData();break;
      case 'reset-demo':resetDemo();break;
    }
  });
  document.addEventListener('change', event=>{
    const target=event.target;
    if (target.hasAttribute('data-completed-select-all')) {setAllCompletedSelected(target.checked);return;}
    if (target.hasAttribute('data-completed-select')) {
      if(!completedSelectionMode)return;
      const id=target.dataset.completedSelect;
      if(target.checked && taskById(id)?.completedAt)selectedCompletedIds.add(id);
      else selectedCompletedIds.delete(id);
      rerenderAtScroll();return;
    }
    if (target.hasAttribute('data-task-toggle')) {toggleTask(target.dataset.taskToggle);return;}
    if (target.hasAttribute('data-subtask-toggle')) {toggleSubtask(target.dataset.subtaskToggle,target.dataset.subId);return;}
    if (target.hasAttribute('data-task-due')) {
      const t=taskById(target.dataset.taskDue);if(!t)return;
      if(target.value && !isDateKey(target.value)){target.value=t.dueDate||'';toast('Enter a valid due date');return;}
      t.dueDate=target.value||null;t.updatedAt=Date.now();save();rerenderAtScroll();return;
    }
    if (event.target.id==='note-icon-upload') return handleNoteIconUpload(event.target);
    if (event.target.id==='note-body-image-upload') return handleBodyImageUpload(event.target);
    if (event.target.matches?.('#note-content ul[data-task-list] input[type="checkbox"]')) {
      persistEditor();return;
    }
    if (event.target.id==='note-date' || event.target.id==='note-time') {
      const n=currentNote(); if (!n) return;
      const isDate=event.target.id==='note-date';
      const proposed=event.target.value;
      if (!(isDate ? isDateKey(proposed) : isTimeKey(proposed))) {
        event.target.value=isDate?assignedDate(n):assignedTime(n);
        toast('Please enter a valid date and time');return;
      }
      if (isDate) n.noteDate=proposed; else n.noteTime=proposed;
      n.updatedAt=Date.now();
      save();renderSidebar();toast(isDate?'Note date updated':'Note time updated');
    }
  });
  document.addEventListener('input', event=>{
    const target=event.target;
    const id=target.dataset.taskTitle||target.dataset.taskDesc||target.dataset.subtaskTitle;
    if(id){
      const t=taskById(id);if(!t)return;
      if(target.hasAttribute('data-task-title')){
        // Keep the last nonempty title if user tries to blank the field.
        t.title=target.value.slice(0,180);const label=document.querySelector('.todo-item[data-task-id="'+CSS.escape(id)+'"] .todo-task-name');if(label)label.textContent=t.title||'Untitled task';
      } else if(target.hasAttribute('data-task-desc'))t.description=target.value.slice(0,12000);
      else {const sub=t.subtasks.find(s=>s.id===target.dataset.subId);if(sub)sub.title=target.value.slice(0,180);}
      t.updatedAt=Date.now();scheduleSave();return;
    }
    if(event.target.id==='search-input')return renderSearchResults(event.target.value);
    const note=currentNote();if(!note)return;
    if(event.target.id==='note-title'){
      note.title=event.target.value.slice(0,180);note.updatedAt=Date.now();autosizeTitle();scheduleSave();
    } else if(event.target.id==='note-content'){
      if(!shortcutBusy && event.inputType==='insertText' && event.data===' ' && markdownShortcut())return;
      persistEditor(event.target);
      if(!shortcutBusy)refreshSlashMenu();
    }
  });
  document.addEventListener('focusout',event=>{
    const el=event.target;
    if(el.hasAttribute('data-task-title')||el.hasAttribute('data-subtask-title')){
      const id=el.dataset.taskTitle||el.dataset.subtaskTitle,t=taskById(id);
      if(!t)return;
      if(el.hasAttribute('data-task-title'))t.title=t.title.trim()||'Untitled task';
      else {const sub=t.subtasks.find(s=>s.id===el.dataset.subId);if(sub)sub.title=sub.title.trim()||'Untitled subtask';}
      t.updatedAt=Date.now();scheduleSave();
    }
  });
  document.addEventListener('paste',event=>{
    const editor=event.target.closest?.('#note-content');if(!editor)return;
    event.preventDefault();
    const note=currentNote();if(!note)return;
    const clip=event.clipboardData;
    const images=Array.from(clip?.files||[]).filter(f=>f.type?.startsWith('image/'));
    const html=clip?.getData('text/html')||'';
    const text=clip?.getData('text/plain')||'';
    const range=selectionWithinEditor(editor);
    // When copying an image, browsers may provide both a file and an <img> HTML tag.
    // Prefer the binary file to avoid depending on a remote image URL.
    const richText=html.replace(/<img\b[^>]*>/gi,'').replace(/<[^>]*>/g,'').replace(/&nbsp;/g,' ').trim();
    if (images.length && !richText) {void insertImageFiles(images,range,note.id);return;}
    if (html.trim()) {
      if (text.includes('\t') && !/<table\b/i.test(html) && text.split(/\r?\n/).filter(Boolean).length>1)
        insertIntoEditor(textToHTML(text),range,note.id);
      else insertIntoEditor(html,range,note.id);
      return;
    }
    if (images.length) {void insertImageFiles(images,range,note.id);return;}
    if (text) insertIntoEditor(textToHTML(text),range,note.id);
  });
  document.addEventListener('mousedown',event=>{
    if(event.target.closest('[data-format],[data-action="insert-checklist"],[data-action="insert-table"],#table-tools button')) event.preventDefault(); // preserve caret while using the toolbar
    if(event.target.closest('[data-action="insert-editor-image"]')){const editor=document.getElementById('note-content');if(editor)editor.__savedSelection=editorSavedRange();}
  });
  document.addEventListener('selectionchange',()=>{
    const editor=document.getElementById('note-content');
    if(!editor)return;
    const range=selectionWithinEditor(editor);
    if(range){editor.__savedSelection=range; const node=range.commonAncestorContainer;const el=node.nodeType===1?node:node.parentElement;activeTableCell=el?.closest?.('td,th')||null;syncTableTools();}
  });
  document.addEventListener('click',event=>{
    const editor=document.getElementById('note-content');
    const cell=event.target.closest?.('#note-content td,#note-content th');
    if(cell){activeTableCell=cell;syncTableTools();}
    else if(editor && event.target.closest?.('#note-content') && !event.target.closest('table')){activeTableCell=null;syncTableTools();}
  });
  document.addEventListener('keydown',event=>{
    if(slashState && event.target.id==='note-content' && !event.isComposing){
      if(event.key==='Escape'){event.preventDefault();hideSlashMenu();return;}
      if(slashDimensionMode){
        if(event.key==='Enter'){event.preventDefault();runSlashCommand('table',2);return;}
      }else{
        const list=matchesForSlash(slashState);
        if((event.key==='ArrowDown'||event.key==='ArrowUp')&&list.length){
          event.preventDefault();slashIndex=(slashIndex+(event.key==='ArrowDown'?1:-1)+list.length)%list.length;renderSlashMenu();return;
        }
        if((event.key==='Enter'||event.key==='Tab')&&list.length){
          event.preventDefault();runSlashCommand(list[slashIndex].id,list[slashIndex].id==='table'?0:2);return;
        }
      }
    }
    if(event.key==='Enter'  && !event.shiftKey && !event.isComposing && event.target.id==='note-content'){
      const editor=event.target,selection=window.getSelection();
      const anchor=selection?.anchorNode;
      const at=anchor?.nodeType===1?anchor:anchor?.parentElement;
      const li=at?.closest?.('ul[data-task-list="true"] > li');
      if(li && editor.contains(li)){
        event.preventDefault();
        const list=li.parentElement;
        const text=Array.from(li.childNodes).filter(n=>n.nodeType===3 || n.nodeType===1 && n.tagName!=='INPUT').map(n=>n.textContent||'').join('').trim();
        const caret=document.createRange();
        if(!text){
          // Enter on an empty checkbox line exits the checklist.
          li.remove();
          const paragraph=document.createElement('p');paragraph.append(document.createElement('br'));
          list.after(paragraph);
          if(!list.querySelector('li'))list.remove();
          caret.selectNodeContents(paragraph);caret.collapse(true);
        }else{
          const next=document.createElement('li');
          next.innerHTML='<input type="checkbox" contenteditable="false" aria-label="Mark task complete">&nbsp;';
          li.after(next);caret.selectNodeContents(next);caret.collapse(false);
        }
        selection.removeAllRanges();selection.addRange(caret);
        editor.__savedSelection=caret.cloneRange();persistEditor(editor);return;
      }
    }
    if(event.key==='Escape'){if(modal)closeModal();else if(sidebarOpen){sidebarOpen=false;render();}return;}
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();return;}
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='n'){event.preventDefault();createNote();return;}
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='s'){event.preventDefault();flushSave();toast('Saved locally');return;}
    if(event.key==='Enter'&&event.target.id==='project-input'){event.preventDefault();document.querySelector('[data-action="create-project-submit"], [data-action="rename-project-submit"]')?.click();}
    if(event.key==='Enter'&&event.target.id==='youtube-url'){event.preventDefault();confirmYoutube();}
    if(event.key==='Enter'&&event.target.id==='todo-new-name'){event.preventDefault();document.querySelector('[data-action="task-create"]')?.click();}
    if(event.key==='Enter'&&event.target.id==='calendar-new-task'){event.preventDefault();document.querySelector('[data-action="calendar-create-task"]')?.click();}
    if(event.key==='Enter'&&event.target.id==='subtask-new'){event.preventDefault();document.querySelector('[data-action="subtask-add"]')?.click();}
  });
  document.addEventListener('dragstart',event=>{
    const el=event.target.closest('[data-note-id]');if(!el)return;
    draggingId=el.dataset.noteId;event.dataTransfer.effectAllowed='move';event.dataTransfer.setData('text/plain',draggingId);
  });
  document.addEventListener('dragover',event=>{
    const editor=event.target.closest?.('#note-content');
    if(editor && Array.from(event.dataTransfer?.items||[]).some(item=>item.kind==='file'&&item.type.startsWith('image/'))){event.preventDefault();event.dataTransfer.dropEffect='copy';editor.classList.add('image-drop-over');return;}
    const target=event.target.closest('[data-drop-target]');if(!target||!draggingId)return;
    event.preventDefault();event.dataTransfer.dropEffect='move';target.classList.add('drop-over');
  });
  document.addEventListener('dragleave',event=>{
    const target=event.target.closest('[data-drop-target]');if(target&&!target.contains(event.relatedTarget))target.classList.remove('drop-over');
  });
  document.addEventListener('drop',event=>{
    document.querySelectorAll('.image-drop-over').forEach(el=>el.classList.remove('image-drop-over'));
    const editor=event.target.closest?.('#note-content');
    const images=Array.from(event.dataTransfer?.files||[]).filter(f=>f.type.startsWith('image/'));
    if(editor && images.length){event.preventDefault();void insertImageFiles(images,selectionWithinEditor(editor),currentNote()?.id);return;}
    const target=event.target.closest('[data-drop-target]');if(!target||!draggingId)return;
    event.preventDefault();const destination=target.dataset.dropTarget;
    moveNote(draggingId,destination==='unfiled'?null:destination);draggingId=null;
  });
  document.addEventListener('dragend',()=>{draggingId=null;document.querySelectorAll('.drop-over,.image-drop-over').forEach(el=>el.classList.remove('drop-over','image-drop-over'));});
  document.addEventListener('dragleave',event=>{if(event.target.closest?.('#note-content')&&!event.relatedTarget?.closest?.('#note-content'))document.getElementById('note-content')?.classList.remove('image-drop-over');});
  window.addEventListener('beforeunload',flushSave);
  // Restore dialog access to Trash via bottom shortcut injected into sidebar.
  function installTrashLink() {
    // This link is present after every render. Add using a single CSS-friendly element.
    const row=document.createElement('button');row.className='nav-row';row.style.margin='0 13px 5px';row.innerHTML=`${ico('trash','small')}<span class="label">Trash</span><span class="count">${db.notes.filter(n=>n.deletedAt).length||''}</span>`;
    row.dataset.action='show-trash';row.title='View deleted notes';
    document.querySelector('.sidebar-bottom')?.prepend(row);
  }
  const renderBase=render;
  render=()=>{renderBase();installTrashLink();};
  if(new URLSearchParams(window.location.search).has('view')) renderReadOnly();
  else render();
})();
