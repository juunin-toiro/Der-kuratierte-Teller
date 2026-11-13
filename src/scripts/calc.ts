import { el } from './dom';
import { glStufe, zahl } from '../lib/gl';

// Glykämische Last der Portion = GL je 100 g * Gramm / 100. Eintrag: [Name, Synonyme, GL je 100 g, verfügbare Kohlenhydrate je 100 g]
type Food = [string, string[], number, number | null];
const foods: Food[] = JSON.parse(el('foods-data').textContent ?? '[]');
const nachName = new Map(foods.flatMap((f) => [f[0], ...f[1]].map((n) => [n.toLowerCase(), f] as const)));
const sel = el<HTMLInputElement>('food');
const grams = el<HTMLInputElement>('grams');
const out = el('result');
const needle = el('needle');
const strong = (t: string, className = '') => Object.assign(document.createElement('strong'), { textContent: t, className });

function calc() {
  const f = nachName.get(sel.value.trim().toLowerCase());
  const g = Number(grams.value);
  out.innerHTML = '';
  if (!f) { out.textContent = 'Bitte ein Lebensmittel aus der Liste wählen.'; return; }
  if (!(g > 0)) { out.textContent = 'Bitte eine Portion in Gramm eingeben.'; return; }
  const gl = (f[2] * g) / 100;
  const stufe = glStufe(gl);
  needle.style.transform = `rotate(${(Math.min(gl, 40) / 40) * 180 - 90}deg)`;
  out.append(strong(`${g}g ${f[0]}`), ' haben eine ', strong(`${stufe} glykämische Last von ${zahl(gl)}`, 'level'), '.');
  // Orientierungswert: Eiweiss 0,5 x und Fett 0,3 x die Kohlenhydratmenge der Portion; nur sinnvoll, wenn die Last nicht niedrig ist.
  if (stufe !== 'niedrige' && f[3]) {
    const kh = (f[3] * g) / 100;
    out.append(document.createElement('br'), 'Etwa ', strong(`${zahl(kh * 0.5)}g Protein`), ' und ', strong(`${zahl(kh * 0.3)}g Fett`), ' dazu können helfen, die Blutzuckerspitze abzuflachen (Orientierungswert).');
  }
}
sel.addEventListener('input', calc);
grams.addEventListener('input', calc);
calc();
