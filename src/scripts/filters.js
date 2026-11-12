// Filter: Geschmack = eine Wahl, Eigenschaften = alle gewählten (UND), Kategorien = eine davon (ODER).
const bar = document.getElementById('filters');
const list = document.getElementById('list');
const items = [...list.children];
const status = document.getElementById('status');
const empty = document.getElementById('empty');
const dd = document.getElementById('kat');
const reset = document.getElementById('reset');
const split = (s) => (s ? s.split(',') : []);

const state = { geschmack: '', eigenschaften: new Set(), kategorien: new Set() };

function matches(li) {
  const { geschmack, eigenschaften, kategorien } = state;
  const own = split(li.dataset.eigenschaften);
  const cats = split(li.dataset.kategorien);
  return (
    (!geschmack || li.dataset.geschmack === geschmack) &&
    [...eigenschaften].every((e) => own.includes(e)) &&
    (!kategorien.size || cats.some((c) => kategorien.has(c)))
  );
}

// Jede zweite sichtbare Reihe wird um eine halbe Zelle versetzt (Wabenmuster).
function layoutRows() {
  let row = -1;
  let top = null;
  for (const li of items) {
    if (li.hidden) continue;
    if (top === null || Math.abs(li.offsetTop - top) > 2) { row++; top = li.offsetTop; }
    li.classList.toggle('row-odd', row % 2 === 1);
  }
}

function apply() {
  let shown = 0;
  for (const li of items) {
    li.hidden = !matches(li);
    if (!li.hidden) shown++;
  }
  empty.hidden = shown > 0;
  const filtered = state.geschmack || state.eigenschaften.size || state.kategorien.size;
  status.textContent = filtered ? `${shown} Rezept${shown === 1 ? '' : 'e'} gefunden` : '';
  if (dd) dd.querySelector('summary').firstChild.textContent = state.kategorien.size ? `Kategorie (${state.kategorien.size})` : 'Kategorie';
  layoutRows();
}

bar.hidden = false;
bar.addEventListener('click', (e) => {
  const b = e.target.closest('button.filter');
  if (!b) return;
  const group = b.parentElement.dataset.group;
  if (group === 'geschmack') {
    state.geschmack = b.dataset.value;
    for (const x of b.parentElement.children) x.setAttribute('aria-pressed', String(x === b));
  } else {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    on ? state.eigenschaften.add(b.dataset.value) : state.eigenschaften.delete(b.dataset.value);
  }
  apply();
});

dd?.addEventListener('change', (e) => {
  e.target.checked ? state.kategorien.add(e.target.value) : state.kategorien.delete(e.target.value);
  apply();
});
dd?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { dd.open = false; dd.querySelector('summary').focus(); } });
document.addEventListener('click', (e) => { if (dd && !dd.contains(e.target)) dd.open = false; });

reset?.addEventListener('click', () => {
  state.geschmack = '';
  state.eigenschaften.clear();
  state.kategorien.clear();
  for (const b of bar.querySelectorAll('button.filter')) b.setAttribute('aria-pressed', String(b.dataset.value === '' && b.parentElement.dataset.group === 'geschmack'));
  for (const c of bar.querySelectorAll('input[type=checkbox]')) c.checked = false;
  apply();
});

let timer;
window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(layoutRows, 100); });
layoutRows();
