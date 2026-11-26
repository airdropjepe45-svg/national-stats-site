// format.js — number and label formatting shared by every view.

const nfInt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

export function int(n) {
  return nfInt.format(n);
}

// People counts in millions with one decimal, e.g. 50,350,000 -> "50.4M".
export function millions(n) {
  return (n / 1e6).toFixed(1) + "M";
}

// Full people count with thousands separators, e.g. "50,350,000".
export function people(n) {
  return nfInt.format(n);
}

export function km2(n) {
  return nfInt.format(n) + " km²";
}

// Density in people per km², one decimal under 100, whole numbers above.
export function density(population, areaKm2) {
  const d = population / areaKm2;
  return d < 100 ? d.toFixed(1) : nfInt.format(Math.round(d));
}

// Percent with a fixed number of decimals, e.g. pct(17.7) -> "17.7%".
export function pct(n, digits = 1) {
  return n.toFixed(digits) + "%";
}

// Escape text that lands in HTML (province names are ours, but be safe).
export function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
