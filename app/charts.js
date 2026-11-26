// charts.js — small hand-drawn SVG charts. Each builder takes plain data and
// returns an SVG string; views drop the string into the page. No library.

const PALETTE = ["#0e7c6b", "#d98e2b", "#c4532e", "#38618c", "#7a6c2f", "#8a8f7a"];

function extent(values, padFraction = 0.08) {
  let lo = Math.min(...values);
  let hi = Math.max(...values);
  if (lo === hi) { lo -= 1; hi += 1; }
  const pad = (hi - lo) * padFraction;
  return [lo - pad, hi + pad];
}

function frame(w, h, padL, padR, padT, padB) {
  return { w, h, x0: padL, x1: w - padR, y0: padT, y1: h - padB };
}

function gridLines(f, lo, hi, fmt) {
  const rows = 4;
  let out = "";
  for (let i = 0; i <= rows; i++) {
    const v = lo + ((hi - lo) * i) / rows;
    const y = f.y1 - ((v - lo) / (hi - lo)) * (f.y1 - f.y0);
    out += `<line x1="${f.x0}" y1="${y.toFixed(1)}" x2="${f.x1}" y2="${y.toFixed(1)}" class="grid"/>`;
    out += `<text x="${f.x0 - 6}" y="${(y + 3).toFixed(1)}" class="axis" text-anchor="end">${fmt(v)}</text>`;
  }
  return out;
}

// Line chart over yearly points: [{year, value}]. Options: color, fmt (axis), labelFmt (point labels).
export function lineChart(points, opts = {}) {
  const color = opts.color || PALETTE[0];
  const fmt = opts.fmt || ((v) => v.toFixed(0));
  const labelFmt = opts.labelFmt || fmt;
  const f = frame(560, 240, 44, 14, 16, 30);
  const [lo, hi] = extent(points.map((p) => p.value));
  const x = (i) => f.x0 + (i / (points.length - 1)) * (f.x1 - f.x0);
  const y = (v) => f.y1 - ((v - lo) / (hi - lo)) * (f.y1 - f.y0);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const area = `${path} L${x(points.length - 1).toFixed(1)},${f.y1} L${x(0).toFixed(1)},${f.y1} Z`;
  let dots = "";
  points.forEach((p, i) => {
    const anchor = i === 0 ? "start" : i === points.length - 1 ? "end" : "middle";
    const lx = i === 0 ? x(i) + 2 : i === points.length - 1 ? x(i) - 2 : x(i);
    dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="3.2" fill="${color}"/>`;
    dots += `<text x="${lx.toFixed(1)}" y="${(y(p.value) - 8).toFixed(1)}" class="val" text-anchor="${anchor}">${labelFmt(p.value)}</text>`;
    dots += `<text x="${x(i).toFixed(1)}" y="${f.y1 + 18}" class="axis" text-anchor="middle">${p.year}</text>`;
  });
  return `<svg viewBox="0 0 ${f.w} ${f.h}" class="chart" role="img" aria-label="${opts.title || "line chart"}">
    ${gridLines(f, lo, hi, fmt)}
    <path d="${area}" fill="${color}" opacity="0.12"/>
    <path d="${path}" fill="none" stroke="${color}" stroke-width="2.4"/>
    ${dots}</svg>`;
}

// Vertical bars over yearly points; negative values drop below the zero line.
export function barChart(points, opts = {}) {
  const color = opts.color || PALETTE[0];
  const negColor = opts.negColor || "#c4532e";
  const fmt = opts.fmt || ((v) => v.toFixed(0));
  const f = frame(560, 240, 44, 14, 16, 30);
  const values = points.map((p) => p.value);
  const lo = Math.min(0, ...values);
  const hi = Math.max(0, ...values) * 1.12;
  const y = (v) => f.y1 - ((v - lo) / (hi - lo)) * (f.y1 - f.y0);
  const step = (f.x1 - f.x0) / points.length;
  const bw = Math.min(34, step * 0.62);
  let bars = "";
  points.forEach((p, i) => {
    const cx = f.x0 + step * i + step / 2;
    const top = Math.min(y(p.value), y(0));
    const height = Math.abs(y(p.value) - y(0));
    bars += `<rect x="${(cx - bw / 2).toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${height.toFixed(1)}" rx="3" fill="${p.value < 0 ? negColor : color}"/>`;
    const neg = p.value < 0;
    const labelY = neg ? y(p.value) - 5 : y(p.value) - 5;
    bars += `<text x="${cx.toFixed(1)}" y="${labelY.toFixed(1)}" class="${neg ? "val val-neg" : "val"}" text-anchor="middle">${fmt(p.value)}</text>`;
    bars += `<text x="${cx.toFixed(1)}" y="${f.y1 + 18}" class="axis" text-anchor="middle">${p.year}</text>`;
  });
  return `<svg viewBox="0 0 ${f.w} ${f.h}" class="chart" role="img" aria-label="${opts.title || "bar chart"}">
    ${gridLines(f, lo, hi, fmt)}
    <line x1="${f.x0}" y1="${y(0).toFixed(1)}" x2="${f.x1}" y2="${y(0).toFixed(1)}" class="zero"/>
    ${bars}</svg>`;
}

// Grouped bars for two series (exports vs imports).
export function groupedBars(points, opts = {}) {
  const fmt = opts.fmt || ((v) => v.toFixed(0));
  const f = frame(560, 240, 44, 14, 16, 30);
  const hi = Math.max(...points.flatMap((p) => [p.a, p.b])) * 1.12;
  const y = (v) => f.y1 - (v / hi) * (f.y1 - f.y0);
  const step = (f.x1 - f.x0) / points.length;
  const bw = Math.min(20, step * 0.3);
  let bars = "";
  points.forEach((p, i) => {
    const cx = f.x0 + step * i + step / 2;
    bars += `<rect x="${(cx - bw - 2).toFixed(1)}" y="${y(p.a).toFixed(1)}" width="${bw.toFixed(1)}" height="${(y(0) - y(p.a)).toFixed(1)}" rx="3" fill="${PALETTE[0]}"/>`;
    bars += `<rect x="${(cx + 2).toFixed(1)}" y="${y(p.b).toFixed(1)}" width="${bw.toFixed(1)}" height="${(y(0) - y(p.b)).toFixed(1)}" rx="3" fill="${PALETTE[1]}"/>`;
    bars += `<text x="${cx.toFixed(1)}" y="${f.y1 + 18}" class="axis" text-anchor="middle">${p.year}</text>`;
  });
  const legend = `<g class="legend">
    <rect x="${f.x1 - 170}" y="2" width="10" height="10" rx="2" fill="${PALETTE[0]}"/><text x="${f.x1 - 156}" y="11" class="axis">${opts.aLabel || "A"}</text>
    <rect x="${f.x1 - 84}" y="2" width="10" height="10" rx="2" fill="${PALETTE[1]}"/><text x="${f.x1 - 70}" y="11" class="axis">${opts.bLabel || "B"}</text></g>`;
  return `<svg viewBox="0 0 ${f.w} ${f.h}" class="chart" role="img" aria-label="${opts.title || "grouped bar chart"}">
    ${gridLines(f, 0, hi, fmt)}${legend}${bars}</svg>`;
}

// Donut of shares; slices: [{label, value}]. Returns svg + legend html separately via donutLegend.
export function donut(slices, opts = {}) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = 120, cy = 120, r = 92, inner = 56;
  let angle = -Math.PI / 2;
  let paths = "";
  slices.forEach((s, i) => {
    const frac = s.value / total;
    const a1 = angle;
    const a2 = angle + frac * Math.PI * 2;
    angle = a2;
    const large = frac > 0.5 ? 1 : 0;
    const p = (a, rr) => `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`;
    paths += `<path d="M${p(a1, r)} A${r},${r} 0 ${large} 1 ${p(a2, r)} L${p(a2, inner)} A${inner},${inner} 0 ${large} 0 ${p(a1, inner)} Z" fill="${PALETTE[i % PALETTE.length]}"/>`;
  });
  const center = opts.centerLabel
    ? `<text x="${cx}" y="${cy - 4}" class="donut-center" text-anchor="middle">${opts.centerLabel}</text>
       <text x="${cx}" y="${cy + 16}" class="axis" text-anchor="middle">${opts.centerSub || ""}</text>`
    : "";
  return `<svg viewBox="0 0 240 240" class="chart donut" role="img" aria-label="${opts.title || "donut chart"}">${paths}${center}</svg>`;
}

export function donutLegend(slices, fmt) {
  return `<ul class="legend-list">${slices
    .map((s, i) => `<li><span class="swatch" style="background:${PALETTE[i % PALETTE.length]}"></span><span class="legend-label">${s.label}</span><strong>${fmt(s.value)}</strong></li>`)
    .join("")}</ul>`;
}

// Horizontal bars for ranked items: [{label, value}], valueFmt formats the number.
export function hBars(items, opts = {}) {
  const fmt = opts.fmt || ((v) => v.toFixed(1));
  const max = Math.max(...items.map((i) => i.value));
  const rowH = 26;
  const h = items.length * rowH + 8;
  const labelW = opts.labelW || 150;
  const barW = 560 - labelW - 70;
  let rows = "";
  items.forEach((it, i) => {
    const yTop = 4 + i * rowH;
    const w = Math.max(2, (it.value / max) * barW);
    rows += `<text x="${labelW - 8}" y="${yTop + 14}" class="hbar-label" text-anchor="end">${it.label}</text>`;
    rows += `<rect x="${labelW}" y="${yTop + 3}" width="${w.toFixed(1)}" height="14" rx="3" fill="${it.color || PALETTE[0]}"/>`;
    rows += `<text x="${(labelW + w + 6).toFixed(1)}" y="${yTop + 14}" class="val">${fmt(it.value)}</text>`;
  });
  return `<svg viewBox="0 0 560 ${h}" class="chart hbar" role="img" aria-label="${opts.title || "horizontal bar chart"}">${rows}</svg>`;
}
