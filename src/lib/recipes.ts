import { getCollection } from 'astro:content';
import { Recipe, type DecimalValue, type FractionValue, type Ingredient, type Timer } from '@tmlmt/cooklang-parser';
import tags from '../data/tags.json';
import lebensmittel from '../data/lebensmittel.json';
import zutaten from '../data/zutaten.json';

const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 });
const one = (v: DecimalValue | FractionValue) => (v.type === 'decimal' ? nf.format(v.value) : `${v.num}/${v.den}`);

// 0 = bewusst ohne Nährwert, null = fehlt in der Datenbank, Zahl = Lebensmittel-ID, Objekt = ID plus Gramm pro Stück.
type Zuordnung = 0 | null | number | { id: number; stueck: number };
const zuordnung: Record<string, Zuordnung> = zutaten;
const foodById = new Map(lebensmittel.map((f) => [f.id, f]));
const val = (v: DecimalValue | FractionValue) => (v.type === 'decimal' ? v.value : v.num / v.den);

// Menge in Gramm: Zusatz "(≈ 10 g)" im Rezepttext hat Vorrang, dann g/kg/ml (1 ml = 1 g), sonst Gramm pro Stück aus zutaten.json. Bereiche zählen als Mittelwert.
function inGramm(i: Ingredient, gramm: string, stueck?: number): number | undefined {
  const q = i.quantity;
  const n = q?.type === 'range' ? (val(q.min) + val(q.max)) / 2 : q && q.value.type !== 'text' ? val(q.value) : NaN;
  if (gramm) {
    const w = (gramm.match(/[\d,–]+/)![0]).replace(',', '.').split('–').map(Number);
    return w.reduce((a, b) => a + b) / w.length;
  }
  const faktor = ({ g: 1, kg: 1000, ml: 1 } as Record<string, number>)[i.unit ?? ''] ?? (['EL', 'TL', 'Prise'].includes(i.unit ?? '') ? undefined : stueck);
  return faktor === undefined || Number.isNaN(n) ? undefined : n * faktor;
}

function amount(q?: Ingredient['quantity'] | Timer['duration']): string {
  if (!q) return '';
  if (q.type === 'range') return `${one(q.min)}–${one(q.max)}`;
  return q.value.type === 'text' ? q.value.value : one(q.value);
}

// Cooklang-Text -> Zutatenliste, Geräte und Schritte als Klartext.
function parseBody(body: string, id: string, labels: string[], portionen: number) {
  let r: Recipe;
  try {
    r = new Recipe(body);
  } catch (e) {
    throw new Error(`Rezept "${id}": Cooklang-Text nicht lesbar: ${(e as Error).message}`);
  }
  // Gramm-Angabe zu EL/TL/Prise steht im Rezepttext als Zusatz "(≈ 10 g)" und wird von der übrigen Notiz getrennt.
  const ingredients = r.ingredients.map((i) => {
    const prep = i.preparation ?? '';
    const gramm = prep.match(/≈\s*[\d,–]+\s*g/)?.[0] ?? '';
    return { name: i.name, amount: amount(i.quantity), unit: i.unit ?? '', gramm, note: prep.replace(gramm, '').replace(/^\s*,\s*|\s*,\s*$/g, '').trim() };
  });
  const menge = (i: (typeof ingredients)[number]) => [i.amount, i.unit].filter(Boolean).join(' ') + (i.gramm ? ` (${i.gramm})` : '');
  const timer = (t: Timer) => `${amount(t.duration)} ${t.unit ?? ''}`.trim();
  const stepItems = r.sections.flatMap((s) => s.content).filter((c) => c.type === 'step');
  // Zubereitung: Text in Teile (Zutat/Gerät/Zeit hervorgehoben) plus Mengenzeile je Schritt.
  const steps = stepItems.map((s) => ({
    teile: s.items.map((it) => {
      if (it.type === 'text') return { art: 'text', text: it.value };
      if (it.type === 'ingredient') return { art: 'zutat', text: it.displayName };
      if (it.type === 'cookware') return { art: 'geraet', text: r.cookware[it.index].name };
      return { art: 'zeit', text: timer(r.timers[it.index]) };
    }),
    mengen: [...new Set(s.items.flatMap((it) => (it.type === 'ingredient' ? [it.index] : [])))].map((k) => ({ name: ingredients[k].name, menge: menge(ingredients[k]) })),
  }));
  // Rezeptkarte: Zutaten in der Reihenfolge ihrer ersten Verwendung. Ein Schritt führt standardmässig alles Bisherige weiter (start 0..end); ein Kürzel mit "*" (z. B. "mischen*") startet einen eigenen Strang nur mit den neuen Zutaten.
  const order: number[] = [];
  const cols = stepItems.map((s, n) => {
    const before = order.length;
    for (const it of s.items) if (it.type === 'ingredient' && !order.includes(it.index)) order.push(it.index);
    const [label, ...extra] = (labels[n] ?? `${n + 1}.`).split('|');
    const eigen = label.endsWith('*') && order.length > before;
    // Hitze und Dauer stehen in der Karte unter dem Schrittnamen: Temperaturen aus dem Text ("180 °C"), Dauern aus den Cooklang-Timern. Zusätze nach "|" (z. B. "formen|Klumpen à 80–120 g|andrücken") ersetzen diese Automatik; "rösten|" zeigt nichts.
    const auto = [...(steps[n].teile.map((t) => t.text).join('').match(/\d+\s*°C/g) ?? []).map((t) => t.replace(/\s*°C/, ' °C')), ...s.items.flatMap((it) => (it.type === 'timer' ? [timer(r.timers[it.index])] : []))];
    const detail = extra.length ? extra.map((e) => e.trim()).filter(Boolean) : auto;
    return { label: label.replace(/\*$/, ''), detail, start: eigen ? before : 0, end: order.length - 1 };
  }).filter((c) => c.end >= 0);
  const rows = order.map((i) => ({ menge: menge(ingredients[i]), name: ingredients[i].name }));
  // Nährwerte und Glykämische Last pro Portion aus den verknüpften Lebensmitteln; Mengen ohne Zahl (Salz, "etwas") zählen nicht.
  const fehler: string[] = [];
  const ohne = new Set<string>();
  const summe = { kcal: 0, protein: 0, fett: 0, kh: 0, gl: 0 };
  r.ingredients.forEach((i, k) => {
    if (!i.quantity) return;
    const z = zuordnung[i.name];
    if (z === undefined) { fehler.push(`Rezept "${id}": Zutat "${i.name}" fehlt in src/data/zutaten.json`); return; }
    if (z === 0) return;
    if (z === null) { ohne.add(i.name); return; }
    const f = foodById.get(typeof z === 'number' ? z : z.id);
    if (!f) { fehler.push(`Rezept "${id}": Lebensmittel-ID zu "${i.name}" gibt es nicht`); return; }
    const g = inGramm(i, ingredients[k].gramm, typeof z === 'object' ? z.stueck : undefined);
    if (g === undefined) { fehler.push(`Rezept "${id}": Menge von "${i.name}" nicht in Gramm umrechenbar (Zusatz "(≈ … g)" ergänzen oder stueck in zutaten.json setzen)`); return; }
    for (const key of Object.keys(summe) as (keyof typeof summe)[]) {
      const w = f[key];
      if (w === null) fehler.push(`Rezept "${id}": "${f.name}" hat keinen Wert für ${key}`);
      else summe[key] += (w * g) / 100 / portionen;
    }
  });
  const naehrwerte = { ...Object.fromEntries(Object.entries(summe).map(([k, v]) => [k, Math.round(v * 10) / 10])) as typeof summe, ohne: [...ohne] };
  if (!ingredients.length) throw new Error(`Rezept "${id}": keine Zutat gefunden`);
  if (!steps.length) throw new Error(`Rezept "${id}": kein Schritt gefunden`);
  return { ingredients, cookware: r.cookware.map((c) => c.name), steps, compact: { rows, cols }, naehrwerte, fehler };
}

export async function loadRecipes() {
  const [entries, cats] = await Promise.all([getCollection('recipes'), getCollection('categories')]);
  const catTitle = Object.fromEntries(cats.map((c) => [c.id, c.data.title]));
  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
  const catBySlug = Object.fromEntries(cats.map((c) => [slugify(c.id), c.id]));
  const recipes = entries
    .map((e) => {
      const d = e.data;
      const eigenschaften = [...d.eigenschaften];
      if (d.gesamtzeit <= tags.schnellMaxMinuten) eigenschaften.push('schnell');
      // Kartenfarbe: schnell hat immer Vorrang, sonst die häufigste Filterfarbe (bei Gleichstand die zuerst genannte).
      const zaehler: Record<string, number> = {};
      for (const t of eigenschaften) zaehler[tagBySlug[t].farbe] = (zaehler[tagBySlug[t].farbe] ?? 0) + 1;
      const farbe = eigenschaften.includes('schnell') ? 'accent' : Object.keys(zaehler).sort((a, b) => zaehler[b] - zaehler[a])[0] ?? 'accent';
      const kategorien = d.kategorien.map((k) => {
        const id = catBySlug[slugify(k)];
        if (!id) throw new Error(`Rezept "${e.id}": Kategorie "${k}" gibt es nicht. Vorhanden: ${Object.values(catTitle).join(', ')}`);
        return { slug: id, title: catTitle[id] };
      });
      return {
        slug: e.id,
        ...d,
        eigenschaften,
        farbe,
        kategorien,
        ...parseBody(e.body ?? '', e.id, d.kompakt, d.portionen),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'de'));
  const fehler = recipes.flatMap((r) => r.fehler);
  if (fehler.length) throw new Error(`Nährwerte nicht berechenbar:\n- ${fehler.join('\n- ')}`);
  return recipes;
}

export const tagBySlug = Object.fromEntries(tags.eigenschaften.map((t) => [t.slug, t]));
export { tags };
