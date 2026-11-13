import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import tags from './data/tags.json';

const manuell = tags.eigenschaften.filter((t) => !t.automatisch).map((t) => t.slug) as [string, ...string[]];
const geschmack = tags.geschmack.map((t) => t.slug) as [string, ...string[]];

// Der Text unter dem Frontmatter ist Cooklang.
const recipes = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/recipes' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      geschmack: z.enum(geschmack),
      eigenschaften: z.array(z.enum(manuell)).default([]),
      // Pages CMS speichert den Titel der Kategorie; loadRecipes ordnet ihn dem Kategorie-Eintrag zu.
      kategorien: z.array(z.string()).default([]),
      // Kurzbezeichnung je Zubereitungsschritt für die "Rezeptkarte" (z. B. schmelzen, mischen, backen).
      kompakt: z.array(z.string()).default([]),
      gesamtzeit: z.number().int().positive(),
      aktivzeit: z.number().int().positive().optional(),
      portionen: z.number().int().positive(),
      bild: z.object({ datei: image(), alt: z.string().min(1) }).optional(),
      quellen: z.array(z.string()).default([]),
    }),
});

// Blogbeiträge (Wissenswertes). Das Datum dient nur der Sortierung und wird nicht angezeigt.
const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/posts' }),
  schema: z.object({
    title: z.string().min(1),
    teaser: z.string().min(1),
    kategorie: z.string().optional(),
    datum: z.coerce.date(),
    quellen: z.array(z.string()).default([]),
  }),
});

// Quellen; Beiträge und Rezepte nennen sie über den Titel. Nummeriert wird in der Reihenfolge der Nennung.
const quellen = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/quellen' }),
  schema: z.object({
    title: z.string().min(1),
    autor: z.string().optional(),
    jahr: z.number().int().optional(),
    link: z.url().optional(),
  }),
});

// Einzelseiten mit Fließtext (derzeit: About).
const seiten = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/seiten' }),
  schema: z.object({ title: z.string().min(1) }),
});

const categories = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/categories' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      kurztext: z.string().default(''),
      bild: z.object({ datei: image(), alt: z.string().min(1) }).optional(),
    }),
});

export const collections = { recipes, categories, posts, quellen, seiten };
