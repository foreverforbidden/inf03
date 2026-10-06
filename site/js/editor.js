// Edytor kodu: CodeMirror 5 (z vendor/), a gdy go nie ma - zwykle pole tekstowe.
export function createEditor(parent, { value = '', mode = 'text/x-mysql', onRun, onCheck, onChange } = {}) {
  const CM = window.CodeMirror;
  if (CM) {
    const cm = CM(parent, {
      value,
      mode,
      lineNumbers: true,
      lineWrapping: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      styleActiveLine: true,
      indentUnit: 2,
      tabSize: 2,
      viewportMargin: Infinity,
      extraKeys: {
        'Ctrl-Enter': () => onRun && onRun(),
        'Cmd-Enter': () => onRun && onRun(),
        'Shift-Enter': () => onCheck && onCheck(),
        Tab: (c) => c.replaceSelection('  '),
      },
    });
    if (onChange) cm.on('change', () => onChange(cm.getValue()));
    return {
      get value() { return cm.getValue(); },
      set value(v) { cm.setValue(v); },
      focus() { cm.focus(); cm.setCursor(cm.lineCount(), 0); },
      refresh() { cm.refresh(); },
    };
  }
  const ta = document.createElement('textarea');
  ta.className = 'fallback';
  ta.value = value;
  ta.spellcheck = false;
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (onRun) onRun(); }
    if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); if (onCheck) onCheck(); }
  });
  if (onChange) ta.addEventListener('input', () => onChange(ta.value));
  parent.appendChild(ta);
  return {
    get value() { return ta.value; },
    set value(v) { ta.value = v; },
    focus() { ta.focus(); },
    refresh() {},
  };
}
