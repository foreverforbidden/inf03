import * as data from './data.js';
import * as eng from './sqlengine.js';
import * as prog from './progress.js';
import { createEditor } from './editor.js';
import { LESSONS, MODULES, SQL_LESSON_ORDER, lessonForQuery } from './content.js';

const app = document.getElementById('app');

// ---------- narzedzia ----------

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function render(html, title) {
  app.innerHTML = html;
  document.title = title ? `${title} · Trener INF.03` : 'Trener INF.03';
  window.scrollTo(0, 0);
}

function setNav(name) {
  document.querySelectorAll('.mainnav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === name));
}

function bar(done, total) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `<div class="bar" title="${done} z ${total}"><span style="width:${pct}%"></span></div>`;
}

function resultTable(res, limit = 50) {
  if (!res) return '<p class="muted small">Brak wyniku.</p>';
  if (!res.columns.length) return '<p class="muted small">Zapytanie nie zwróciło kolumn.</p>';
  const rows = res.values.slice(0, limit).map((r) => `<tr>${r.map((v) => (v == null ? '<td class="null">NULL</td>' : `<td title="${esc(v)}">${esc(v)}</td>`)).join('')}</tr>`).join('');
  const more = res.values.length > limit ? `<div class="table-note">Pokazano ${limit} z ${res.values.length} wierszy.</div>` : `<div class="table-note">${res.values.length} ${plural(res.values.length, 'wiersz', 'wiersze', 'wierszy')}</div>`;
  return `<div class="table-wrap"><table class="data"><tr>${res.columns.map((c) => `<th>${esc(c)}</th>`).join('')}</tr>${rows}</table>${more}</div>`;
}

function plural(n, one, few, many) {
  if (n === 1) return one;
  const d = n % 10, t = n % 100;
  return d >= 2 && d <= 4 && (t < 12 || t > 14) ? few : many;
}

const KIND_LABEL = { select: 'SELECT', modify: 'zmiana danych', ddl: 'struktura', view: 'widok', user: 'użytkownicy' };

// cwiczenia SQL pogrupowane wg lekcji (z index.json)
async function sqlExercises() {
  const idx = await data.index();
  const byLesson = Object.fromEntries(SQL_LESSON_ORDER.map((id) => [id, []]));
  for (const s of idx.sheets) {
    for (const q of s.queries) {
      byLesson[lessonForQuery(q)].push({ code: s.code, label: s.label, title: s.title, ...q });
    }
  }
  for (const id of SQL_LESSON_ORDER) byLesson[id].sort((a, b) => a.len - b.len || a.code.localeCompare(b.code));
  return byLesson;
}

async function nextExercise() {
  const by = await sqlExercises();
  for (const id of SQL_LESSON_ORDER) {
    const ex = by[id].find((e) => !prog.isDone(prog.sqlKey(e.code, e.n)));
    if (ex) return { lesson: id, ex };
  }
  return null;
}

// szkielet zapytania do podpowiedzi: slowa kluczowe zostaja, reszta to ___
const KEYWORDS = new Set(('select from where join inner left right on and or not order group by having limit as asc desc distinct like between in is null ' +
  'insert into values update set delete alter table add column drop change modify after first create user identified grant to all privileges ' +
  'view primary key auto_increment default count avg sum min max round rand year month day curdate now lower upper unsigned int tinyint varchar text date decimal').split(' '));

function skeleton(sql) {
  return sql.replace(/'(?:[^']|'')*'|"[^"]*"|`[^`]*`|[\p{L}_][\p{L}\p{N}_]*(?:\.[\p{L}_][\p{L}\p{N}_]*)?|\d+(?:\.\d+)?/gu, (tok) => {
    if (/^[\p{L}_]/u.test(tok) && KEYWORDS.has(tok.toLowerCase())) return tok.toUpperCase();
    return '___';
  }).replace(/___(\s*___)+/g, '___');
}

// ---------- widoki ----------

async function viewHome() {
  setNav('home');
  const by = await sqlExercises();
  const total = Object.values(by).reduce((a, l) => a + l.length, 0);
  const done = prog.doneCount('sql:');
  const next = await nextExercise();
  const steps = MODULES.map((m, i) => {
    let right = '';
    if (m.id === 'sql') right = bar(done, total);
    else if (m.id === 'start') right = prog.lessonSeen('egzamin') ? '<span class="pill ok">przeczytane</span>' : '<span class="pill accent">zacznij tutaj</span>';
    else right = '<span class="pill soon">wkrótce</span>';
    const cls = m.status === 'soon' ? 'locked' : (m.id === 'start' && prog.lessonSeen('egzamin')) || (m.id === 'sql' && total && done === total) ? 'done' : '';
    const inner = `<span class="num">${i + 1}</span><div><h3>${esc(m.title)}</h3><p>${esc(m.desc)}</p></div>${right}`;
    return m.href ? `<a class="card path-step ${cls}" href="${m.href}">${inner}</a>` : `<div class="card path-step ${cls}">${inner}</div>`;
  }).join('');
  render(`
    <h1>Naucz się pisać arkusze INF.03</h1>
    <p class="lead">Ćwiczysz na prawdziwych zadaniach CKE z lat 2022 do 2026. Kod sprawdza się od razu w przeglądarce, bez instalowania XAMPP.</p>
    ${next ? `<p class="btns"><a class="btn primary" href="#/sql/${next.ex.code}/${next.ex.n}?z=${next.lesson}">${done ? 'Kontynuuj' : 'Zacznij'}: ${esc(LESSONS[next.lesson].title)} →</a>
      <a class="btn" href="#/lekcja/egzamin">Mapa egzaminu</a></p>` : ''}
    <h2>Ścieżka</h2>
    <div class="path">${steps}</div>
    <h2>Jak to działa</h2>
    <div class="grid">
      <div class="card"><h3>Lekcja</h3><p class="muted">Krótko: wzór, przykład z arkusza, pułapki, za które CKE odejmuje punkty.</p></div>
      <div class="card"><h3>Ćwiczenie</h3><p class="muted">Prawdziwa kwerenda z arkusza, prawdziwa baza. Wynik i ocena od razu, z wyjaśnieniem, co jest nie tak.</p></div>
      <div class="card"><h3>Arkusz</h3><p class="muted">Całe zadanie z egzaminu krok po kroku. Później: egzamin próbny na czas.</p></div>
    </div>`, null);
}

async function viewLessons() {
  setNav('lekcje');
  const by = await sqlExercises();
  const items = [['egzamin', null], ...SQL_LESSON_ORDER.map((id) => [id, by[id]])].map(([id, ex], i) => {
    const l = LESSONS[id];
    const done = ex ? ex.filter((e) => prog.isDone(prog.sqlKey(e.code, e.n))).length : 0;
    const right = ex ? `<div>${bar(done, ex.length)}<div class="small muted" style="text-align:right">${done}/${ex.length}</div></div>`
      : (prog.lessonSeen(id) ? '<span class="pill ok">przeczytane</span>' : '');
    const cls = ex && ex.length && done === ex.length ? 'done' : '';
    return `<a class="card path-step ${cls}" href="#/lekcja/${id}"><span class="num">${i}</span><div><h3>${esc(l.title)}</h3><p>${esc(l.short)}</p></div>${right}</a>`;
  }).join('');
  render(`
    <h1>Lekcje</h1>
    <p class="lead">Moduł SQL. Ćwiczenia w każdej lekcji to kwerendy z prawdziwych arkuszy, od najkrótszych do najdłuższych.</p>
    <div class="path">${items}</div>
    <h2>Wkrótce</h2>
    <div class="grid">${MODULES.filter((m) => m.status === 'soon').map((m) => `<div class="card"><h3>${esc(m.title)} <span class="pill soon">wkrótce</span></h3><p class="muted">${esc(m.desc)}</p></div>`).join('')}</div>`, 'Lekcje');
}

async function viewLesson(id) {
  setNav('lekcje');
  const l = LESSONS[id];
  if (!l) return viewNotFound();
  prog.markLesson(id);
  let exHtml = '';
  if (SQL_LESSON_ORDER.includes(id)) {
    const ex = (await sqlExercises())[id];
    const done = ex.filter((e) => prog.isDone(prog.sqlKey(e.code, e.n))).length;
    const first = ex.find((e) => !prog.isDone(prog.sqlKey(e.code, e.n))) || ex[0];
    exHtml = `
      <h2>Ćwiczenia z arkuszy <span class="pill">${done}/${ex.length}</span></h2>
      <p class="muted">Każde ćwiczenie to prawdziwe zapytanie z egzaminu, na prawdziwej bazie.</p>
      ${first ? `<p class="btns"><a class="btn primary" href="#/sql/${first.code}/${first.n}?z=${id}">${done ? 'Następne nierozwiązane' : 'Pierwsze ćwiczenie'} →</a></p>` : ''}
      <ul class="ex-list">${ex.map((e) => `
        <li class="${prog.isDone(prog.sqlKey(e.code, e.n)) ? 'done' : ''}"><a href="#/sql/${e.code}/${e.n}?z=${id}">
          <span class="mark"></span>
          <span><span class="prompt">Zapytanie ${e.n}: ${esc(e.prompt)}</span><br><span class="src">${esc(e.label)} · ${esc(e.title)}</span></span>
          <span class="pill">${KIND_LABEL[e.kind] || e.kind}</span>
        </a></li>`).join('')}</ul>`;
  }
  const order = ['egzamin', ...SQL_LESSON_ORDER];
  const i = order.indexOf(id);
  const nav = `<p class="btns" style="margin-top:28px">${i > 0 ? `<a class="btn ghost" href="#/lekcja/${order[i - 1]}">← ${esc(LESSONS[order[i - 1]].title)}</a>` : ''}${i < order.length - 1 ? `<a class="btn" href="#/lekcja/${order[i + 1]}">${esc(LESSONS[order[i + 1]].title)} →</a>` : ''}</p>`;
  render(`<article class="lesson"><div class="crumbs"><a href="#/lekcje">Lekcje</a></div><h1>${esc(l.title)}</h1>${l.body}${exHtml}${nav}</article>`, l.title);
}

function schemaHtml(sheet) {
  const fk = new Map(sheet.foreign_keys.map((f) => [`${f.table}.${f.column}`, f]));
  return sheet.schema.map((t) => `
    <details data-table="${esc(t.table)}">
      <summary><span>${esc(t.table)}</span><span class="pill">${t.count} ${plural(t.count, 'rekord', 'rekordy', 'rekordów')}</span></summary>
      <div class="cols">${t.columns.map((c) => {
        const f = fk.get(`${t.table}.${c.name}`);
        return `<div><span>${esc(c.name)}</span><span class="t">${esc(c.type)}</span>${c.key === 'PRI' ? '<span class="key">PK</span>' : ''}${f ? `<span class="key fk" title="→ ${esc(f.ref_table)}.${esc(f.ref_column)}">FK → ${esc(f.ref_table)}</span>` : ''}</div>`;
      }).join('')}</div>
      <div class="rows"></div>
    </details>`).join('');
}

async function viewSqlExercise(code, n, lessonId) {
  setNav(lessonId ? 'lekcje' : 'arkusze');
  const sheet = await data.sheet(code);
  const q = sheet.queries.find((x) => x.n === n);
  if (!q) return viewNotFound();
  const key = prog.sqlKey(code, n);

  // nastepne cwiczenie: w lekcji albo w arkuszu
  let nextHref = null, nextLabel = '';
  if (lessonId && LESSONS[lessonId]) {
    const list = (await sqlExercises())[lessonId] || [];
    const i = list.findIndex((e) => e.code === code && e.n === n);
    const rest = [...list.slice(i + 1), ...list.slice(0, Math.max(i, 0))];
    const nx = rest.find((e) => !prog.isDone(prog.sqlKey(e.code, e.n))) || list[i + 1];
    if (nx) { nextHref = `#/sql/${nx.code}/${nx.n}?z=${lessonId}`; nextLabel = 'Następne ćwiczenie'; }
  } else {
    const nq = sheet.queries.find((x) => x.n > n);
    if (nq) { nextHref = `#/sql/${code}/${nq.n}`; nextLabel = `Zapytanie ${nq.n}`; }
  }

  const crumbs = lessonId && LESSONS[lessonId]
    ? `<a href="#/lekcje">Lekcje</a> / <a href="#/lekcja/${lessonId}">${esc(LESSONS[lessonId].title)}</a>`
    : `<a href="#/arkusze">Arkusze</a> / <a href="#/arkusz/${code}">${esc(sheet.label)}</a>`;
  const userNote = q.kind === 'user' ? '<p class="small muted">Tu nie ma serwera MySQL z kontami, więc „Uruchom” nic nie zrobi. „Sprawdź” rozbiera instrukcję i porównuje z treścią.</p>' : '';
  const prevKinds = sheet.queries.filter((x) => x.n < n && x.kind !== 'select' && x.kind !== 'user');
  const stateNote = prevKinds.length ? `<p class="small muted">Baza jest w stanie po wcześniejszych kwerendach tego arkusza (${prevKinds.map((x) => `nr ${x.n}`).join(', ')}).</p>` : '';

  render(`
    <div class="crumbs">${crumbs}</div>
    <h1>${esc(sheet.title)} <span class="pill">${esc(sheet.label)}</span></h1>
    <div class="workspace">
      <section class="stack">
        <div class="card">
          <p class="task-prompt"><strong>Zapytanie ${n}:</strong> ${esc(q.prompt || '(treść w arkuszu PDF)')}</p>
          <p class="small muted">Baza: <code>${esc(sheet.db)}</code>${sheet.pdf ? ` · <a href="${esc(sheet.pdf)}" target="_blank" rel="noopener">arkusz PDF</a>` : ''} · <a href="#/arkusz/${code}">wszystkie kwerendy arkusza</a></p>
          ${stateNote}
        </div>
        <div>
          <h3 style="margin-top:0">Tabele</h3>
          <div class="schema">${schemaHtml(sheet)}</div>
        </div>
      </section>
      <section class="stack">
        <div class="editor" id="ed"></div>
        <div class="btns">
          <button class="btn" id="run" type="button">▶ Uruchom</button>
          <button class="btn primary" id="check" type="button">✓ Sprawdź</button>
          <button class="btn ghost" id="hint" type="button">Podpowiedź</button>
          <button class="btn ghost" id="expected" type="button">Oczekiwany wynik</button>
        </div>
        <p class="kbd-help"><kbd>Ctrl</kbd>+<kbd>Enter</kbd> uruchom · <kbd>Shift</kbd>+<kbd>Enter</kbd> sprawdź${prog.isDone(key) ? ' · <span class="pill ok">rozwiązane</span>' : ''}</p>
        ${userNote}
        <div id="out"></div>
        <div id="hints"></div>
      </section>
    </div>`, `Zapytanie ${n} · ${sheet.title}`);

  const out = document.getElementById('out');
  const hints = document.getElementById('hints');
  let hintLevel = 0;

  const ed = createEditor(document.getElementById('ed'), {
    value: prog.getDraft(key) || '',
    onRun: run,
    onCheck: check,
    onChange: (v) => prog.setDraft(key, v),
  });
  ed.focus();

  // podglad danych tabeli po rozwinieciu (stan sprzed tej kwerendy)
  app.querySelectorAll('.schema details').forEach((d) => d.addEventListener('toggle', async () => {
    const box = d.querySelector('.rows');
    if (!d.open || box.dataset.loaded) return;
    box.dataset.loaded = '1';
    const db = await data.openState(code, n);
    try { box.innerHTML = resultTable(db.exec(`SELECT * FROM "${d.dataset.table}" LIMIT 30`)[0] || { columns: [], values: [] }, 30); } finally { db.close(); }
  }));

  async function run() {
    const text = ed.value;
    if (!text.trim()) { out.innerHTML = '<div class="verdict info">Wpisz zapytanie.</div>'; return; }
    if (q.kind === 'user') { out.innerHTML = '<div class="verdict info">Instrukcji użytkowników nie da się tu wykonać. Użyj „Sprawdź”.</div>'; return; }
    const db = await data.openState(code, n);
    try {
      const stmts = eng.splitStatements(text);
      let last = null, changed = 0, kinds = [];
      for (const st of stmts) {
        const k = eng.statementKind(st);
        kinds.push(k);
        if (k === 'user') continue;
        for (const t of eng.translate(st)) {
          const res = db.exec(t);
          if (k === 'select') last = res[0] || { columns: [], values: [] };
          else changed += db.getRowsModified();
        }
      }
      if (last) out.innerHTML = `<h3>Wynik</h3>${resultTable(last)}`;
      else {
        const t = eng.targetTable(stmts[stmts.length - 1]);
        let after = '';
        if (t && eng.listTables(db).includes(t)) after = `<h3>Tabela ${esc(t)} po wykonaniu</h3>${resultTable(db.exec(`SELECT * FROM "${t}"`)[0] || { columns: [], values: [] })}`;
        out.innerHTML = `<div class="verdict info">Wykonano.${kinds.includes('modify') ? ` Zmienione wiersze: ${changed}.` : ''}</div>${after}`;
      }
    } catch (e) {
      out.innerHTML = `<div class="verdict bad"><h3>Błąd SQL</h3><p>${esc(e.message || e)}</p></div>`;
    } finally {
      db.close();
    }
  }

  async function check() {
    const text = ed.value;
    const { db, ref } = await data.openPair(code, n);
    let r;
    try { r = eng.gradeQuery(db, ref, sheet, q, text); } finally { db.close(); ref.close(); }
    prog.addTry(key);
    if (r.ok) {
      prog.markDone(key);
      out.innerHTML = `<div class="verdict ok"><h3>Dobrze! ✓</h3><p>Wynik zgadza się z poprawnym rozwiązaniem.</p>
        <p class="btns">${nextHref ? `<a class="btn primary" href="${nextHref}">${esc(nextLabel)} →</a>` : ''}<button class="btn ghost" id="cmp" type="button">Porównaj z wzorcem</button></p></div>
        ${r.result ? `<h3>Twój wynik</h3>${resultTable(r.result, 20)}` : ''}`;
      document.getElementById('cmp').addEventListener('click', () => { hints.innerHTML = `<div class="hint"><strong>Rozwiązanie wzorcowe</strong><pre>${esc(q.sql)}</pre></div>`; });
    } else {
      out.innerHTML = `<div class="verdict bad"><h3>Jeszcze nie</h3><ul>${r.reasons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
        ${r.result ? `<h3>Twój wynik</h3>${resultTable(r.result, 20)}` : ''}`;
    }
  }

  document.getElementById('run').addEventListener('click', run);
  document.getElementById('check').addEventListener('click', check);
  document.getElementById('expected').addEventListener('click', async () => {
    const { db, ref } = await data.openPair(code, n);
    try {
      const prev = eng.referencePreview(ref, q);
      const random = /\brand\s*\(/i.test(q.sql);
      hints.innerHTML = `<div class="hint"><strong>Tak ma wyglądać wynik</strong>${random ? ' <span class="muted small">(wiersze losowe, u Ciebie będą inne)</span>' : ''}${q.kind === 'modify' || q.kind === 'ddl' ? ' <span class="muted small">(zawartość tabeli po poprawnej kwerendzie)</span>' : ''}
        ${prev ? resultTable(prev, 15) : '<p class="muted">Ta instrukcja nie zwraca tabeli wyników.</p>'}</div>`;
    } finally { db.close(); ref.close(); }
  });
  document.getElementById('hint').addEventListener('click', () => {
    hintLevel = Math.min(hintLevel + 1, 3);
    const lessonOf = lessonForQuery(q);
    const parts = [];
    parts.push(`<p><strong>1.</strong> Potrzebne wzorce: ${q.tags.map((t) => `<span class="pill accent">${esc(t.replace('sql:', ''))}</span>`).join(' ')}. Zajrzyj do lekcji <a href="#/lekcja/${lessonOf}">${esc(LESSONS[lessonOf].title)}</a>.</p>`);
    if (hintLevel >= 2) parts.push(`<p><strong>2.</strong> Szkielet (uzupełnij ___):</p><pre>${esc(skeleton(q.sql))}</pre>`);
    if (hintLevel >= 3) parts.push(`<p><strong>3.</strong> Rozwiązanie wzorcowe:</p><pre>${esc(q.sql)}</pre><p class="small muted">Przepisz je samodzielnie zamiast kopiować. Zapamiętujesz przez pisanie.</p>`);
    else parts.push(`<p class="small muted">Kliknij „Podpowiedź” jeszcze raz, żeby zobaczyć więcej.</p>`);
    hints.innerHTML = `<div class="hint">${parts.join('')}</div>`;
  });
}

async function viewSheets() {
  setNav('arkusze');
  const idx = await data.index();
  const years = [...new Set(idx.sheets.map((s) => s.code.split('_')[1]))].sort().reverse();
  render(`
    <h1>Arkusze</h1>
    <p class="lead">${idx.sheets.length} arkuszy z rozwiązaniami. Na razie ćwiczysz w nich kwerendy SQL; strona i skrypty dojdą w kolejnych modułach.</p>
    <div class="filters">
      <input id="f-q" type="search" placeholder="Szukaj (np. biblioteka)" aria-label="Szukaj">
      <select id="f-year" aria-label="Rok"><option value="">Wszystkie lata</option>${years.map((y) => `<option>${y}</option>`).join('')}</select>
      <select id="f-kind" aria-label="Rodzaj skryptu"><option value="">PHP i JS</option><option value="php">PHP</option><option value="js">tylko JS</option></select>
      <select id="f-st" aria-label="Stan"><option value="">Wszystkie</option><option value="todo">Nieukończone</option><option value="done">Ukończone</option></select>
    </div>
    <div class="stack" id="list"></div>`, 'Arkusze');
  const list = document.getElementById('list');
  const draw = () => {
    const qv = document.getElementById('f-q').value.trim().toLowerCase();
    const y = document.getElementById('f-year').value;
    const k = document.getElementById('f-kind').value;
    const st = document.getElementById('f-st').value;
    const rows = idx.sheets.filter((s) => {
      const done = s.queries.filter((q) => prog.isDone(prog.sqlKey(s.code, q.n))).length;
      const full = s.queries.length && done === s.queries.length;
      return (!qv || `${s.title} ${s.label} ${s.db}`.toLowerCase().includes(qv))
        && (!y || s.code.split('_')[1] === y) && (!k || s.kind === k)
        && (!st || (st === 'done' ? full : !full));
    }).map((s) => {
      const done = s.queries.filter((q) => prog.isDone(prog.sqlKey(s.code, q.n))).length;
      return `<a class="card sheet-row" href="#/arkusz/${s.code}">
        <div><h3>${esc(s.title || s.code)}</h3><p class="small muted">${esc(s.label)}${s.db ? ` · baza ${esc(s.db)}` : ''}</p>
          <div class="tags"><span class="pill">${s.kind === 'php' ? 'PHP' : 'JS'}</span>${s.queries.length ? `<span class="pill">${s.queries.length} ${plural(s.queries.length, 'kwerenda', 'kwerendy', 'kwerend')}</span>` : ''}</div></div>
        <div style="min-width:110px">${s.queries.length ? `${bar(done, s.queries.length)}<div class="small muted" style="text-align:right">${done}/${s.queries.length}</div>` : '<span class="small muted">bez bazy</span>'}</div>
      </a>`;
    });
    list.innerHTML = rows.join('') || '<p class="muted">Nic nie pasuje do filtrów.</p>';
  };
  app.querySelectorAll('.filters input, .filters select').forEach((e) => e.addEventListener('input', draw));
  draw();
}

async function viewSheet(code) {
  setNav('arkusze');
  const sheet = await data.sheet(code).catch(() => null);
  if (!sheet) return viewNotFound();
  const first = sheet.queries.find((q) => !prog.isDone(prog.sqlKey(code, q.n))) || sheet.queries[0];
  render(`
    <div class="crumbs"><a href="#/arkusze">Arkusze</a></div>
    <h1>${esc(sheet.title || code)}</h1>
    <p class="muted">${esc(sheet.label)}${sheet.db ? ` · baza <code>${esc(sheet.db)}</code>` : ''} · ${sheet.kind === 'php' ? 'skrypt PHP' : 'skrypt JS'}</p>
    <p class="btns">${first ? `<a class="btn primary" href="#/sql/${code}/${first.n}">Rozwiązuj kwerendy po kolei →</a>` : ''}${sheet.pdf ? `<a class="btn" href="${esc(sheet.pdf)}" target="_blank" rel="noopener">Arkusz PDF</a>` : ''}</p>
    <h2>Operacje na bazie danych</h2>
    ${sheet.queries.length ? `<ul class="ex-list">${sheet.queries.map((q) => `
      <li class="${prog.isDone(prog.sqlKey(code, q.n)) ? 'done' : ''}"><a href="#/sql/${code}/${q.n}">
        <span class="mark"></span><span class="prompt">Zapytanie ${q.n}: ${esc(q.prompt)}</span><span class="pill">${KIND_LABEL[q.kind] || q.kind}</span>
      </a></li>`).join('')}</ul>` : '<p class="muted">Ten arkusz nie ma bazy danych (sama strona i JavaScript).</p>'}
    <h2>Strona i skrypty</h2>
    <p class="muted">Edytor strony z podglądem i automatycznym sprawdzaniem HTML, CSS, PHP i JS jest w przygotowaniu. Na razie treść tej części jest w arkuszu PDF.</p>`, sheet.title);
}

async function viewProgress() {
  setNav('postep');
  const by = await sqlExercises();
  const rows = SQL_LESSON_ORDER.map((id) => {
    const ex = by[id];
    const done = ex.filter((e) => prog.isDone(prog.sqlKey(e.code, e.n))).length;
    return `<tr><td><a href="#/lekcja/${id}">${esc(LESSONS[id].title)}</a></td><td>${done}/${ex.length}</td><td style="width:40%">${bar(done, ex.length)}</td></tr>`;
  }).join('');
  const idx = await data.index();
  const fullSheets = idx.sheets.filter((s) => s.queries.length && s.queries.every((q) => prog.isDone(prog.sqlKey(s.code, q.n)))).length;
  render(`
    <h1>Postęp</h1>
    <p class="lead">Kwerendy z arkuszy rozwiązane w całości: <strong>${fullSheets}</strong> z ${idx.sheets.filter((s) => s.queries.length).length} arkuszy.</p>
    <div class="table-wrap"><table class="data"><tr><th>Lekcja</th><th>Ćwiczenia</th><th>Postęp</th></tr>${rows}</table></div>
    <h2>Kopia postępu</h2>
    <p class="muted">Postęp jest zapisany tylko w tej przeglądarce. Zrób kopię, zanim wyczyścisz dane albo zmienisz urządzenie.</p>
    <div class="btns">
      <button class="btn" id="exp" type="button">Pobierz plik z postępem</button>
      <label class="btn" for="imp">Wczytaj plik z postępem</label><input id="imp" type="file" accept="application/json,.json" hidden>
      <button class="btn ghost" id="rst" type="button">Wyczyść postęp</button>
    </div>
    <p id="msg" class="small"></p>`, 'Postęp');
  const msg = document.getElementById('msg');
  document.getElementById('exp').addEventListener('click', () => {
    const blob = new Blob([prog.exportJson()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `postep-inf03-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  document.getElementById('imp').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try { prog.importJson(await f.text()); viewProgress(); } catch (err) { msg.textContent = err.message; }
  });
  document.getElementById('rst').addEventListener('click', () => {
    if (confirm('Na pewno wyczyścić cały postęp w tej przeglądarce?')) { prog.reset(); viewProgress(); }
  });
}

function viewNotFound() {
  setNav('');
  render('<h1>Nie ma takiej strony</h1><p><a href="#/">Wróć na start</a></p>', 'Nie znaleziono');
}

// ---------- routing ----------

async function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const [path, query] = hash.split('?');
  const params = new URLSearchParams(query || '');
  const parts = path.split('/').filter(Boolean);
  try {
    if (!parts.length) await viewHome();
    else if (parts[0] === 'lekcje') await viewLessons();
    else if (parts[0] === 'lekcja' && parts[1]) await viewLesson(parts[1]);
    else if (parts[0] === 'sql' && parts[1] && parts[2]) await viewSqlExercise(parts[1], Number(parts[2]), params.get('z'));
    else if (parts[0] === 'arkusze') await viewSheets();
    else if (parts[0] === 'arkusz' && parts[1]) await viewSheet(parts[1]);
    else if (parts[0] === 'postep') await viewProgress();
    else viewNotFound();
  } catch (e) {
    console.error(e);
    render(`<h1>Coś poszło nie tak</h1><p class="muted">${esc(e.message || e)}</p><p><a href="#/">Wróć na start</a></p>`, 'Błąd');
  }
}

window.addEventListener('hashchange', route);
route();

document.querySelector('.theme-toggle').addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try { localStorage.setItem('inf03-theme', root.dataset.theme); } catch (e) { /* brak dostepu */ }
});
