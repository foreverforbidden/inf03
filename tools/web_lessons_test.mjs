// Mikrocwiczenia HTML/CSS/JS: rozwiazanie wzorcowe musi zaliczyc 100% kryteriow, pliki startowe nie.
// Wymaga serwera: python3 -m http.server 8765 -d site
// Uruchom: NODE_PATH=$(npm root -g) node tools/web_lessons_test.mjs
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/';

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
// bledy z iframe z plikami startowymi (np. brak funkcji) sa oczekiwane; liczymy tylko bledy aplikacji
page.on('pageerror', (e) => { if (!/is not (defined|a function)/.test(e.message)) errors.push(e.message); });
await page.goto(BASE);
await page.waitForFunction(() => window.inf03 && window.inf03.WEB_LESSONS);

const report = await page.evaluate(async () => {
  const { runChecks, WEB_LESSONS } = window.inf03;
  const out = [];
  for (const [id, l] of Object.entries(WEB_LESSONS)) {
    for (let i = 0; i < l.exercises.length; i++) {
      const ex = l.exercises[i];
      const proj = (files) => ({ files, assetsBase: ex.assetsBase, uploads: {} });
      const sol = await runChecks(ex.checks, proj(ex.solution), ex.entry);
      const start = await runChecks(ex.checks, proj(ex.files), ex.entry);
      out.push({
        id: `${id}/${i}`,
        title: ex.title,
        solFails: sol.map((r, k) => (r.status === 'fail' ? `${ex.checks[k].desc}: ${r.msg}` : null)).filter(Boolean),
        startPass: start.filter((r) => r.status === 'pass').length,
        total: ex.checks.length,
      });
    }
  }
  return out;
});

let bad = 0;
for (const r of report) {
  const okSol = r.solFails.length === 0;
  const okStart = r.startPass < r.total;
  if (!okSol || !okStart) bad++;
  console.log(`${okSol && okStart ? 'OK  ' : 'FAIL'} ${r.id} ${r.title}${okSol ? '' : `\n     wzorzec nie przechodzi: ${r.solFails.join(' | ')}`}${okStart ? '' : '\n     pliki startowe zaliczają wszystko'}`);
}
if (errors.length) { console.log('błędy strony:', errors.join(' | ')); bad++; }
console.log(`${report.length - bad}/${report.length} ćwiczeń poprawnych`);
await browser.close();
process.exit(bad ? 1 : 0);
