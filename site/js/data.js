// Ladowanie danych arkuszy i baz SQLite (sql.js), z pamiecia podreczna.
import * as eng from './sqlengine.js';

let sqlPromise = null;
let indexPromise = null;
const sheets = new Map();
const dbBytes = new Map();

export function sqljs() {
  if (!sqlPromise) {
    // eslint-disable-next-line no-undef
    sqlPromise = initSqlJs({ locateFile: (f) => `vendor/sqljs/${f}` });
  }
  return sqlPromise;
}

async function json(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Nie udało się pobrać ${url} (${r.status})`);
  return r.json();
}

export function index() {
  if (!indexPromise) indexPromise = json('data/index.json');
  return indexPromise;
}

export async function sheet(code) {
  if (!sheets.has(code)) sheets.set(code, json(`data/${code}/sheet.json`));
  return sheets.get(code);
}

async function bytes(code) {
  if (!dbBytes.has(code)) {
    dbBytes.set(code, fetch(`data/${code}/db.sqlite`).then((r) => {
      if (!r.ok) throw new Error(`Brak bazy dla ${code}`);
      return r.arrayBuffer();
    }).then((b) => new Uint8Array(b)));
  }
  return dbBytes.get(code);
}

// baza w stanie sprzed kwerendy n (wzorcowe kwerendy 1..n-1 wykonane)
export async function openState(code, n) {
  const [SQL, sh, b] = await Promise.all([sqljs(), sheet(code), bytes(code)]);
  const db = new SQL.Database(new Uint8Array(b));
  eng.registerFunctions(db);
  eng.prepareState(db, sh, n);
  return db;
}

// para identycznych baz: dla kursanta i dla wzorca (ten sam stan, takze wartosci losowe)
export async function openPair(code, n) {
  const SQL = await sqljs();
  const db = await openState(code, n);
  const ref = new SQL.Database(db.export());
  eng.registerFunctions(ref);
  eng.registerFunctions(db); // export() w sql.js gubi zarejestrowane funkcje
  return { db, ref };
}
