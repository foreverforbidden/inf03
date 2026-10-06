// Obszar roboczy strony: zakladki plikow, edytor, materialy (grafiki) i podglad na zywo.
import { compose, TEXT_EXT } from './webcheck.js';

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export function modeFor(name) {
  if (/\.php$/i.test(name)) return 'application/x-httpd-php';
  if (/\.html?$/i.test(name)) return 'htmlmixed';
  if (/\.css$/i.test(name)) return 'css';
  if (/\.js$/i.test(name)) return 'javascript';
  return 'text/plain';
}

const isPage = (n) => /\.(html?|php)$/i.test(n);

/**
 * opts: files {nazwa: tekst}, entry, assetsBase, assets [nazwy grafik z materialow],
 *       allowUpload, onChange(files), onRun (Ctrl+Enter), onCheck (Shift+Enter)
 */
export function createWorkspace(root, opts) {
  const files = { ...opts.files };
  const uploads = {};
  const names = () => Object.keys(files);
  let current = names()[0];
  let page = opts.entry && files[opts.entry] != null ? opts.entry : names().find(isPage);
  const docs = {};

  root.classList.add('ws');
  root.innerHTML = `
    <div class="ws-tabs" role="tablist"></div>
    <div class="ws-body">
      <div class="ws-editor editor"></div>
      <div class="ws-assets" hidden></div>
    </div>
    <div class="ws-preview">
      <div class="ws-preview-bar">
        <strong>Podgląd</strong>
        <select class="ws-page" aria-label="Strona w podglądzie"></select>
        <span class="ws-spacer"></span>
        <label class="small"><input type="checkbox" class="ws-narrow"> wąski ekran</label>
        <button type="button" class="btn ghost ws-refresh">Odśwież</button>
      </div>
      <div class="ws-frame-wrap"><iframe class="ws-frame" title="Podgląd strony"></iframe></div>
      <div class="ws-errors" hidden></div>
    </div>`;
  const tabs = root.querySelector('.ws-tabs');
  const edBox = root.querySelector('.ws-editor');
  const assetsBox = root.querySelector('.ws-assets');
  const frame = root.querySelector('.ws-frame');
  const pageSel = root.querySelector('.ws-page');
  const errBox = root.querySelector('.ws-errors');

  const CM = window.CodeMirror;
  let cm = null, ta = null;
  if (CM) {
    cm = CM(edBox, {
      lineNumbers: true, lineWrapping: true, matchBrackets: true, autoCloseBrackets: true, autoCloseTags: true,
      matchTags: { bothTags: true }, styleActiveLine: true, indentUnit: 2, tabSize: 2, viewportMargin: Infinity,
      extraKeys: {
        'Ctrl-Enter': () => opts.onRun && opts.onRun(),
        'Cmd-Enter': () => opts.onRun && opts.onRun(),
        'Shift-Enter': () => opts.onCheck && opts.onCheck(),
        Tab: (c) => c.replaceSelection('  '),
      },
    });
  } else {
    ta = document.createElement('textarea');
    ta.className = 'fallback';
    ta.spellcheck = false;
    edBox.appendChild(ta);
    ta.addEventListener('input', () => { files[current] = ta.value; changed(); });
  }

  function docFor(name) {
    if (!docs[name]) {
      docs[name] = CM.Doc(files[name], modeFor(name));
      docs[name].on('change', () => { files[name] = docs[name].getValue(); changed(); });
    }
    return docs[name];
  }

  function drawTabs() {
    const list = names().map((n) => `<button type="button" role="tab" class="ws-tab${n === current ? ' active' : ''}" data-f="${esc(n)}">${esc(n)}</button>`);
    if (opts.assets?.length || opts.allowUpload) list.push(`<button type="button" role="tab" class="ws-tab${current === null ? ' active' : ''}" data-f="">Grafiki${opts.assets?.length ? ` (${opts.assets.length})` : ''}</button>`);
    tabs.innerHTML = list.join('');
    pageSel.innerHTML = names().filter(isPage).map((n) => `<option${n === page ? ' selected' : ''}>${esc(n)}</option>`).join('');
    pageSel.hidden = names().filter(isPage).length < 2;
  }

  function show(name) {
    current = name;
    const isAssets = name === null;
    edBox.hidden = isAssets;
    assetsBox.hidden = !isAssets;
    if (isAssets) drawAssets();
    else if (cm) { cm.swapDoc(docFor(name)); setTimeout(() => cm.refresh(), 0); } else ta.value = files[name];
    drawTabs();
  }

  function drawAssets() {
    const base = opts.assetsBase || '';
    const all = [...new Set([...(opts.assets || []), ...Object.keys(uploads)])];
    assetsBox.innerHTML = `
      <p class="small muted">Grafiki z materiałów do arkusza. Odwołujesz się do nich w kodzie samą nazwą, np. <code>&lt;img src="${esc(all[0] || 'obraz.jpg')}"&gt;</code>.${opts.allowUpload ? ' Grafikę, którą obrabiasz w edytorze grafiki, wgraj tutaj pod nazwą z treści, żeby ją sprawdzić.' : ''}</p>
      <div class="asset-grid">${all.map((n) => `
        <figure class="asset"><img src="${esc(uploads[n] || base + encodeURIComponent(n))}" alt="${esc(n)}" loading="lazy"><figcaption>${esc(n)}${uploads[n] ? ' <span class="pill ok">Twój plik</span>' : ''}</figcaption></figure>`).join('')}</div>
      ${opts.allowUpload ? `<p class="btns"><label class="btn">Wgraj grafikę<input type="file" accept="image/*" class="ws-upload" hidden></label>
        <input type="text" class="ws-upname" placeholder="nazwa z treści, np. obraz.png" aria-label="Nazwa pliku"></p>` : ''}`;
    const up = assetsBox.querySelector('.ws-upload');
    if (up) up.addEventListener('change', () => {
      const f = up.files[0];
      if (!f) return;
      const name = assetsBox.querySelector('.ws-upname').value.trim() || f.name;
      if (uploads[name]) URL.revokeObjectURL(uploads[name]);
      uploads[name] = URL.createObjectURL(f);
      drawAssets();
      refresh();
      if (opts.onUpload) opts.onUpload(name);
    });
  }

  let timer = null;
  function changed() {
    if (opts.onChange) opts.onChange({ ...files });
    clearTimeout(timer);
    timer = setTimeout(refresh, 700);
  }

  function project() {
    return { files: { ...files }, assetsBase: opts.assetsBase, uploads: { ...uploads } };
  }

  function refresh() {
    errBox.hidden = true;
    errBox.innerHTML = '';
    if (!page) { frame.srcdoc = '<p style="font:14px sans-serif;color:#666">Brak pliku strony.</p>'; return; }
    frame.srcdoc = compose(project(), page);
  }

  tabs.addEventListener('click', (e) => {
    const b = e.target.closest('.ws-tab');
    if (b) show(b.dataset.f || null);
  });
  pageSel.addEventListener('change', () => { page = pageSel.value; refresh(); });
  root.querySelector('.ws-refresh').addEventListener('click', refresh);
  root.querySelector('.ws-narrow').addEventListener('change', (e) => root.classList.toggle('narrow', e.target.checked));
  const onMsg = (e) => {
    if (e.source !== frame.contentWindow) return;
    if (e.data?.inf03Error) {
      errBox.hidden = false;
      errBox.insertAdjacentHTML('beforeend', `<div>⚠ ${esc(e.data.inf03Error)}</div>`);
      return;
    }
    if (!e.data?.inf03Nav) return;
    const target = decodeURIComponent(String(e.data.inf03Nav).split(/[?#]/)[0]);
    if (files[target] != null && isPage(target)) { page = target; drawTabs(); refresh(); }
  };
  window.addEventListener('message', onMsg);

  show(current);
  refresh();

  return {
    project,
    get page() { return page; },
    setFiles(next) {
      for (const k of Object.keys(files)) if (!(k in next)) delete files[k];
      Object.assign(files, next);
      for (const k of Object.keys(docs)) delete docs[k];
      if (!(current in files)) current = names()[0];
      if (!(page in files)) page = names().find(isPage);
      show(current);
      refresh();
      if (opts.onChange) opts.onChange({ ...files });
    },
    setUpload(name, url) {
      uploads[name] = url;
      if (current === null) drawAssets();
      refresh();
    },
    focus() { if (cm) cm.focus(); },
    refresh,
    destroy() { window.removeEventListener('message', onMsg); },
  };
}

export { TEXT_EXT };
