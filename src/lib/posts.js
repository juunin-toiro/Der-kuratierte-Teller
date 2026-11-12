import { getCollection } from 'astro:content';

// Neueste zuerst; das Datum wird nur zum Sortieren genutzt.
export async function loadPosts() {
  const posts = await getCollection('posts');
  return posts
    .sort((a, b) => b.data.datum - a.data.datum)
    .map((p) => ({ slug: p.id, entry: p, ...p.data }));
}
