// Skladanie strony kursanta do podgladu i automatyczne sprawdzanie kryteriow z tresci arkusza.
// Projekt: { files: {nazwa: tekst}, assetsBase: 'data/<kod>/assets/', uploads: {nazwa: blobUrl} }

const TEXT_EXT = /\.(html?|css|js|php|txt)$/i;

const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

// usuwa kod PHP (czesc dynamiczna sprawdzana w module PHP)
export function stripPhp(src) {
  return src.replace(/<\?(php|=)?[\s\S]*?(\?>|$)/g, '<!--PHP-->');
}

// podmiana wgranych grafik na ich adresy; w atrybutach src/href zostaje oryginalna nazwa w data-inf03-orig
function replaceAssetRefs(text, uploads, html = false) {
  let out = text;
  for (const [name, rel] of Object.entries(uploads || {})) {
    // adres wzgledny musi byc bezwzgledny, bo strona w podgladzie ma <base> ustawione na materialy
    const url = /^(blob:|data:|https?:)/i.test(rel) ? rel : new URL(rel, document.baseURI).href;
    const n = escRe(name);
    if (html) out = out.replace(new RegExp(`\\b(src|href)\\s*=\\s*(["']?)${n}\\2(?=[\\s>/])`, 'gi'), `$1=$2${url}$2 data-inf03-orig="${name}" data-inf03-url="${url}"`);
    // tekst w title/alt/value zostaje (np. title="10.jpg" to opis, nie adres)
    out = out.replace(new RegExp(`(?<!\\b(?:title|alt|value|placeholder)\\s*=\\s*["']?)(["'(=\\s])${n}(["')\\s>])`, 'g'), `$1${url}$2`);
  }
  return out;
}

// wstrzykiwane na poczatku strony: przechwytywanie alert/prompt i blokada nawigacji
const PRELUDE = `<script>
window.__alerts = [];
window.__errors = [];
window.__console = [];
(function () {
  var log = console.log;
  console.log = function () { window.__console.push(Array.prototype.join.call(arguments, ' ')); return log.apply(console, arguments); };
})();
window.addEventListener('error', function (e) {
  var m = (e.message || 'błąd') + (e.lineno ? ' (wiersz ' + e.lineno + ')' : '');
  window.__errors.push(m);
  if (window.parent && window.parent !== window) window.parent.postMessage({ inf03Error: m }, '*');
});
window.alert = function (m) { window.__alerts.push(String(m)); };
window.confirm = function (m) { window.__alerts.push(String(m)); return true; };
window.prompt = function (m, d) { window.__alerts.push(String(m)); return d == null ? '' : String(d); };
document.addEventListener('click', function (e) {
  var a = e.target.closest && e.target.closest('a[href]');
  if (!a) return;
  var h = a.getAttribute('href') || '';
  if (/^(#|javascript:)/i.test(h)) return;
  e.preventDefault();
  if (window.parent && window.parent !== window) window.parent.postMessage({ inf03Nav: h }, '*');
}, true);
document.addEventListener('submit', function (e) { e.preventDefault(); }, true);
<\/script>`;

// buduje dokument HTML dla iframe: CSS i JS z plikow projektu wklejone w miejsce <link>/<script src>
export function compose(project, entry) {
  const files = project.files || {};
  let html = files[entry] ?? '';
  if (/\.php$/i.test(entry)) html = stripPhp(html);
  const lookup = (ref) => {
    const clean = decodeURIComponent(String(ref).split(/[?#]/)[0]).replace(/^\.\//, '');
    return Object.prototype.hasOwnProperty.call(files, clean) ? clean : null;
  };
  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    if (!/rel\s*=\s*["']?stylesheet/i.test(tag)) return tag;
    const m = tag.match(/href\s*=\s*["']?([^"'\s>]+)/i);
    const f = m && lookup(m[1]);
    if (!f) return tag;
    return `<style data-file="${f}">\n${replaceAssetRefs(files[f], project.uploads)}\n</style>`;
  });
  html = html.replace(/<script\b([^>]*)\bsrc\s*=\s*["']?([^"'\s>]+)["']?([^>]*)>\s*<\/script>/gi, (tag, a, src, b) => {
    const f = lookup(src);
    if (!f) return tag;
    return `<script data-file="${f}"${a}${b}>\n${files[f].replace(/<\/script/gi, '<\\/script')}\n<\/script>`;
  });
  html = replaceAssetRefs(html, project.uploads, true);
  const base = project.assetsBase ? `<base href="${new URL(project.assetsBase, document.baseURI).href}">` : '';
  if (/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, (h) => `${h}${base}${PRELUDE}`);
  else html = `${base}${PRELUDE}${html}`;
  return html;
}

// ---------- iframe ----------

function makeFrame(width, height = 900, visible = false) {
  const f = document.createElement('iframe');
  f.setAttribute('aria-hidden', 'true');
  f.tabIndex = -1;
  Object.assign(f.style, visible ? {} : { position: 'fixed', left: '-20000px', top: '0', width: `${width}px`, height: `${height}px`, border: '0', visibility: 'hidden' });
  document.body.appendChild(f);
  return f;
}

async function load(frame, html) {
  await new Promise((resolve) => {
    frame.onload = () => resolve();
    frame.srcdoc = html;
    setTimeout(resolve, 4000);
  });
  const doc = frame.contentDocument;
  // poczekaj na obrazy (wplywaja na uklad) i czcionki
  const imgs = [...doc.images].filter((i) => !i.complete);
  await Promise.race([
    Promise.all(imgs.map((i) => new Promise((r) => { i.onload = r; i.onerror = r; }))),
    new Promise((r) => setTimeout(r, 2500)),
  ]);
  try { await Promise.race([doc.fonts.ready, new Promise((r) => setTimeout(r, 800))]); } catch (e) { /* brak API */ }
  await new Promise((r) => setTimeout(r, 60));
  return doc;
}

// ---------- normalizacja wartosci CSS ----------

const LENGTH_PROPS = /^(width|height|min-width|max-width|min-height|max-height|margin|padding|top|left|right|bottom|font-size|line-height|border-radius|letter-spacing|word-spacing|text-indent|gap)/;

// wartosc oczekiwana przeliczona przez przegladarke w tym samym kontekscie co element
function computedFor(el, prop, value) {
  const doc = el.ownerDocument;
  const win = doc.defaultView;
  const probe = doc.createElement(el.tagName === 'IMG' ? 'div' : el.tagName);
  const cs = win.getComputedStyle(el);
  for (const p of ['display', 'float', 'position', 'box-sizing', 'font-size', 'font-family', 'border-style']) probe.style.setProperty(p, cs.getPropertyValue(p));
  // obraz to element liniowy, ale procentowe wymiary dzialaja na nim jak na inline-block
  if (cs.display === 'inline') probe.style.setProperty('display', 'inline-block');
  probe.style.setProperty('visibility', 'hidden');
  probe.style.setProperty(prop, value);
  const parent = el.parentElement || doc.body;
  parent.insertBefore(probe, el.nextSibling);
  const v = win.getComputedStyle(probe).getPropertyValue(prop);
  probe.remove();
  return v;
}

function cmpCss(el, prop, expected, actual, tol = 1.5) {
  const want = computedFor(el, prop, expected);
  const got = actual ?? el.ownerDocument.defaultView.getComputedStyle(el).getPropertyValue(prop);
  if (prop === 'font-family') {
    const first = (s) => s.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
    return { ok: first(got) === first(expected) || first(got) === first(want), got };
  }
  if (norm(want) === norm(got)) return { ok: true, got };
  // url(...): liczy sie nazwa pliku (grafika moze byc z materialow albo wgrana przez kursanta)
  const files = (v) => [...String(v).matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => decodeURIComponent(m[1]).split(/[/?#]/).filter(Boolean).pop());
  if (/url\(/.test(want) && /url\(/.test(got) && files(want).join() === files(got).join()) return { ok: true, got };
  // dlugosci: tolerancja zaokraglen
  const nw = norm(want).split(' '), ng = norm(got).split(' ');
  if (LENGTH_PROPS.test(prop) && nw.length === ng.length && nw.every((w, i) => {
    const a = parseFloat(w), b = parseFloat(ng[i]);
    return !Number.isNaN(a) && !Number.isNaN(b) ? Math.abs(a - b) <= tol : w === ng[i];
  })) return { ok: true, got };
  return { ok: false, got, want };
}

// wartosc deklarowana w regule (shorthand rozpisany przez CSSOM) przeliczona w kontekscie elementu
function ruleValueMatches(el, style, prop, expected) {
  let v = style.getPropertyValue(prop);
  if (!v) return false;
  if (!el) return norm(v).toLowerCase() === norm(expected).toLowerCase();
  const a = computedFor(el, prop, v), b = computedFor(el, prop, expected);
  if (/url\(/.test(a) && /url\(/.test(b)) {
    const f = (x) => [...String(x).matchAll(/url\(["']?([^"')]+)["']?\)/g)].map((m) => decodeURIComponent(m[1]).split(/[/?#]/).filter(Boolean).pop()).join();
    return f(a) === f(b);
  }
  if (prop === 'font-family') return v.split(',')[0].replace(/["']/g, '').trim().toLowerCase() === expected.split(',')[0].replace(/["']/g, '').trim().toLowerCase();
  return norm(a) === norm(b);
}

// wymiar zapisany w regule trafiajacej w element (np. 50% w kontenerze flex, ktory zwęża bloki)
function declaredOn(el, prop, value) {
  const win = el.ownerDocument.defaultView;
  if (el.style.getPropertyValue(prop) && ruleValueMatches(el, el.style, prop, value)) return true;
  for (const { rule, media } of allRules(el.ownerDocument)) {
    if (media && !win.matchMedia(media).matches) continue;
    const hit = rule.selectorText.split(',').some((p) => { if (/:(hover|active|focus|visited)|::/i.test(p)) return false; try { return el.matches(p); } catch (e) { return false; } });
    if (hit && ruleValueMatches(el, rule.style, prop, value)) return true;
  }
  return false;
}

function* allRules(doc) {
  function* walk(list, media) {
    for (const r of list) {
      if (r.selectorText !== undefined) yield { rule: r, media };
      else if (r.cssRules) yield* walk(r.cssRules, r.conditionText || r.media?.mediaText || media);
    }
  }
  for (const sh of doc.styleSheets) {
    let rules;
    try { rules = sh.cssRules; } catch (e) { continue; }
    yield* walk(rules, null);
  }
}

const normSel = (s) => s.replace(/\[\s*([\w-]+)\s*([~|^$*]?=)\s*(["'])(.*?)\3\s*\]/g, '[$1$2$4]').replace(/\s+/g, ' ').replace(/\s*([>+~,])\s*/g, '$1').trim().toLowerCase();

// ---------- pojedyncze kryteria ----------

function el1(doc, c) {
  const list = doc.querySelectorAll(c.selector);
  return c.index != null ? list[c.index] : list[0];
}

function textMatch(actual, c) {
  const a = norm(actual);
  if (c.equals != null) return a === norm(c.equals);
  if (c.contains != null) return a.includes(norm(c.contains));
  if (c.startsWith != null) return a.startsWith(norm(c.startsWith));
  if (c.matches != null) return new RegExp(c.matches, 'i').test(a);
  return a.length > 0;
}

function checkStatic(doc, c, project, entry) {
  const src = (project.files || {})[entry] || '';
  switch (c.type) {
    case 'head': {
      const fails = [];
      if (c.doctype !== false && !/^\s*(<\?[\s\S]*?\?>\s*)*<!doctype html>/i.test(src)) fails.push('brak <!DOCTYPE html> na początku pliku');
      if (c.lang && !(doc.documentElement.getAttribute('lang') || '').toLowerCase().startsWith(c.lang)) fails.push(`brak lang="${c.lang}" w <html>`);
      if (c.charset && !/<meta[^>]+charset\s*=\s*["']?utf-8/i.test(src)) fails.push('brak <meta charset="utf-8">');
      if (c.title != null && norm(doc.title) !== norm(c.title)) fails.push(`tytuł strony to „${norm(doc.title)}”, a ma być „${c.title}”`);
      if (c.stylesheet && !new RegExp(`<link[^>]+href\\s*=\\s*["']?${escRe(c.stylesheet)}["'\\s>]`, 'i').test(src)) fails.push(`brak <link rel="stylesheet" href="${c.stylesheet}">`);
      return fails.length ? { ok: false, msg: fails.join('; ') } : { ok: true };
    }
    case 'exists': {
      if (c.selectors) {
        // kilka blokow, kazdy osobno (powtorzony selektor = co najmniej tyle elementow); bez wymogu kolejnosci w kodzie
        const need = {};
        for (const s of c.selectors) need[s] = (need[s] || 0) + 1;
        const miss = Object.entries(need).filter(([s, k]) => doc.querySelectorAll(s).length < k).map(([s, k]) => (k > 1 ? `${k}× ${s}` : s));
        return miss.length ? { ok: false, msg: `brak: ${miss.join(', ')}` } : { ok: true };
      }
      const n = doc.querySelectorAll(c.selector).length;
      if (c.count != null) return n === c.count ? { ok: true } : { ok: false, msg: `elementów „${c.selector}”: ${n}, oczekiwano ${c.count}` };
      if (c.min != null) return n >= c.min ? { ok: true } : { ok: false, msg: `elementów „${c.selector}”: ${n}, oczekiwano co najmniej ${c.min}` };
      return n > 0 ? { ok: true } : { ok: false, msg: `brak elementu „${c.selector}”` };
    }
    case 'text': {
      const nodes = [...doc.querySelectorAll(c.selector)];
      if (!nodes.length) return { ok: false, msg: `brak elementu „${c.selector}”` };
      const cand = c.index != null ? [nodes[c.index]].filter(Boolean) : c.any === false ? [nodes[0]] : nodes;
      // przycisk <input> ma napis w value, nie w tresci
      const txt = (n) => (n && n.tagName === 'INPUT' ? n.value : n?.textContent);
      if (cand.some((n) => textMatch(txt(n), c))) return { ok: true };
      return { ok: false, msg: `tekst „${norm(txt(cand[0])).slice(0, 80)}” ≠ „${c.equals ?? c.contains ?? c.startsWith ?? c.matches}”` };
    }
    case 'attr': {
      const nodes = [...doc.querySelectorAll(c.selector)];
      if (!nodes.length) return { ok: false, msg: `brak elementu „${c.selector}”` };
      const cand = c.index != null ? [nodes[c.index]].filter(Boolean) : nodes;
      const test = (n) => {
        // oryginalna nazwa tylko dopoki skrypt nie zmienil atrybutu
        const raw = n.getAttribute(c.attr);
        const v = /^(src|href)$/i.test(c.attr) && n.dataset.inf03Orig && raw === n.dataset.inf03Url ? n.dataset.inf03Orig : raw;
        if (c.absent) return v == null;
        if (v == null) return false;
        if (c.equals != null) return norm(v).toLowerCase() === norm(c.equals).toLowerCase() || (c.attr === 'src' || c.attr === 'href' ? v.endsWith(`/${c.equals}`) || decodeURIComponent(v) === c.equals : false);
        if (c.contains != null) return v.toLowerCase().includes(String(c.contains).toLowerCase());
        return true;
      };
      const ok = c.all ? cand.every(test) : cand.some(test);
      return ok ? { ok: true } : { ok: false, msg: c.absent ? `element „${c.selector}” nie powinien mieć atrybutu ${c.attr}` : `atrybut ${c.attr} elementu „${c.selector}”: „${cand[0].getAttribute(c.attr) ?? 'brak'}”` };
    }
    case 'css': {
      const nodes = [...doc.querySelectorAll(c.selector)];
      const el = c.index != null ? nodes[c.index] : nodes[0];
      if (!el) return { ok: false, msg: `brak elementu „${c.selector}”` };
      const targets = c.all ? nodes : [el];
      for (const t of targets) {
        const r = cmpCss(t, c.prop, c.value, null, c.tolerance);
        if (!r.ok && /^(min-|max-)?(width|height)$/.test(c.prop) && declaredOn(t, c.prop, c.value)) continue;
        if (!r.ok) return { ok: false, msg: `${c.prop} elementu „${c.selector}” = ${norm(r.got)}, oczekiwano ${c.value}` };
      }
      return { ok: true };
    }
    case 'cssRule': {
      let el = doc.querySelector(c.match || c.selector);
      // gdy elementu nie ma (np. tworzy go PHP), porownujemy na tymczasowym elemencie, zeby przegladarka
      // znormalizowala obie wartosci (np. kolejnosc w box-shadow)
      const temp = el ? null : doc.body.appendChild(doc.createElement('div'));
      if (temp) el = temp;
      const want = normSel(c.selector);
      // matching: dowolna regula, ktorej selektor trafia w element (bez pseudoklas), nie tylko dokladnie ten selektor
      const hits = (sel) => {
        const parts = sel.split(',');
        if (!c.matching || temp) return parts.map(normSel).includes(want);
        return parts.some((p) => { if (/:(hover|active|focus|visited|link)|::/i.test(p)) return false; try { return el.matches(p); } catch (e) { return false; } });
      };
      try {
        for (const { rule, media } of allRules(doc)) {
          if (!!c.media !== !!media) continue;
          if (!hits(rule.selectorText)) continue;
          if (!c.prop || ruleValueMatches(el, rule.style, c.prop, c.value)) return { ok: true };
        }
      } finally {
        if (temp) temp.remove();
      }
      return { ok: false, msg: c.prop ? `brak reguły „${c.selector} { ${c.prop}: ${c.value} }”` : `brak reguły dla selektora „${c.selector}”` };
    }
    case 'hover': {
      const el = doc.querySelector(c.selector);
      if (!el) {
        // element tworzony przez PHP: szukamy reguly „selektor:hover” zapisanej doslownie
        const want = normSel(c.selector), temp = doc.body.appendChild(doc.createElement('div'));
        try {
          for (const { rule } of allRules(doc)) {
            for (const part of rule.selectorText.split(',')) {
              if (!/:hover/i.test(part) || normSel(part.replace(/:hover/gi, '')) !== want) continue;
              if (!c.prop || ruleValueMatches(temp, rule.style, c.prop, c.value)) return { ok: true };
            }
          }
        } finally { temp.remove(); }
        return { ok: false, msg: `brak reguły „${c.selector}:hover”${c.prop ? ` z ${c.prop}: ${c.value}` : ''}` };
      }
      for (const { rule } of allRules(doc)) {
        for (const part of rule.selectorText.split(',')) {
          if (!/:hover/i.test(part)) continue;
          const base = part.replace(/:hover/gi, '').trim() || '*';
          let m = false;
          try { m = el.matches(base) || !!el.closest(base); } catch (e) { m = false; }
          if (m && (!c.prop || ruleValueMatches(el, rule.style, c.prop, c.value))) return { ok: true };
        }
      }
      return { ok: false, msg: `brak reguły :hover${c.prop ? ` z ${c.prop}: ${c.value}` : ''} dla „${c.selector}”` };
    }
    case 'layout': {
      const a = doc.querySelector(c.a), b = c.b ? doc.querySelector(c.b) : null;
      if (!a || (c.b && !b)) return { ok: false, msg: `brak bloku ${!a ? c.a : c.b}` };
      const A = a.getBoundingClientRect(), B = b?.getBoundingClientRect();
      const vOverlap = B && Math.min(A.bottom, B.bottom) - Math.max(A.top, B.top) > 2;
      const W = doc.documentElement.clientWidth;
      let ok;
      switch (c.relation) {
        case 'leftOf': ok = A.right <= B.left + 3 && vOverlap; break;
        case 'rightOf': ok = A.left >= B.right - 3 && vOverlap; break;
        case 'above': ok = A.bottom <= B.top + 3; break;
        case 'below': ok = A.top >= B.bottom - 3; break;
        case 'sameRow': ok = vOverlap && (A.right <= B.left + 3 || B.right <= A.left + 3); break;
        case 'fullWidth': ok = A.width >= W * 0.9; break;
        default: ok = false;
      }
      return ok ? { ok: true } : { ok: false, msg: `układ: „${c.a}” nie jest ${{ leftOf: 'na lewo od', rightOf: 'na prawo od', above: 'nad', below: 'pod', sameRow: 'w jednym rzędzie z', fullWidth: 'na całą szerokość' }[c.relation] || c.relation}${c.b ? ` „${c.b}”` : ''}` };
    }
    case 'file': {
      const has = Object.prototype.hasOwnProperty.call(project.files || {}, c.name) || Object.prototype.hasOwnProperty.call(project.uploads || {}, c.name);
      return has ? { ok: true } : { ok: false, msg: `brak pliku ${c.name}` };
    }
    default:
      return null;
  }
}

async function checkImage(project, c) {
  const url = (project.uploads || {})[c.name];
  if (!url) return { ok: false, msg: `wgraj swój plik ${c.name} (zakładka Pliki)` };
  const img = await new Promise((resolve) => { const i = new Image(); i.onload = () => resolve(i); i.onerror = () => resolve(null); i.src = url; });
  if (!img) return { ok: false, msg: `nie da się odczytać obrazu ${c.name}` };
  const fails = [];
  if (c.width && Math.abs(img.naturalWidth - c.width) > (c.tolerance ?? 1)) fails.push(`szerokość ${img.naturalWidth} px, oczekiwano ${c.width}`);
  if (c.height && Math.abs(img.naturalHeight - c.height) > (c.tolerance ?? 1)) fails.push(`wysokość ${img.naturalHeight} px, oczekiwano ${c.height}`);
  if (c.alpha) {
    const cv = document.createElement('canvas');
    cv.width = img.naturalWidth; cv.height = img.naturalHeight;
    const ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
    let transparent = 0;
    for (let i = 3; i < d.length; i += 4) if (d[i] < 250) transparent++;
    if (transparent < (d.length / 4) * 0.01) fails.push('brak przezroczystego tła');
  }
  if (c.format && !new RegExp(`\\.${c.format}$`, 'i').test(c.name)) fails.push(`zły format pliku (oczekiwano ${c.format})`);
  return fails.length ? { ok: false, msg: fails.join('; ') } : { ok: true };
}

async function checkJs(project, entry, c) {
  const frame = makeFrame(c.viewport || 1280);
  try {
    const doc = await load(frame, compose(project, entry));
    const win = frame.contentWindow;
    for (const s of c.steps || []) {
      if (s.set) {
        const el = doc.querySelector(s.set);
        if (!el) return { ok: false, msg: `brak pola „${s.set}”` };
        if (el.type === 'checkbox' || el.type === 'radio') el.checked = !!s.value;
        else el.value = s.value;
        el.dispatchEvent(new win.Event('input', { bubbles: true }));
        el.dispatchEvent(new win.Event('change', { bubbles: true }));
        el.dispatchEvent(new win.KeyboardEvent('keyup', { bubbles: true }));
      } else if (s.blur) {
        // utrata fokusu (onblur / focusout)
        const el = doc.querySelector(s.blur);
        if (!el) return { ok: false, msg: `brak pola „${s.blur}”` };
        el.dispatchEvent(new win.FocusEvent('blur'));
        el.dispatchEvent(new win.FocusEvent('focusout', { bubbles: true }));
      } else if (s.click) {
        const el = doc.querySelector(s.click);
        if (!el) return { ok: false, msg: `brak elementu „${s.click}”` };
        el.dispatchEvent(new win.MouseEvent('mouseover', { bubbles: true }));
        el.click();
      } else if (s.hover) {
        const el = doc.querySelector(s.hover);
        if (!el) return { ok: false, msg: `brak elementu „${s.hover}”` };
        el.dispatchEvent(new win.MouseEvent('mouseover', { bubbles: true }));
        el.dispatchEvent(new win.MouseEvent('mouseenter', { bubbles: false }));
      } else if (s.wait) {
        await new Promise((r) => setTimeout(r, Math.min(s.wait, 6000)));
      } else if (s.eval) {
        win.eval(s.eval);
      }
    }
    await new Promise((r) => setTimeout(r, 30));
    const errs = () => ((win.__errors || []).length ? ` (błąd JS: ${win.__errors[0]})` : '');
    for (const e of c.expect || []) {
      if (e.console != null) {
        const lines = win.__console || [];
        if (!lines.some((l) => norm(l).includes(norm(e.console)))) return { ok: false, msg: `w konsoli brak „${e.console}”${errs()}` };
        continue;
      }
      if (e.alert != null) {
        const al = win.__alerts || [];
        if (!al.some((a) => textMatch(a, { ...e, contains: e.alert === true ? undefined : e.alert }))) return { ok: false, msg: `brak komunikatu „${e.alert}”${errs()}` };
        continue;
      }
      const sub = { ...e, type: e.css ? 'css' : e.attr ? 'attr' : e.count != null ? 'exists' : 'text' };
      if (e.css) { sub.prop = e.css; sub.value = e.value; }
      const r = checkStatic(doc, sub, project, entry);
      if (r && !r.ok) return { ok: false, msg: `po akcji: ${r.msg}${errs()}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, msg: `błąd skryptu: ${err.message || err}` };
  } finally {
    frame.remove();
  }
}

// ---------- wszystkie kryteria ----------

// pole tekstowe bez atrybutu type tez jest polem edycyjnym
const looseSel = (s) => (typeof s === 'string' ? s.replace(/input\[type=["']?text["']?\]/gi, 'input:is([type="text" i], :not([type]))') : s);
function loosen(c) {
  if (c.type === 'cssRule' || c.type === 'hover') return c;
  const out = { ...c };
  for (const k of ['selector', 'a', 'b']) out[k] = looseSel(out[k]);
  if (out.selectors) out.selectors = out.selectors.map(looseSel);
  if (out.steps) out.steps = out.steps.map((st) => Object.fromEntries(Object.entries(st).map(([k, v]) => [k, k === 'value' || k === 'eval' ? v : looseSel(v)])));
  if (out.expect) out.expect = out.expect.map((e) => ({ ...e, selector: looseSel(e.selector) }));
  return out;
}

export async function runChecks(checks, project, entry) {
  checks = checks.map(loosen);
  const results = new Array(checks.length);
  // kryteria statyczne grupowane wg (szerokosc okna, strona): jedno zaladowanie na grupe
  const groups = new Map();
  checks.forEach((c, i) => {
    if (c.type === 'php' || c.type === 'manual') { results[i] = { status: 'manual' }; return; }
    if (c.type === 'js' || c.type === 'image') return;
    const key = `${c.viewport || 1280}|${c.page || entry}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(i);
  });
  for (const [key, idxs] of groups) {
    const [width, page] = [Number(key.split('|')[0]), key.slice(key.indexOf('|') + 1)];
    const frame = makeFrame(width);
    try {
      const doc = await load(frame, compose(project, page));
      for (const i of idxs) {
        let r;
        try { r = checkStatic(doc, checks[i], project, page) || { ok: false, msg: `nieznany typ kryterium: ${checks[i].type}` }; } catch (e) { r = { ok: false, msg: `błąd sprawdzania: ${e.message}` }; }
        results[i] = { status: r.ok ? 'pass' : 'fail', msg: r.msg };
      }
    } finally {
      frame.remove();
    }
  }
  for (let i = 0; i < checks.length; i++) {
    const c = checks[i];
    if (c.type === 'js') { const r = await checkJs(project, c.page || entry, c); results[i] = { status: r.ok ? 'pass' : 'fail', msg: r.msg }; }
    if (c.type === 'image') { const r = await checkImage(project, c); results[i] = { status: r.ok ? 'pass' : 'fail', msg: r.msg }; }
  }
  return results;
}

export function summary(checks, results) {
  let pass = 0, auto = 0, manual = 0;
  results.forEach((r) => {
    if (r.status === 'manual') manual++;
    else { auto++; if (r.status === 'pass') pass++; }
  });
  return { pass, auto, manual, total: checks.length };
}

export { makeFrame, load, TEXT_EXT };
