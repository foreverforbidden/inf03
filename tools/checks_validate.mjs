// Walidacja site/data/<kod>/checks.json: rozwiazanie wzorcowe musi zaliczyc 100% kryteriow automatycznych,
// a puste pliki tylko niewielka czesc. Wynik do site/data/<kod>/checks_report.json i na ekran.
// Wymaga serwera: python3 -m http.server 8765 -d site
// Uruchom: NODE_PATH=$(npm root -g) node tools/checks_validate.mjs [kod ...]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DATA = path.join(ROOT, 'site', 'data');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/';
const VALID_TYPES = new Set(['head', 'exists', 'text', 'attr', 'css', 'cssRule', 'hover', 'layout', 'js', 'file', 'image', 'php', 'manual']);

let codes = process.argv.slice(2);
if (!codes.length) codes = fs.readdirSync(DATA).filter((c) => fs.existsSync(path.join(DATA, c, 'checks.json'))).sort();

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(BASE);
await page.waitForFunction(() => window.inf03 && window.inf03.runChecks);

let okCount = 0;
for (const code of codes) {
  const file = path.join(DATA, code, 'checks.json');
  const problems = [];
  let checks;
  try {
    checks = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(checks)) throw new Error('to nie jest tablica');
  } catch (e) {
    console.log(`FAIL ${code}: niepoprawny JSON: ${e.message}`);
    continue;
  }
  checks.forEach((c, i) => {
    if (!VALID_TYPES.has(c.type)) problems.push(`#${i} nieznany typ ${c.type}`);
    if (!c.desc) problems.push(`#${i} brak desc`);
    if (!c.section) problems.push(`#${i} brak section`);
  });
  const res = await page.evaluate(async ({ code, checks }) => {
    const sheet = await fetch(`data/${code}/sheet.json`).then((r) => r.json());
    const w = sheet.web;
    const codeFiles = w.solution.filter((f) => /\.(html?|css|js|php)$/i.test(f));
    const files = {};
    for (const f of codeFiles) files[f] = await fetch(`data/${code}/solution/${encodeURIComponent(f)}`).then((r) => r.text());
    for (const f of w.files) if (!(f in files)) files[f] = '';
    const uploads = {};
    for (const f of w.solution.filter((x) => !codeFiles.includes(x))) uploads[f] = `data/${code}/solution/${encodeURIComponent(f)}`;
    const base = `data/${code}/assets/`;
    const sol = await window.inf03.runChecks(checks, { files, assetsBase: base, uploads }, w.entry);
    const empty = Object.fromEntries(w.files.map((f) => [f, '']));
    const blank = await window.inf03.runChecks(checks, { files: empty, assetsBase: base, uploads: {} }, w.entry);
    return { sol, blank };
  }, { code, checks });
  const auto = checks.map((c, i) => i).filter((i) => res.sol[i].status !== 'manual');
  const solFails = auto.filter((i) => res.sol[i].status !== 'pass');
  const blankPass = auto.filter((i) => res.blank[i].status === 'pass' && checks[i].type !== 'file');
  const nonFileAuto = auto.filter((i) => checks[i].type !== 'file');
  for (const i of solFails) problems.push(`wzorzec nie spełnia #${i} „${checks[i].desc}”: ${res.sol[i].msg}`);
  if (nonFileAuto.length && blankPass.length / nonFileAuto.length > 0.15) {
    problems.push(`puste pliki zaliczają ${blankPass.length}/${nonFileAuto.length} kryteriów: ${blankPass.map((i) => `#${i}`).join(', ')}`);
  }
  if (auto.length < 15) problems.push(`mało kryteriów automatycznych (${auto.length})`);
  const report = {
    code,
    ok: problems.length === 0,
    total: checks.length,
    auto: auto.length,
    manual: checks.length - auto.length,
    problems,
  };
  fs.writeFileSync(path.join(DATA, code, 'checks_report.json'), JSON.stringify(report, null, 2));
  if (report.ok) okCount++;
  console.log(`${report.ok ? 'OK  ' : 'FAIL'} ${code} kryteria ${report.auto} auto + ${report.manual} ręczne${problems.length ? `\n     ${problems.join('\n     ')}` : ''}`);
}
console.log(`${okCount}/${codes.length} arkuszy z poprawną listą kryteriów`);
await browser.close();
process.exit(okCount === codes.length ? 0 : 1);
