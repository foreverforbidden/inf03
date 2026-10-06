// Silnik kwerend: tlumaczy MySQL na SQLite (sql.js), wykonuje i ocenia odpowiedz kursanta.
// Bez zaleznosci od DOM - uzywany w przegladarce i w testach w Node.

// ---------- dzielenie tekstu na instrukcje ----------

export function stripComments(text) {
  let out = '', q = null;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i], nx = text[i + 1];
    if (q) {
      out += ch;
      if (ch === '\\' && q !== '`') { out += nx ?? ''; i++; continue; }
      if (ch === q) q = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; out += ch; continue; }
    if ((ch === '-' && nx === '-' && /\s|$/.test(text[i + 2] ?? '')) || ch === '#') {
      while (i < text.length && text[i] !== '\n') i++;
      out += '\n';
      continue;
    }
    if (ch === '/' && nx === '*') {
      const end = text.indexOf('*/', i + 2);
      i = end < 0 ? text.length : end + 1;
      out += ' ';
      continue;
    }
    out += ch;
  }
  return out;
}

export function splitStatements(text) {
  const src = stripComments(text);
  const out = [];
  let cur = '', q = null;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (q) {
      cur += ch;
      if (ch === '\\' && q !== '`') { cur += src[++i] ?? ''; continue; }
      if (ch === q) q = null;
    } else if (ch === "'" || ch === '"' || ch === '`') {
      q = ch; cur += ch;
    } else if (ch === ';') {
      if (cur.trim()) out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

// dzieli po przecinkach na najwyzszym poziomie (poza nawiasami i napisami)
function splitTop(s, sep = ',') {
  const out = [];
  let depth = 0, cur = '', q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; cur += ch; continue; }
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === sep && depth === 0) { out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

const unq = (s) => (s || '').trim().replace(/^[`'"]|[`'"]$/g, '');

// ---------- rodzaj instrukcji ----------

export function statementKind(sql) {
  const s = sql.trim().toLowerCase();
  if (/^(create\s+user|grant|revoke|drop\s+user|set\s+password|alter\s+user|flush)\b/.test(s)) return 'user';
  if (/^(insert|update|delete|replace)\b/.test(s)) return 'modify';
  if (/^create\s+(or\s+replace\s+)?(algorithm\s*=\s*\w+\s+)?view\b/.test(s)) return 'view';
  if (/^(alter\s+table|create\s+table|drop\s+table|rename\s+table|create\s+(unique\s+)?index)\b/.test(s)) return 'ddl';
  if (/^(select|with|show|describe|desc|explain)\b/.test(s) || /^\(\s*select/.test(s)) return 'select';
  return 'other';
}

export function targetTable(sql) {
  const m = sql.match(/^\s*(?:insert\s+(?:ignore\s+)?into|replace\s+into|update|delete\s+from|alter\s+table|create\s+table(?:\s+if\s+not\s+exists)?|drop\s+table(?:\s+if\s+exists)?)\s+`?(\w+)`?/i);
  return m ? m[1] : null;
}

// ---------- typy kolumn ----------

export function normType(t) {
  if (!t) return '';
  let s = t.toLowerCase().replace(/\s+/g, ' ').trim();
  s = s.replace(/\binteger\b/g, 'int').replace(/\bbool(ean)?\b/g, 'tinyint');
  s = s.replace(/\b(tinyint|smallint|mediumint|int|bigint)\s*\(\s*\d+\s*\)/g, '$1');
  s = s.replace(/\s*\(\s*/g, '(').replace(/\s*,\s*/g, ',').replace(/\s*\)/g, ')');
  s = s.replace(/\bcharacter\s+set\s+\w+|\bcollate\s+\w+|\bzerofill\b/g, '').replace(/\s+/g, ' ').trim();
  return s;
}

// definicja kolumny "nazwa typ [NOT NULL] [DEFAULT x] ..." -> model
function parseColumnDef(def) {
  const m = def.match(/^\s*(`[^`]+`|"[^"]+"|\w+)\s+([\s\S]*)$/);
  if (!m) return null;
  const name = unq(m[1]);
  let rest = m[2];
  const tm = rest.match(/^([a-z]+(?:\s*\([^)]*\))?(?:\s+unsigned)?(?:\s+zerofill)?)/i);
  const type = tm ? tm[1] : '';
  rest = rest.slice(type.length);
  const notNull = /\bnot\s+null\b/i.test(rest) || /\bprimary\s+key\b/i.test(rest);
  const dm = rest.match(/\bdefault\s+('(?:[^']|'')*'|"[^"]*"|[^\s,]+)/i);
  let dflt = dm ? unq(dm[1]) : null;
  if (dflt && dflt.toUpperCase() === 'NULL') dflt = null;
  return {
    name, type: normType(type), nullable: !notNull, default: dflt,
    pk: /\bprimary\s+key\b/i.test(rest), ai: /\bauto_increment\b/i.test(rest),
  };
}

// ---------- tlumaczenie MySQL -> SQLite ----------

function cleanColumnDef(def) {
  let d = def;
  d = d.replace(/\b(character\s+set|charset)\s+\w+/gi, '').replace(/\bcollate\s+\w+/gi, '');
  d = d.replace(/\bunsigned\b|\bzerofill\b/gi, '').replace(/\bcomment\s+'(?:[^']|'')*'/gi, '');
  d = d.replace(/\benum\s*\([^)]*\)|\bset\s*\([^)]*\)/gi, 'TEXT');
  d = d.replace(/\bon\s+update\s+current_timestamp(\(\))?/gi, '');
  d = d.replace(/\b(first|after\s+`?\w+`?)\s*$/i, '');
  if (/\bauto_increment\b/i.test(d)) {
    const m = d.match(/^\s*(`[^`]+`|"[^"]+"|\w+)/);
    return `${m ? m[1] : d} INTEGER PRIMARY KEY AUTOINCREMENT`;
  }
  return d.replace(/\s+/g, ' ').trim();
}

// w MySQL "/" zawsze daje ulamek, w SQLite liczby calkowite dziela sie calkowicie
function realDivision(sql) {
  let out = '', q = null;
  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    if (q) { out += ch; if (ch === q) q = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; out += ch; continue; }
    out += ch === '/' ? '* 1.0 /' : ch;
  }
  return out;
}

// zwraca liste instrukcji SQLite (moze byc pusta, gdy instrukcja nie zmienia danych w SQLite)
export function translate(sql) {
  let s = sql.trim().replace(/;+\s*$/, '');
  const kind = statementKind(s);
  if (kind === 'user') return [];
  const low = s.toLowerCase();

  if (/^create\s+table/.test(low)) {
    const open = s.indexOf('(');
    const close = s.lastIndexOf(')');
    if (open < 0 || close < 0) return [s];
    const head = s.slice(0, open);
    const parts = splitTop(s.slice(open + 1, close)).map((p) => {
      if (/^(key|index|unique\s+key|fulltext)\b/i.test(p)) return null;
      if (/^(constraint\s+\S+\s+)?foreign\s+key/i.test(p)) return null;
      if (/^primary\s+key/i.test(p)) return p;
      return cleanColumnDef(p);
    }).filter(Boolean);
    // gdy kolumna jest juz INTEGER PRIMARY KEY, usun osobny PRIMARY KEY (...)
    const hasInlinePk = parts.some((p) => /primary\s+key/i.test(p) && !/^primary\s+key/i.test(p));
    const body = parts.filter((p) => !(hasInlinePk && /^primary\s+key/i.test(p)));
    return [`${head}(${body.join(', ')})`];
  }

  if (/^alter\s+table/.test(low)) {
    const m = s.match(/^alter\s+table\s+(`[^`]+`|\w+)\s+([\s\S]*)$/i);
    if (!m) return [s];
    const table = m[1];
    const out = [];
    for (const op of splitTop(m[2])) {
      let mm;
      if ((mm = op.match(/^add\s+(?:column\s+)?(?!primary|foreign|constraint|index|key|unique)([\s\S]+)$/i))) {
        out.push(`ALTER TABLE ${table} ADD COLUMN ${cleanColumnDef(mm[1]).replace(/INTEGER PRIMARY KEY AUTOINCREMENT/, 'INTEGER')}`);
      } else if ((mm = op.match(/^drop\s+(?:column\s+)?(?!primary|foreign|index|key)(`[^`]+`|\w+)\s*$/i))) {
        out.push(`ALTER TABLE ${table} DROP COLUMN ${mm[1]}`);
      } else if ((mm = op.match(/^change\s+(?:column\s+)?(`[^`]+`|\w+)\s+(`[^`]+`|\w+)/i))) {
        if (unq(mm[1]).toLowerCase() !== unq(mm[2]).toLowerCase()) out.push(`ALTER TABLE ${table} RENAME COLUMN ${mm[1]} TO ${mm[2]}`);
      } else if ((mm = op.match(/^rename\s+column\s+(`[^`]+`|\w+)\s+to\s+(`[^`]+`|\w+)/i))) {
        out.push(`ALTER TABLE ${table} RENAME COLUMN ${mm[1]} TO ${mm[2]}`);
      } else if ((mm = op.match(/^rename\s+(?:to\s+|as\s+)?(`[^`]+`|\w+)\s*$/i))) {
        out.push(`ALTER TABLE ${table} RENAME TO ${mm[1]}`);
      }
      // MODIFY, klucze, indeksy: SQLite nie zmienia typu kolumny - pomijamy (ocena na modelu schematu)
    }
    return out;
  }

  if (kind === 'view') {
    s = s.replace(/^create\s+or\s+replace\s+/i, 'CREATE ').replace(/\s+algorithm\s*=\s*\w+/i, '');
  }
  // zwykle zapytania: drobne roznice skladni
  s = realDivision(s);
  s = s.replace(/\bcast\s*\(([\s\S]*?)\s+as\s+(signed|unsigned)(\s+integer)?\s*\)/gi, 'CAST($1 AS INTEGER)');
  s = s.replace(/\bcast\s*\(([\s\S]*?)\s+as\s+(decimal|char)\b[^)]*\)/gi, (m0, e, t) => `CAST(${e} AS ${t.toLowerCase() === 'char' ? 'TEXT' : 'REAL'})`);
  s = s.replace(/\s+div\s+/gi, ' / ');
  s = s.replace(/\bcurrent_date\b(?!\s*\()/gi, 'CURDATE()');
  s = s.replace(/\binsert\s+ignore\b/gi, 'INSERT OR IGNORE');
  return [s];
}

// ---------- funkcje MySQL brakujace w SQLite ----------

const pad = (n) => String(n).padStart(2, '0');
function today() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function nowStr() { const d = new Date(); return `${today()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`; }
function parseDate(v) {
  if (v == null) return null;
  const m = String(v).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
}

export function registerFunctions(db) {
  const f = (name, fn) => db.create_function(name, fn);
  f('YEAR', (v) => parseDate(v)?.y ?? null);
  f('MONTH', (v) => parseDate(v)?.m ?? null);
  f('DAY', (v) => parseDate(v)?.d ?? null);
  f('DAYOFMONTH', (v) => parseDate(v)?.d ?? null);
  f('CURDATE', () => today());
  f('CURRENT_DATE', () => today());
  f('NOW', () => nowStr());
  f('SYSDATE', () => nowStr());
  f('CURTIME', () => nowStr().slice(11));
  f('DATEDIFF', (a, b) => {
    const A = parseDate(a), B = parseDate(b);
    if (!A || !B) return null;
    return Math.round((Date.UTC(A.y, A.m - 1, A.d) - Date.UTC(B.y, B.m - 1, B.d)) / 86400000);
  });
  f('IF', (c, a, b) => (c && c !== '0' ? a : b));
  f('LOWER', (s) => (s == null ? null : String(s).toLowerCase()));
  f('UPPER', (s) => (s == null ? null : String(s).toUpperCase()));
  // ROUND jak w MySQL dla DECIMAL: polowki od zera (1.575 -> 1.58).
  // sql.js rejestruje funkcje wg liczby parametrow (fn.length), wiec dwie wersje.
  const mysqlRound = (x, d) => {
    if (x == null) return null;
    const v = Number(Number(x).toPrecision(12)), k = Math.trunc(Number(d) || 0);
    const r = Math.sign(v) * Number(`${Math.round(Number(`${Math.abs(v)}e${k}`))}e${-k}`);
    return k <= 0 ? Math.round(r) : r;
  };
  f('ROUND', (x) => mysqlRound(x, 0));
  f('ROUND', (x, d) => mysqlRound(x, d));
  f('LCASE', (s) => (s == null ? null : String(s).toLowerCase()));
  f('UCASE', (s) => (s == null ? null : String(s).toUpperCase()));
  f('LEFT', (s, n) => (s == null ? null : String(s).slice(0, n)));
  f('RIGHT', (s, n) => (s == null ? null : (n > 0 ? String(s).slice(-n) : '')));
  f('CHAR_LENGTH', (s) => (s == null ? null : [...String(s)].length));
  f('RAND', () => Math.random());
  f('TRUNCATE', (x, d) => (x == null ? null : Math.trunc(x * 10 ** d) / 10 ** d));
  f('REGEXP', (re, s) => (s == null ? null : (new RegExp(re, 'i').test(String(s)) ? 1 : 0)));
  f('DATE_FORMAT', (v, fmt) => {
    const d = parseDate(v);
    if (!d) return null;
    return String(fmt).replace(/%Y/g, d.y).replace(/%m/g, pad(d.m)).replace(/%d/g, pad(d.d)).replace(/%e/g, d.d);
  });
}

// ---------- wykonanie ----------

export function runStatements(db, statements) {
  // zwraca wynik ostatniej instrukcji typu select
  let last = null;
  for (const st of statements) {
    for (const t of translate(st)) {
      const res = db.exec(t);
      if (statementKind(st) === 'select') last = res[0] || { columns: [], values: [] };
    }
  }
  return last;
}

export function tableInfo(db, table) {
  const res = db.exec(`PRAGMA table_info("${table.replace(/"/g, '')}")`)[0];
  if (!res) return null;
  // cid, name, type, notnull, dflt_value, pk
  return res.values.map((r) => ({ name: r[1], type: normType(r[2]), nullable: !r[3] && !r[5], default: r[4] == null ? null : unq(String(r[4])), pk: !!r[5] }));
}

export function tableRows(db, table) {
  const res = db.exec(`SELECT * FROM "${table.replace(/"/g, '')}"`)[0];
  return res ? res.values : [];
}

export function listTables(db) {
  const res = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name")[0];
  return res ? res.values.map((r) => r[0]) : [];
}

// ---------- model schematu (dla ALTER/CREATE/DROP TABLE) ----------

export function applySchemaChange(schema, sql) {
  // schema: {tabela: [{name,type,nullable,default}]}; zwraca nowa kopie
  const s = sql.trim().replace(/;+\s*$/, '');
  const out = JSON.parse(JSON.stringify(schema));
  let m;
  if ((m = s.match(/^create\s+table\s+(?:if\s+not\s+exists\s+)?(`[^`]+`|\w+)\s*\(([\s\S]*)\)[^)]*$/i))) {
    const cols = splitTop(m[2]).filter((p) => !/^(primary\s+key|key|index|unique|constraint|foreign\s+key|fulltext)\b/i.test(p)).map(parseColumnDef).filter(Boolean);
    const pkm = m[2].match(/primary\s+key\s*\(([^)]*)\)/i);
    if (pkm) for (const p of pkm[1].split(',').map(unq)) { const c = cols.find((c) => c.name.toLowerCase() === p.toLowerCase()); if (c) c.nullable = false; }
    out[unq(m[1])] = cols;
    return out;
  }
  if ((m = s.match(/^drop\s+table\s+(?:if\s+exists\s+)?(`[^`]+`|\w+)/i))) {
    delete out[Object.keys(out).find((k) => k.toLowerCase() === unq(m[1]).toLowerCase())];
    return out;
  }
  if (!(m = s.match(/^alter\s+table\s+(`[^`]+`|\w+)\s+([\s\S]*)$/i))) return out;
  const tkey = Object.keys(out).find((k) => k.toLowerCase() === unq(m[1]).toLowerCase());
  if (!tkey) return out;
  let cols = out[tkey];
  const idx = (name) => cols.findIndex((c) => c.name.toLowerCase() === unq(name).toLowerCase());
  for (const op of splitTop(m[2])) {
    let mm;
    const pos = op.match(/\b(first|after\s+(`[^`]+`|\w+))\s*$/i);
    const place = (col) => {
      if (pos && /^first/i.test(pos[1])) cols.unshift(col);
      else if (pos) cols.splice(idx(pos[2]) + 1, 0, col);
      else cols.push(col);
    };
    const body = pos ? op.slice(0, pos.index) : op;
    if ((mm = body.match(/^add\s+(?:column\s+)?(?!primary|foreign|constraint|index|key|unique)([\s\S]+)$/i))) {
      const c = parseColumnDef(mm[1]); if (c) place(c);
    } else if ((mm = body.match(/^drop\s+(?:column\s+)?(?!primary|foreign|index|key)(`[^`]+`|\w+)\s*$/i))) {
      const i = idx(mm[1]); if (i >= 0) cols.splice(i, 1);
    } else if ((mm = body.match(/^change\s+(?:column\s+)?(`[^`]+`|\w+)\s+([\s\S]+)$/i))) {
      const i = idx(mm[1]); const c = parseColumnDef(mm[2]);
      if (i >= 0 && c) { cols.splice(i, 1); if (pos) place(c); else cols.splice(i, 0, c); }
    } else if ((mm = body.match(/^modify\s+(?:column\s+)?([\s\S]+)$/i))) {
      const c = parseColumnDef(mm[1]); const i = c ? idx(c.name) : -1;
      if (i >= 0) { cols.splice(i, 1); if (pos) place(c); else cols.splice(i, 0, c); }
    } else if ((mm = body.match(/^rename\s+column\s+(`[^`]+`|\w+)\s+to\s+(`[^`]+`|\w+)/i))) {
      const i = idx(mm[1]); if (i >= 0) cols[i] = { ...cols[i], name: unq(mm[2]) };
    }
  }
  out[tkey] = cols;
  return out;
}

export function schemaOf(db) {
  const out = {};
  for (const t of listTables(db)) out[t] = tableInfo(db, t);
  return out;
}

// ---------- uzytkownicy (CREATE USER / GRANT) ----------

function parseAccount(s) {
  const m = s.trim().match(/^(`[^`]*`|'[^']*'|"[^"]*"|[\w.$-]+)(?:\s*@\s*(`[^`]*`|'[^']*'|"[^"]*"|[\w.%-]+))?/);
  if (!m) return null;
  return { user: unq(m[1]), host: m[2] ? unq(m[2]).toLowerCase() : '%' };
}

export function parseUserStatement(sql) {
  const s = sql.trim().replace(/;+\s*$/, '');
  let m;
  if ((m = s.match(/^create\s+user\s+(?:if\s+not\s+exists\s+)?([\s\S]+?)(?:\s+identified\s+by\s+(?:password\s+)?('(?:[^']|'')*'|"[^"]*"))?\s*$/i))) {
    const acc = parseAccount(m[1]);
    return { type: 'create', ...acc, password: m[2] ? unq(m[2]) : null };
  }
  if ((m = s.match(/^grant\s+([\s\S]+?)\s+on\s+(?:table\s+)?([\w`*.]+)\s+to\s+([\s\S]+?)(?:\s+identified\s+by\s+('(?:[^']|'')*'|"[^"]*"))?(\s+with\s+grant\s+option)?\s*$/i))) {
    const privs = splitTop(m[1]).map((p) => p.toLowerCase().replace(/\s+/g, ' ').replace(/^all privileges$/, 'all'));
    const [dbp, tp] = m[2].replace(/`/g, '').split('.');
    return { type: 'grant', privileges: [...new Set(privs)].sort(), db: (dbp || '').toLowerCase(), table: (tp ?? '*').toLowerCase(), ...parseAccount(m[3]), grantOption: !!m[5] };
  }
  return { type: 'unknown', text: s.toLowerCase().replace(/\s+/g, ' ') };
}

// ---------- ocena ----------

const num = (v) => (typeof v === 'number' ? v : (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim()) ? Number(v) : null));

export function normCell(v) {
  if (v == null) return null;
  const n = num(v);
  if (n != null) return Math.round(n * 1e4) / 1e4;
  return String(v).trim();
}

const rowKey = (r) => JSON.stringify(r.map(normCell));

function multisetDiff(exp, act) {
  const count = new Map();
  for (const r of exp) count.set(rowKey(r), (count.get(rowKey(r)) || 0) + 1);
  const extra = [];
  for (const r of act) {
    const k = rowKey(r);
    if (count.get(k)) count.set(k, count.get(k) - 1);
    else extra.push(r);
  }
  const missing = [];
  for (const r of exp) {
    const k = rowKey(r);
    if (count.get(k) > 0) { missing.push(r); count.set(k, count.get(k) - 1); }
  }
  return { missing, extra };
}

function orderByClause(sql) {
  const m = sql.replace(/\s+/g, ' ').match(/\border by (.*?)(?: limit .*)?$/i);
  if (!m) return null;
  return m[1].toLowerCase().replace(/`/g, '').replace(/\b\w+\./g, '').replace(/\s+asc\b/g, '').replace(/\s+/g, ' ').trim();
}

// porownanie kolumn: nazwy sprawdzamy tylko tam, gdzie wzorzec ma zwykly identyfikator (alias lub kolumna)
function columnLabelIssues(expCols, actCols) {
  const issues = [];
  expCols.forEach((c, i) => {
    const a = actCols[i];
    if (a == null || !/^[\p{L}_][\p{L}\p{N}_]*$/u.test(c)) return;
    const strip = (x) => String(x).toLowerCase().replace(/^.*\./, '').replace(/`/g, '');
    if (strip(a) !== strip(c)) issues.push(`kolumna ${i + 1} powinna nazywać się „${c}”, a nazywa się „${a}”`);
  });
  return issues;
}

export function compareSelect(expected, actual, { ordered, refSql, userSql }) {
  const reasons = [];
  const exp = expected.rows, act = actual.values;
  if (actual.columns.length !== expected.columns.length) {
    reasons.push(`Wynik ma ${actual.columns.length} kolumn, a powinien mieć ${expected.columns.length} (${expected.columns.join(', ')}). Sprawdź, czy wybierasz „jedynie” pola z treści.`);
    return { ok: false, reasons };
  }
  const { missing, extra } = multisetDiff(exp, act);
  if (missing.length || extra.length) {
    if (act.length !== exp.length) reasons.push(`Wynik ma ${act.length} wierszy, a powinien mieć ${exp.length}.`);
    else reasons.push('Liczba wierszy się zgadza, ale wartości są inne niż w poprawnym wyniku.');
    if (missing.length) reasons.push(`Brakuje np. wiersza: ${missing[0].map((v) => (v == null ? 'NULL' : v)).join(' | ')}`);
    if (extra.length) reasons.push(`Nadmiarowy wiersz, np.: ${extra[0].map((v) => (v == null ? 'NULL' : v)).join(' | ')}`);
    return { ok: false, reasons };
  }
  if (ordered) {
    const same = exp.every((r, i) => rowKey(r) === rowKey(act[i]));
    if (!same) {
      const a = orderByClause(userSql), b = orderByClause(refSql);
      // SQLite inaczej sortuje polskie litery - wtedy wystarcza ta sama klauzula ORDER BY
      if (!(a && b && a === b)) {
        reasons.push(a ? 'Wiersze się zgadzają, ale kolejność jest inna. Sprawdź kolumnę i kierunek sortowania (ASC/DESC).' : 'Wiersze się zgadzają, ale brakuje sortowania (ORDER BY).');
        return { ok: false, reasons };
      }
    }
  }
  const labels = columnLabelIssues(expected.columns, actual.columns);
  if (labels.length) return { ok: false, reasons: labels.map((l) => `Wynik dobry, ale ${l}. Użyj aliasu AS.`) };
  return { ok: true, reasons: [] };
}

// kolumny, ktorym wzorcowa kwerenda nadaje wartosc losowa (RAND) - pomijane przy porownaniu
export function randomColumns(db, sql) {
  const cols = new Set();
  if (!/\brand\s*\(/i.test(sql)) return cols;
  let m;
  if ((m = sql.match(/^\s*insert\s+(?:ignore\s+)?into\s+(`[^`]+`|\w+)\s*(?:\(([^)]*)\))?\s*values\s*\(([\s\S]*)\)\s*$/i))) {
    const names = m[2] ? splitTop(m[2]).map(unq) : (tableInfo(db, unq(m[1])) || []).map((c) => c.name);
    splitTop(m[3]).forEach((v, i) => { if (/\brand\s*\(/i.test(v) && names[i]) cols.add(names[i].toLowerCase()); });
  } else if ((m = sql.match(/^\s*update\s+(?:`[^`]+`|\w+)\s+set\s+([\s\S]*?)(?:\s+where\s[\s\S]*)?$/i))) {
    for (const a of splitTop(m[1])) {
      const [lhs, rhs] = a.split(/=(.*)/s);
      if (rhs && /\brand\s*\(/i.test(rhs)) cols.add(unq(lhs.trim().replace(/^.*\./, '')).toLowerCase());
    }
  }
  return cols;
}

export function compareTable(expectedAfter, db, ignore = new Set()) {
  const reasons = [];
  if (!expectedAfter) return { ok: true, reasons };
  const info = tableInfo(db, expectedAfter.table);
  if (!info) return { ok: false, reasons: [`Tabela ${expectedAfter.table} nie istnieje.`] };
  const mask = info.map((c) => ignore.has(c.name.toLowerCase()));
  const strip = (rows) => rows.map((r) => r.map((v, i) => (mask[i] ? '*' : v)));
  const rows = strip(tableRows(db, expectedAfter.table));
  const { missing, extra } = multisetDiff(strip(expectedAfter.rows), rows);
  if (missing.length || extra.length) {
    if (rows.length !== expectedAfter.rows.length) reasons.push(`Tabela ${expectedAfter.table} ma ${rows.length} rekordów, a powinna mieć ${expectedAfter.rows.length}.`);
    else reasons.push(`Liczba rekordów w tabeli ${expectedAfter.table} się zgadza, ale dane są inne niż po poprawnej kwerendzie.`);
    if (missing.length) reasons.push(`Powinien być rekord: ${missing[0].map((v) => (v == null ? 'NULL' : v)).join(' | ')}`);
    if (extra.length) reasons.push(`Jest rekord, którego być nie powinno (lub z innymi wartościami): ${extra[0].map((v) => (v == null ? 'NULL' : v)).join(' | ')}`);
  }
  return { ok: !reasons.length, reasons };
}

export function compareSchema(expectedAfter, refSql, schemaAfter) {
  // expectedAfter: snapshot z MariaDB (albo null gdy tabela zostala usunieta)
  const reasons = [];
  const tname = targetTable(refSql);
  const key = Object.keys(schemaAfter).find((k) => k.toLowerCase() === (tname || '').toLowerCase());
  if (!expectedAfter) {
    if (key) reasons.push(`Tabela ${tname} nadal istnieje, a powinna zostać usunięta.`);
    return { ok: !reasons.length, reasons };
  }
  const cols = key ? schemaAfter[key] : null;
  if (!cols) return { ok: false, reasons: [`Brak tabeli ${expectedAfter.table}.`] };
  const names = cols.map((c) => c.name.toLowerCase());
  const expNames = expectedAfter.columns.map((c) => c.toLowerCase());
  const miss = expNames.filter((n) => !names.includes(n));
  const extra = names.filter((n) => !expNames.includes(n));
  if (miss.length) reasons.push(`Brakuje kolumny: ${miss.join(', ')}.`);
  if (extra.length) reasons.push(`Nadmiarowa lub źle nazwana kolumna: ${extra.join(', ')}.`);
  if (reasons.length) return { ok: false, reasons };
  if (names.join(',') !== expNames.join(',')) reasons.push(`Kolejność kolumn powinna być: ${expectedAfter.columns.join(', ')} (sprawdź AFTER/FIRST).`);
  // typy i ograniczenia dla kolumn dotknietych zmiana
  const touched = new Set((refSql.match(/(?:add|change|modify|drop)\s+(?:column\s+)?(`[^`]+`|\w+)(?:\s+(`[^`]+`|\w+))?/gi) || [])
    .flatMap((m) => m.split(/\s+/).slice(1).map((x) => unq(x).toLowerCase())));
  const isCreate = /^\s*create\s+table/i.test(refSql);
  expectedAfter.columns.forEach((name, i) => {
    if (!isCreate && !touched.has(name.toLowerCase())) return;
    const c = cols.find((x) => x.name.toLowerCase() === name.toLowerCase());
    const et = normType(expectedAfter.types[i]);
    if (c.type && et && c.type !== et) reasons.push(`Kolumna ${name}: typ ${c.type.toUpperCase()}, a powinien być ${et.toUpperCase()}.`);
    if (!isCreate || i > 0) {
      if (expectedAfter.nullable[i] === false && c.nullable) reasons.push(`Kolumna ${name} powinna mieć NOT NULL.`);
      const ed = expectedAfter.defaults[i];
      if (ed != null && String(c.default ?? '') !== String(ed)) reasons.push(`Kolumna ${name} powinna mieć wartość domyślną ${ed}.`);
    }
  });
  return { ok: !reasons.length, reasons };
}

export function compareUser(refStatements, userStatements) {
  const reasons = [];
  const ref = refStatements.map(parseUserStatement);
  const usr = userStatements.map(parseUserStatement);
  for (const r of ref) {
    const cands = usr.filter((u) => u.type === r.type);
    if (!cands.length) { reasons.push(r.type === 'create' ? 'Brakuje instrukcji CREATE USER.' : 'Brakuje instrukcji GRANT.'); continue; }
    const best = cands.find((u) => u.user === r.user) || cands[0];
    if (best.user !== r.user) reasons.push(`Nazwa użytkownika powinna być „${r.user}” (wielkość liter ma znaczenie).`);
    if (best.host !== r.host) reasons.push(`Host powinien być „${r.host}”${best.host === '%' ? ' (użyj zapisu \'nazwa\'@\'localhost\')' : ''}.`);
    if (r.type === 'create' && r.password != null && best.password !== r.password) reasons.push(best.password == null ? 'Brakuje hasła (IDENTIFIED BY).' : 'Hasło jest inne niż w treści.');
    if (r.type === 'grant') {
      if (best.privileges.join(',') !== r.privileges.join(',')) reasons.push(`Uprawnienia powinny być: ${r.privileges.join(', ').toUpperCase()}.`);
      if (best.db !== r.db || best.table !== r.table) reasons.push(`Uprawnienia powinny dotyczyć ${r.db}.${r.table}.`);
    }
  }
  return { ok: !reasons.length, reasons };
}

// ---------- przygotowanie stanu i ocena jednej kwerendy ----------

// stan bazy przed kwerenda n: wzorcowe kwerendy 1..n-1 juz wykonane
export function prepareState(db, sheet, n) {
  for (const q of sheet.queries) {
    if (q.n >= n) break;
    for (const st of q.statements) {
      try { for (const t of translate(st)) db.exec(t); } catch (e) { /* stan pomocniczy, bledy pomijamy */ }
    }
  }
}

function execAll(db, stmts, schemaRef) {
  let result = null, schema = schemaRef ? schemaOf(db) : null;
  for (const st of stmts) {
    const k = statementKind(st);
    if (schema && k === 'ddl') schema = applySchemaChange(schema, st);
    for (const t of translate(st)) {
      const res = db.exec(t);
      if (k === 'select') result = res[0] || { columns: [], values: [] };
    }
  }
  return { result, schema };
}

const viewName = (sql) => (sql.match(/\bview\s+(`[^`]+`|\w+)/i) || [])[1];

// RAND(): wynik losowy - sprawdzamy kolumny, liczbe wierszy i to, ze kazdy wiersz pochodzi z puli
function compareRandom(refDb, refSql, userSql, actual) {
  const reasons = [];
  if (!/\brand\s*\(/i.test(userSql)) reasons.push('Wiersze mają być wybierane losowo: użyj ORDER BY RAND().');
  const lim = refSql.match(/\blimit\s+(\d+)/i);
  const poolSql = refSql.replace(/\border\s+by\s+rand\s*\(\s*\)/i, '').replace(/\blimit\s+\d+(\s*,\s*\d+)?/i, '');
  const pool = execAll(refDb, [poolSql]).result;
  if (actual.columns.length !== pool.columns.length) {
    reasons.push(`Wynik ma ${actual.columns.length} kolumn, a powinien mieć ${pool.columns.length} (${pool.columns.join(', ')}).`);
    return { ok: false, reasons };
  }
  if (lim && actual.values.length !== Number(lim[1])) reasons.push(`Wynik ma ${actual.values.length} wierszy, a powinien mieć ${lim[1]} (LIMIT).`);
  const keys = new Set(pool.values.map(rowKey));
  const outside = actual.values.find((r) => !keys.has(rowKey(r)));
  if (outside) reasons.push(`Wiersz spoza zbioru, który spełnia warunki zadania: ${outside.join(' | ')}`);
  return { ok: !reasons.length, reasons };
}

// db: baza kursanta, refDb: identyczna baza dla wzorca (ten sam stan, ten sam silnik)
export function gradeQuery(db, refDb, sheet, q, userText) {
  const stmts = splitStatements(userText);
  if (!stmts.length) return { ok: false, reasons: ['Wpisz zapytanie SQL.'] };
  if (q.kind === 'user') return compareUser(q.statements, stmts);
  const kinds = stmts.map(statementKind);
  const last = stmts[stmts.length - 1];
  const refLast = q.statements[q.statements.length - 1];
  const firstWords = (sql, n) => sql.trim().split(/\s+/).slice(0, n).join(' ').toUpperCase();
  if (q.kind === 'select' && kinds[kinds.length - 1] !== 'select') return { ok: false, reasons: ['To zadanie wymaga zapytania SELECT.'] };
  if (q.kind === 'modify' && !kinds.includes('modify')) return { ok: false, reasons: [`To zadanie wymaga instrukcji ${firstWords(refLast, 1)}.`] };
  if (q.kind === 'ddl' && !kinds.includes('ddl')) return { ok: false, reasons: [`To zadanie wymaga instrukcji ${firstWords(refLast, 2)}.`] };
  if (q.kind === 'view' && !kinds.includes('view')) return { ok: false, reasons: ['To zadanie wymaga instrukcji CREATE VIEW.'] };

  let mine;
  try {
    mine = execAll(db, stmts, q.kind === 'ddl');
  } catch (e) {
    return { ok: false, error: String(e.message || e), reasons: [`Błąd SQL: ${String(e.message || e)}`] };
  }
  const ref = execAll(refDb, q.statements, q.kind === 'ddl');

  if (q.kind === 'select') {
    if (/\brand\s*\(/i.test(refLast)) return { ...compareRandom(refDb, refLast, last, mine.result), result: mine.result };
    const expected = { columns: ref.result.columns, rows: ref.result.values };
    return { ...compareSelect(expected, mine.result, { ordered: q.ordered, refSql: refLast, userSql: last }), result: mine.result, expected };
  }
  if (q.kind === 'view') {
    const name = viewName(refLast), userName = viewName(stmts[kinds.indexOf('view')]);
    if (unq(userName || '').toLowerCase() !== unq(name).toLowerCase()) return { ok: false, reasons: [`Widok powinien nazywać się „${unq(name)}”.`] };
    const exp = execAll(refDb, [`SELECT * FROM ${name}`]).result;
    const act = execAll(db, [`SELECT * FROM ${name}`]).result;
    return compareSelect({ columns: exp.columns, rows: exp.values }, act, { ordered: false, refSql: refLast, userSql: last });
  }
  if (q.kind === 'modify') {
    const table = targetTable(refLast);
    const exp = { table, rows: tableRows(refDb, table) };
    return compareTable(exp, db, randomColumns(refDb, refLast));
  }
  if (q.kind === 'ddl') return compareSchema(q.expected.after, refLast, mine.schema);
  return { ok: false, reasons: ['Nieobsługiwany rodzaj zadania.'] };
}

// podglad: wynik wzorcowej kwerendy w tym samym silniku (to, co kursant powinien zobaczyc)
export function referencePreview(refDb, q) {
  if (q.kind === 'user') return null;
  try {
    const { result } = execAll(refDb, q.statements, false);
    if (q.kind === 'select') return result;
    const table = q.kind === 'view' ? viewName(q.statements[q.statements.length - 1]) : targetTable(q.statements[q.statements.length - 1]);
    if (!table || (q.kind === 'ddl' && !listTables(refDb).includes(table))) return null;
    return execAll(refDb, [`SELECT * FROM ${table}`]).result;
  } catch (e) {
    return null;
  }
}
