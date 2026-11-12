// Liefert Pfade mit dem Basis-Pfad der Seite (z.B. /Der-kuratierte-Teller bei GitHub Pages ohne eigene Domain).
export const url = (p = '/') => import.meta.env.BASE_URL.replace(/\/$/, '') + p;
