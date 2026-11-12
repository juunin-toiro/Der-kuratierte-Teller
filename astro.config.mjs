// SITE und BASE kommen im GitHub-Workflow aus der Umgebung. Lokal gilt "/".
export default {
  site: process.env.SITE || undefined,
  base: process.env.BASE || '/',
};
