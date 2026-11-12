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
      gesamtzeit: z.number().int().positive(),
      aktivzeit: z.number().int().positive().optional(),
      portionen: z.number().int().positive(),
      bild: z.object({ datei: image(), alt: z.string().min(1) }).optional(),
    }),
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

export const collections = { recipes, categories };
