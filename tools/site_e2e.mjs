// Test strony w przegladarce (Playwright + Chromium). Wymaga serwera: python3 -m http.server 8765 -d site
// Uruchom: NODE_PATH=$(npm root -g) node tools/site_e2e.mjs [katalog_na_zrzuty]
import fs from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/';
const shots = process.argv[2];
const sheetOf = (code) => JSON.parse(fs.readFileSync(new URL(`../site/data/${code}/sheet.json`, import.meta.url), 'utf8'));

const browser = await chromium.launch();
const errors = [];
let failures = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'OK  ' : 'FAIL'} ${msg}`); if (!cond) failures++; };

async function page(viewport) {
  const ctx = await browser.newContext({ viewport });
  const p = await ctx.newPage();
  p.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  p.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  return p;
}

async function typeSql(p, sql) {
  await p.evaluate((v) => { document.querySelector('.CodeMirror').CodeMirror.setValue(v); }, sql);
}

const p = await page({ width: 1280, height: 900 });

// start
await p.goto(BASE);
await p.waitForSelector('h1');
ok((await p.textContent('h1')).includes('INF.03'), 'strona startowa');
if (shots) await p.screenshot({ path: `${shots}/home.png`, fullPage: true });

// lekcja i lista cwiczen
await p.goto(`${BASE}#/lekcja/sql-select`);
await p.waitForSelector('.ex-list a');
const exCount = await p.locator('.ex-list a').count();
ok(exCount > 20, `lekcja SELECT ma ćwiczenia (${exCount})`);
if (shots) await p.screenshot({ path: `${shots}/lekcja.png`, fullPage: true });

// cwiczenie: zla i dobra odpowiedz
const code = 'inf03_2025_06_06';
const sheet = sheetOf(code);
await p.goto(`${BASE}#/sql/${code}/1?z=sql-select`);
await p.waitForSelector('.CodeMirror');
await typeSql(p, 'SELECT * FROM ksiazka');
await p.click('#check');
await p.waitForSelector('.verdict');
ok(await p.locator('.verdict.bad').count() === 1, 'zła odpowiedź odrzucona');
ok((await p.textContent('.verdict')).includes('kolumn'), 'komunikat o liczbie kolumn');
await typeSql(p, sheet.queries[0].sql);
await p.click('#run');
await p.waitForSelector('#out table.data');
ok(await p.locator('#out table.data tr').count() > 1, 'Uruchom pokazuje wynik');
await p.click('#check');
await p.waitForSelector('.verdict.ok');
ok(true, 'dobra odpowiedź przyjęta');
if (shots) await p.screenshot({ path: `${shots}/cwiczenie.png`, fullPage: true });

// podpowiedzi i oczekiwany wynik
await p.click('#hint'); await p.click('#hint');
ok((await p.textContent('#hints')).includes('___'), 'szkielet w podpowiedzi');
await p.click('#expected');
await p.waitForSelector('#hints table.data');
ok(true, 'oczekiwany wynik');

// podglad tabeli w schemacie
await p.click('.schema details summary');
await p.waitForSelector('.schema .rows table.data');
ok(true, 'podgląd danych tabeli');

// postep po przeladowaniu
await p.goto(`${BASE}#/lekcje`);
await p.reload();
await p.waitForSelector('.path-step');
ok((await p.textContent('#app')).includes('1/'), 'postęp zapisany po przeładowaniu');

// struktura (ALTER) po wczesniejszych kwerendach, uzytkownicy, kwerenda z modyfikacja
await p.goto(`${BASE}#/sql/${code}/3`);
await p.waitForSelector('.CodeMirror');
await typeSql(p, 'ALTER TABLE ksiazka ADD rezerwacja INT;');
await p.click('#check');
await p.waitForSelector('.verdict');
ok(await p.locator('.verdict.bad').count() === 1, 'ALTER bez NOT NULL/DEFAULT/TINYINT odrzucony');
await typeSql(p, 'alter table ksiazka add column rezerwacja tinyint(1) not null default 0;');
await p.click('#check');
await p.waitForSelector('.verdict.ok');
ok(true, 'ALTER poprawny przyjęty');

await p.goto(`${BASE}#/sql/${code}/4`);
await p.waitForSelector('.CodeMirror');
await typeSql(p, 'UPDATE ksiazka SET rezerwacja = 1;');
await p.click('#check');
await p.waitForSelector('.verdict');
ok(await p.locator('.verdict.bad').count() === 1, 'UPDATE bez WHERE odrzucony');

await p.goto(`${BASE}#/sql/inf03_2024_06_09/4`);
await p.waitForSelector('.CodeMirror');
await typeSql(p, "CREATE USER 'Ewa'@'localhost' IDENTIFIED BY 'Ewa!Ewa';\nGRANT ALL ON wycieczki.* TO 'Ewa'@'localhost';");
await p.click('#check');
await p.waitForSelector('.verdict.ok');
ok(true, 'CREATE USER + GRANT ALL przyjęte');

// arkusze z filtrem
await p.goto(`${BASE}#/arkusze`);
await p.waitForSelector('.sheet-row');
const all = await p.locator('.sheet-row').count();
await p.fill('#f-q', 'biblioteka');
const filtered = await p.locator('.sheet-row').count();
ok(all === 79 && filtered > 0 && filtered < all, `lista arkuszy i filtr (${all} → ${filtered})`);

// mikrocwiczenie HTML: zla i dobra odpowiedz
await p.goto(`${BASE}#/cw/html-szkielet/0`);
await p.waitForSelector('.ws .CodeMirror');
await p.click('#check');
await p.waitForSelector('#verdict .verdict.bad');
ok(true, 'ćwiczenie HTML: pusty plik odrzucony');
await typeSql(p, '<!DOCTYPE html>\n<html lang="pl">\n<head>\n<meta charset="UTF-8">\n<title>Biblioteka miejska</title>\n<link rel="stylesheet" href="styl.css">\n</head>\n<body></body>\n</html>');
await p.click('#check');
await p.waitForSelector('#verdict .verdict.ok', { timeout: 20000 });
ok(true, 'ćwiczenie HTML: poprawny szkielet przyjęty');
if (shots) await p.screenshot({ path: `${shots}/cw-html.png`, fullPage: true });

// pelny arkusz: wzorzec wczytany do edytora daje komplet punktow
p.on('dialog', (d) => d.accept());
await p.goto(`${BASE}#/arkusz/inf03_2026_06_04/strona`);
await p.waitForSelector('.ws .CodeMirror');
await p.click('#sol');
await p.waitForSelector('#loadsol');
await p.click('#loadsol');
await p.waitForTimeout(500);
await p.click('#check');
await p.waitForFunction(() => /\d+\/\d+/.test(document.getElementById('score').textContent) && !document.getElementById('check').disabled, null, { timeout: 120000 });
const score = await p.textContent('#score');
const [got, max] = score.match(/(\d+)\/(\d+)/).slice(1).map(Number);
ok(got === max && max > 50, `arkusz 2026_06_04: wzorzec ${got}/${max}`);
if (shots) await p.screenshot({ path: `${shots}/arkusz-wynik.png`, fullPage: false });

// widok na telefonie
const m = await page({ width: 375, height: 800 });
await m.goto(`${BASE}#/sql/${code}/2`);
await m.waitForSelector('.CodeMirror');
const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
ok(overflow <= 0, `brak poziomego przewijania na 375 px (${overflow})`);
if (shots) await m.screenshot({ path: `${shots}/telefon.png`, fullPage: true });

ok(errors.length === 0, `brak błędów w konsoli${errors.length ? `: ${errors.join(' | ')}` : ''}`);
await browser.close();
process.exit(failures ? 1 : 0);
