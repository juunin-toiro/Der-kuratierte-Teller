export const url = (p: string = '/'): string => import.meta.env.BASE_URL.replace(/\/$/, '') + p;
