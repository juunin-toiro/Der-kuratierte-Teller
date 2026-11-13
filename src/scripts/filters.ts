// Filter: Geschmack = eine Wahl, Eigenschaften = alle gewählten (UND), Kategorien = eine davon (ODER).
import { el } from './dom';
const bar = el('filters');
const list = el('list');
const items = [...list.children] as HTMLElement[];
const statusEl = el('status');
const empty = el('empty');
const dd = document.getElementById('kat') as HTMLDetailsElement | null;
const reset = document.getElementById('reset');
const split = (s?: string) => (s ? s.split(',') : []);

const state = { geschmack: '', eigenschaften: new Set<string>(), kategorien: new Set<string>() };

function matches(li: HTMLElement): boolean {
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
function layoutRows(): void {
  let row = -1;
  let top: number | null = null;
  for (const li of items) {
    if (li.hidden) continue;
    if (top === null || Math.abs(li.offsetTop - top) > 2) { row++; top = li.offsetTop; }
    li.classList.toggle('row-odd', row % 2 === 1);
  }
}

function apply(): void {
  let shown = 0;
  for (const li of items) {
    li.hidden = !matches(li);
    if (!li.hidden) shown++;
  }
  empty.hidden = shown > 0;
  const filtered = state.geschmack || state.eigenschaften.size || state.kategorien.size;
  statusEl.textContent = filtered ? `${shown} Rezept${shown === 1 ? '' : 'e'} gefunden` : '';
  const summary = dd?.querySelector('summary');
  if (summary?.firstChild) summary.firstChild.textContent = state.kategorien.size ? `Kategorie (${state.kategorien.size})` : 'Kategorie';
  layoutRows();
}

bar.hidden = false;
bar.addEventListener('click', (e) => {
  const b = (e.target as HTMLElement).closest<HTMLButtonElement>('button.filter');
  if (!b) return;
  const group = b.parentElement!.dataset.group;
  const value = b.dataset.value ?? '';
  if (group === 'geschmack') {
    state.geschmack = value;
    for (const x of b.parentElement!.children) x.setAttribute('aria-pressed', String(x === b));
  } else {
    const on = b.getAttribute('aria-pressed') !== 'true';
    b.setAttribute('aria-pressed', String(on));
    if (on) state.eigenschaften.add(value); else state.eigenschaften.delete(value);
  }
  apply();
});

dd?.addEventListener('change', (e) => {
  const box = e.target as HTMLInputElement;
  if (box.checked) state.kategorien.add(box.value); else state.kategorien.delete(box.value);
  apply();
});
dd?.addEventListener('keydown', (e) => { if (e.key === 'Escape') { dd.open = false; dd.querySelector('summary')?.focus(); } });
document.addEventListener('click', (e) => { if (dd && !dd.contains(e.target as Node)) dd.open = false; });

reset?.addEventListener('click', () => {
  state.geschmack = '';
  state.eigenschaften.clear();
  state.kategorien.clear();
  for (const b of bar.querySelectorAll<HTMLButtonElement>('button.filter')) b.setAttribute('aria-pressed', String(b.dataset.value === '' && b.parentElement!.dataset.group === 'geschmack'));
  for (const c of bar.querySelectorAll<HTMLInputElement>('input[type=checkbox]')) c.checked = false;
  apply();
});

let timer: ReturnType<typeof setTimeout>;
window.addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(layoutRows, 100); });
layoutRows();
