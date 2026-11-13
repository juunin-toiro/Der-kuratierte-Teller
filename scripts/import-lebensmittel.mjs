// Liest das Blatt "Lebensmittel" aus der Datenbasis-Excel und schreibt src/data/lebensmittel.json.
// Aufruf: node scripts/import-lebensmittel.mjs <pfad/zur/datei.xlsx>
import fs from 'node:fs';
import zlib from 'node:zlib';

const file = process.argv[2];
if (!file) throw new Error('Aufruf: node scripts/import-lebensmittel.mjs <datei.xlsx>');

// Minimaler ZIP-Leser (xlsx = zip): Dateien über das zentrale Verzeichnis finden und entpacken.
const buf = fs.readFileSync(file);
const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const entries = new Map();
for (let n = buf.readUInt16LE(eocd + 10), p = buf.readUInt32LE(eocd + 16); n--; ) {
  const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), nameLen = buf.readUInt16LE(p + 28), extraLen = buf.readUInt16LE(p + 30), commentLen = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
  entries.set(buf.toString('utf8', p + 46, p + 46 + nameLen), { method, csize, off });
  p += 46 + nameLen + extraLen + commentLen;
}
const read = (name) => {
  const { method, csize, off } = entries.get(name) ?? (() => { throw new Error(`${name} fehlt in der Excel`); })();
  const start = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28);
  const raw = buf.subarray(start, start + csize);
  return (method === 8 ? zlib.inflateRawSync(raw) : raw).toString('utf8');
};

const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const text = (x) => [...x.matchAll(/<(?:x:)?t[^>]*>([\s\S]*?)<\/(?:x:)?t>/g)].map((t) => t[1]).join('');
const shared = [...read('xl/sharedStrings.xml').matchAll(/<(?:x:)?si>([\s\S]*?)<\/(?:x:)?si>/g)].map((m) => dec(text(m[1])));

// Blatt "Lebensmittel" ist das erste Blatt.
const rows = [...read('xl/worksheets/sheet1.xml').matchAll(/<(?:x:)?row[^>]*>([\s\S]*?)<\/(?:x:)?row>/g)].map((r) => {
  const row = {};
  for (const c of r[1].matchAll(/<(?:x:)?c ([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:x:)?c>)/g)) {
    const col = c[1].match(/r="([A-Z]+)\d+"/)[1];
    const v = (c[2] ?? '').match(/<(?:x:)?v>([\s\S]*?)<\/(?:x:)?v>/)?.[1] ?? text(c[2] ?? '');
    row[col] = /t="s"/.test(c[1]) ? shared[+v] : dec(v);
  }
  return row;
});

const head = rows[0];
const want = { A: 'ID', B: 'Lebensmittel', C: 'Synonyme', D: 'Kategorie', E: 'Datensatztyp', F: 'GI', G: 'GL je 100 g', I: 'KH Rezeptbasis (g)', K: 'Energie (kcal)', L: 'Fett (g)', M: 'Protein (g)', N: 'Zucker (g)', O: 'Nahrungsfasern (g)', P: 'GI Evidenz' };
for (const [c, name] of Object.entries(want)) if (head[c] !== name) throw new Error(`Spalte ${c} ist "${head[c]}", erwartet "${name}"`);

// "Sp." (Spuren) in der Schweizer Nährwertdatenbank = unter der Nachweisgrenze, zählt als 0.
const num = (v) => (v === 'Sp.' ? 0 : v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Math.round(Number(v) * 1000) / 1000);
const out = rows.slice(1).filter((r) => r.A).map((r) => ({
  id: Number(r.A),
  name: r.B,
  synonyme: (r.C ?? '').split(/[;,]\s*/).map((s) => s.trim()).filter(Boolean),
  kategorie: r.D,
  typ: r.E,
  gi: num(r.F),
  gl: num(r.G),
  kh: num(r.I),
  kcal: num(r.K),
  fett: num(r.L),
  protein: num(r.M),
  zucker: num(r.N),
  fasern: num(r.O),
  evidenz: r.P ?? '',
}));
fs.writeFileSync(new URL('../src/data/lebensmittel.json', import.meta.url), JSON.stringify(out));
console.log(`${out.length} Lebensmittel geschrieben`);
