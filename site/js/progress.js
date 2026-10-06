// Postep kursanta w localStorage (tylko ta przegladarka). Eksport/import do pliku JSON.
const KEY = 'inf03-trener-v1';

function empty() {
  return { done: {}, tries: {}, drafts: {}, lessons: {}, results: {}, started: Date.now() };
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty(), ...JSON.parse(raw) } : empty();
  } catch (e) {
    return empty();
  }
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* tryb prywatny lub brak miejsca */ }
}

export const sqlKey = (code, n) => `sql:${code}:${n}`;
export const cwKey = (lesson, i) => `cw:${lesson}:${i}`;
export const webKey = (code) => `web:${code}`;

// najlepszy wynik pelnego arkusza (pass/auto)
export function getResult(key) { return state.results[key]; }

export function setResult(key, r) {
  const prev = state.results[key];
  if (!prev || r.pass > prev.pass || (r.pass === prev.pass && r.auto !== prev.auto)) state.results[key] = { ...r, at: Date.now() };
  if (r.auto && r.pass === r.auto) markDone(key);
  save();
}

export function isDone(key) { return !!state.done[key]; }

export function markDone(key) {
  if (!state.done[key]) state.done[key] = { at: Date.now(), tries: (state.tries[key] || 0) };
  save();
}

export function addTry(key) {
  state.tries[key] = (state.tries[key] || 0) + 1;
  save();
}

export function tries(key) { return state.tries[key] || 0; }

export function getDraft(key) { return state.drafts[key]; }

export function setDraft(key, text) {
  if (text && text.trim()) state.drafts[key] = text;
  else delete state.drafts[key];
  save();
}

export function lessonSeen(id) { return !!state.lessons[id]; }

export function markLesson(id) {
  state.lessons[id] = Date.now();
  save();
}

export function doneCount(prefix) {
  return Object.keys(state.done).filter((k) => k.startsWith(prefix)).length;
}

export function exportJson() {
  return JSON.stringify({ app: 'inf03-trener', version: 1, exported: new Date().toISOString(), state }, null, 2);
}

export function importJson(text) {
  const data = JSON.parse(text);
  if (data.app !== 'inf03-trener' || !data.state) throw new Error('To nie jest plik postępu Trenera INF.03.');
  const s = data.state;
  // laczymy: nic nie ginie z obecnego postepu
  state = {
    ...state,
    done: { ...s.done, ...state.done },
    tries: { ...s.tries, ...state.tries },
    drafts: { ...s.drafts, ...state.drafts },
    lessons: { ...s.lessons, ...state.lessons },
    results: { ...(s.results || {}), ...state.results },
  };
  save();
}

export function reset() {
  state = empty();
  save();
}
