import { getCollection } from 'astro:content';
import { Recipe, type DecimalValue, type FractionValue, type Ingredient, type Timer } from '@tmlmt/cooklang-parser';
import tags from '../data/tags.json';

const nf = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 2 });
const one = (v: DecimalValue | FractionValue) => (v.type === 'decimal' ? nf.format(v.value) : `${v.num}/${v.den}`);

function amount(q?: Ingredient['quantity'] | Timer['duration']): string {
  if (!q) return '';
  if (q.type === 'range') return `${one(q.min)}–${one(q.max)}`;
  return q.value.type === 'text' ? q.value.value : one(q.value);
}

// Cooklang-Text -> Zutatenliste, Geräte und Schritte als Klartext.
function parseBody(body: string, id: string) {
  let r: Recipe;
  try {
    r = new Recipe(body);
  } catch (e) {
    throw new Error(`Rezept "${id}": Cooklang-Text nicht lesbar: ${(e as Error).message}`);
  }
  const ingredients = r.ingredients.map((i) => ({ name: i.name, amount: amount(i.quantity), unit: i.unit ?? '', note: i.preparation ?? '' }));
  const timer = (t: Timer) => `${amount(t.duration)} ${t.unit ?? ''}`.trim();
  const steps = r.sections.flatMap((s) => s.content).filter((c) => c.type === 'step').map((s) =>
    s.items.map((it) => {
      if (it.type === 'text') return it.value;
      if (it.type === 'ingredient') return it.displayName;
      if (it.type === 'cookware') return r.cookware[it.index].name;
      return timer(r.timers[it.index]);
    }).join('').trim(),
  );
  if (!ingredients.length) throw new Error(`Rezept "${id}": keine Zutat gefunden`);
  if (!steps.length) throw new Error(`Rezept "${id}": kein Schritt gefunden`);
  return { ingredients, cookware: r.cookware.map((c) => c.name), steps };
}

export async function loadRecipes() {
  const [entries, cats] = await Promise.all([getCollection('recipes'), getCollection('categories')]);
  const catTitle = Object.fromEntries(cats.map((c) => [c.id, c.data.title]));
  const slugify = (s: string) => s.toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
  const catBySlug = Object.fromEntries(cats.map((c) => [slugify(c.id), c.id]));
  return entries
    .map((e) => {
      const d = e.data;
      const eigenschaften = [...d.eigenschaften];
      if (d.gesamtzeit <= tags.schnellMaxMinuten) eigenschaften.push('schnell');
      const kategorien = d.kategorien.map((k) => {
        const id = catBySlug[slugify(k)];
        if (!id) throw new Error(`Rezept "${e.id}": Kategorie "${k}" gibt es nicht. Vorhanden: ${Object.values(catTitle).join(', ')}`);
        return { slug: id, title: catTitle[id] };
      });
      return {
        slug: e.id,
        ...d,
        eigenschaften,
        kategorien,
        ...parseBody(e.body ?? '', e.id),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title, 'de'));
}

export const tagBySlug = Object.fromEntries(tags.eigenschaften.map((t) => [t.slug, t]));
export const geschmackName = Object.fromEntries(tags.geschmack.map((t) => [t.slug, t.name]));
export { tags };
