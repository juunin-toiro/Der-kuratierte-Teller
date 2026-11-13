// Glykämische Last: <= 10 niedrig, 11-19 mittel, >= 20 hoch (übliche GL-Stufen).
export const glStufe = (gl: number) => (gl <= 10 ? 'niedrige' : gl < 20 ? 'mittlere' : 'hohe');
export const zahl = (n: number, stellen = 1) => n.toLocaleString('de-DE', { minimumFractionDigits: stellen, maximumFractionDigits: stellen });
