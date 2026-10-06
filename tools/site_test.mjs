// Sprawdza silnik kwerend strony: kazda wzorcowa kwerenda (MySQL) przetlumaczona na SQLite
// musi dac ten sam wynik co MariaDB (site/data/<kod>/sheet.json), a celowo zla - zostac odrzucona.
// Uruchom: node tools/site_test.mjs [kod ...]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import * as eng from '../site/js/sqlengine.js';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA = path.join(ROOT, 'site', 'data');
const require = createRequire(import.meta.url);
const initSqlJs = require(path.join(ROOT, 'site', 'vendor', 'sqljs', 'sql-wasm.js'));
const SQL = await initSqlJs({ locateFile: (f) => path.join(ROOT, 'site', 'vendor', 'sqljs', f) });

const codes = process.argv.slice(2).length ? process.argv.slice(2)
  : JSON.parse(fs.readFileSync(path.join(DATA, 'index.json'), 'utf8')).sheets.map((s) => s.code);

// psuje kwerende tak, zeby wynik byl inny (test, ze ocena nie przepuszcza wszystkiego)
function breakQuery(q) {
  const last = q.statements[q.statements.length - 1];
  if (q.kind === 'select') {
    if (/\bwhere\b/i.test(last)) return [last.replace(/\bwhere\b/i, 'WHERE 1=0 AND')];
    return [`${last.replace(/\b(order\s+by|limit|group\s+by)\b[\s\S]*$/i, '')} LIMIT 0`];
  }
  if (q.kind === 'modify') return ['SELECT 1'];
  if (q.kind === 'ddl') {
    if (/^\s*create\s+table/i.test(last)) return [last.replace(/\(\s*(\w+)/, '($1_zle')];
    if (/^\s*drop\s+table/i.test(last)) return ['SELECT 1'];
    return [last.replace(/\b(add|drop|change|modify)\s+(column\s+)?(\w+)/i, '$1 $2$3_zle')];
  }
  if (q.kind === 'view') return [last.replace(/\bwhere\b/i, 'WHERE 1=0 AND')];
  return q.statements.map((s) => s.replace(/'([^']+)'@/, "'$1x'@"));
}

// rownowazny zapis, jak napisalby go uczen: male litery, INNER JOIN, bez ASC, nazwy w `
function variant(q) {
  return q.statements.map((st) => {
    let v = st.replace(/\b(SELECT|FROM|WHERE|ORDER BY|GROUP BY|JOIN|ON|AND|OR|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM|LIMIT|AS|DESC)\b/g, (m) => m.toLowerCase());
    v = v.replace(/(?<!inner |left |right )\bjoin\b/gi, 'inner join').replace(/\s+asc\b/gi, '');
    if (q.kind === 'select') v = v.replace(/^select\s+(\w+)\s*,/i, 'select `$1`,');
    return v;
  }).join(';\n');
}

let ok = 0, bad = 0, wrongAccepted = 0, same = 0, differ = 0;
const fidelity = [];
const norm = (rows) => rows.map((r) => JSON.stringify(r.map(eng.normCell))).sort().join('\n');
const problems = [];
for (const code of codes) {
  const dir = path.join(DATA, code);
  const sheet = JSON.parse(fs.readFileSync(path.join(dir, 'sheet.json'), 'utf8'));
  if (!sheet.queries.length) continue;
  const bytes = fs.readFileSync(path.join(dir, 'db.sqlite'));
  const open = (n) => {
    const db = new SQL.Database(new Uint8Array(bytes));
    eng.registerFunctions(db);
    eng.prepareState(db, sheet, n);
    return db;
  };
  for (const q of sheet.queries) {
    // wiernosc tlumaczenia: wynik wzorca w SQLite vs MariaDB (informacyjnie)
    if ((q.kind === 'select' || q.kind === 'view') && !/rand\s*\(/i.test(q.sql)) {
      const db = open(q.n);
      const prev = eng.referencePreview(db, q);
      db.close();
      if (prev && norm(prev.values) === norm(q.expected.rows)) same++;
      else { differ++; fidelity.push(`${code} #${q.n}: ${q.sql.replace(/\s+/g, ' ').slice(0, 120)}`); }
    }
    for (const [label, text, want] of [['wzorzec', q.statements.join(';\n'), true], ['wariant', variant(q), true], ['zepsuta', breakQuery(q).join(';\n'), false]]) {
      const db = open(q.n);
      const refDb = new SQL.Database(db.export());
      eng.registerFunctions(refDb);
      eng.registerFunctions(db); // export() w sql.js gubi zarejestrowane funkcje
      let r;
      try { r = eng.gradeQuery(db, refDb, sheet, q, text); } catch (e) { r = { ok: false, reasons: [`wyjatek: ${e.message}`] }; }
      db.close();
      refDb.close();
      if (want) {
        if (r.ok) ok++;
        else { bad++; problems.push(`${code} #${q.n} [${q.kind}] ${label}: ${r.reasons.join(' / ')}\n    ${q.sql.replace(/\s+/g, ' ').slice(0, 160)}`); }
      } else if (r.ok) {
        wrongAccepted++;
        problems.push(`${code} #${q.n} [${q.kind}] zepsuta kwerenda PRZESZLA: ${text.replace(/\s+/g, ' ').slice(0, 160)}`);
      }
    }
  }
}
for (const p of problems) console.log(p);
if (process.env.FIDELITY) for (const f of fidelity) console.log('roznica SQLite/MariaDB:', f);
console.log(`wiernosc tlumaczenia (SELECT): zgodne ${same}, rozne ${differ}`);
console.log(`wzorce zaliczone: ${ok}, odrzucone: ${bad}, zepsute przepuszczone: ${wrongAccepted}`);
process.exit(bad || wrongAccepted ? 1 : 0);
