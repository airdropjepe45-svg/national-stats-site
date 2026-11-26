// views.js — one renderer per page. Each returns the HTML for the main region;
// main.js swaps it in on hash changes and wires the controls afterwards.

import {
  HEADLINE, SOCIAL, SOURCES, PROVINCES, REGIONS,
  POPULATION_TREND, GDP_GROWTH, INFLATION, UNEMPLOYMENT, TRADE, SECTORS, POVERTY, STUNTING,
  sourceById,
} from "./data.js";
import { lineChart, barChart, groupedBars, donut, donutLegend, hBars } from "./charts.js";
import { int, millions, people, km2, density, pct, esc } from "./format.js";
import {
  slugOf, provinceBySlug, populationRank, shareOfNational,
  regionSummaries, topProvinces, densestProvinces, TOTAL_POPULATION, TOTAL_AREA,
} from "./provinces.js";

export function srcLine(srcId, note = "") {
  const s = sourceById(srcId);
  if (!s) return "";
  return `<p class="src">Source: ${esc(s.publisher)}, <em>${esc(s.title)}</em> · ${s.year}${note ? ` · ${esc(note)}` : ""}</p>`;
}

function figureCard(item) {
  const s = sourceById(item.src);
  return `<article class="kpi">
    <h3>${esc(item.label)}</h3>
    <p class="kpi-value">${esc(item.value)}</p>
    <p class="kpi-note">${esc(item.note)}</p>
    <p class="kpi-src">${s ? esc(s.publisher.split(" (")[0]) : ""} · ${esc(item.asOf)}</p>
  </article>`;
}

function chartCard(title, bodyHtml, srcHtml) {
  return `<section class="card">
    <h3>${esc(title)}</h3>
    ${bodyHtml}
    ${srcHtml}
  </section>`;
}

export function overviewView() {
  const kpis = HEADLINE.map(figureCard).join("");
  const top = topProvinces(6).map((p) => ({ label: p.name, value: p.population / 1e6 }));
  const regions = regionSummaries().map((r) => ({ label: r.region, value: (r.population / TOTAL_POPULATION) * 100 }));
  return `
  <section class="hero">
    <h2>Indonesia at a glance</h2>
    <p class="lede">An archipelago of about 17,000 islands and ${PROVINCES.length} provinces, home to
    284.4 million people. Every figure on this page names its publisher and year; the full
    list sits on the <a href="#/sources">Sources</a> page.</p>
  </section>
  <section class="kpi-grid" aria-label="Headline indicators">${kpis}</section>
  <div class="grid-2">
    ${chartCard("Population, 1980–2024",
      lineChart(POPULATION_TREND.points, { title: "Population trend", fmt: (v) => v.toFixed(0) + "M", labelFmt: (v) => v.toFixed(1) + "M" }),
      srcLine("bps-census", "2024 point is the BPS mid-2024 projection"))}
    ${chartCard("Real GDP growth, 2015–2024",
      barChart(GDP_GROWTH.points, { title: "GDP growth by year", fmt: (v) => v.toFixed(1) + "%" }),
      srcLine("bps-gdp"))}
  </div>
  <div class="grid-2">
    ${chartCard("GDP by sector, 2024",
      `<div class="donut-wrap">${donut(SECTORS.slices, { title: "GDP by sector", centerLabel: "2024", centerSub: "share of GDP" })}${donutLegend(SECTORS.slices, (v) => v.toFixed(1) + "%")}</div>`,
      srcLine("bps-gdp", "shares rounded"))}
    ${chartCard("Most populous provinces",
      hBars(top, { title: "Most populous provinces", fmt: (v) => v.toFixed(1) + "M", labelW: 130 }),
      srcLine("bps-projection", "BPS 2024 estimates, rounded"))}
  </div>
  ${chartCard("Where people live, by island group",
    hBars(regions, { title: "Population share by island group", fmt: (v) => v.toFixed(1) + "%", labelW: 170 }),
    srcLine("bps-projection", "shares computed from the provincial table"))}
  <section class="card">
    <h3>Explore the provinces</h3>
    <p>All ${PROVINCES.length} provinces with their capitals, populations and land areas are in the
    <a href="#/provinces">province explorer</a> — searchable, sortable, and each province has its own page.
    Put any two side by side in the <a href="#/compare">compare tool</a>.</p>
  </section>`;
}

function provinceRow(p) {
  return `<tr>
    <td><a href="#/province/${slugOf(p.name)}">${esc(p.name)}</a></td>
    <td>${esc(p.capital)}</td>
    <td>${esc(p.region)}</td>
    <td class="num">${people(p.population)}</td>
    <td class="num">${km2(p.areaKm2)}</td>
    <td class="num">${density(p.population, p.areaKm2)}</td>
  </tr>`;
}

export function provincesView(ui) {
  const query = (ui.query || "").toLowerCase();
  const region = ui.region || "all";
  let rows = PROVINCES.filter((p) =>
    (region === "all" || p.region === region) &&
    (p.name.toLowerCase().includes(query) || p.capital.toLowerCase().includes(query)));
  const key = ui.sortKey || "population";
  const dir = ui.sortDir === "asc" ? 1 : -1;
  rows = [...rows].sort((a, b) => {
    if (key === "name") return a.name.localeCompare(b.name) * dir;
    if (key === "density") return (a.population / a.areaKm2 - b.population / b.areaKm2) * dir;
    return (a[key] - b[key]) * dir;
  });
  const sortBtn = (k, label) => {
    const active = key === k;
    const arrow = active ? (dir === 1 ? " ↑" : " ↓") : "";
    return `<button type="button" class="sort-btn${active ? " active" : ""}" data-sort="${k}">${label}${arrow}</button>`;
  };
  const regionOptions = ["all", ...REGIONS]
    .map((r) => `<option value="${esc(r)}"${r === region ? " selected" : ""}>${r === "all" ? "All island groups" : esc(r)}</option>`)
    .join("");
  return `
  <section class="hero">
    <h2>Province explorer</h2>
    <p class="lede">All ${PROVINCES.length} provinces of Indonesia. Search by province or capital,
    filter by island group, or sort the table — every row opens that province's own page.</p>
  </section>
  <section class="card">
    <div class="controls">
      <label>Search <input id="prov-search" type="search" value="${esc(ui.query || "")}" placeholder="Province or capital…"></label>
      <label>Island group <select id="prov-region">${regionOptions}</select></label>
      <p class="controls-note">${rows.length} of ${PROVINCES.length} provinces shown</p>
    </div>
    <div class="table-wrap">
    <table class="data-table">
      <thead><tr>
        <th>${sortBtn("name", "Province")}</th><th>Capital</th><th>Island group</th>
        <th class="num">${sortBtn("population", "Population")}</th>
        <th class="num">${sortBtn("areaKm2", "Area")}</th>
        <th class="num">${sortBtn("density", "People / km²")}</th>
      </tr></thead>
      <tbody>${rows.map(provinceRow).join("")}</tbody>
    </table>
    </div>
    ${srcLine("bps-projection", "population = BPS 2024 estimate rounded to the nearest 10,000; density computed from population and area")}
  </section>`;
}

export function provinceView(slug) {
  const p = provinceBySlug(slug);
  if (!p) return notFoundView();
  const rank = populationRank(p);
  const share = shareOfNational(p);
  const nationalDensity = TOTAL_POPULATION / TOTAL_AREA;
  const ownDensity = p.population / p.areaKm2;
  const denser = densestProvinces(PROVINCES.length).indexOf(p) + 1;
  const siblings = PROVINCES.filter((x) => x.region === p.region && x !== p)
    .sort((a, b) => b.population - a.population);
  const densityBars = hBars([
    { label: p.name, value: ownDensity, color: "#0e7c6b" },
    { label: "National average", value: nationalDensity, color: "#8a8f7a" },
  ], { title: "Population density compared with the national average", fmt: (v) => int(Math.round(v)), labelW: 150 });
  return `
  <p class="crumb"><a href="#/provinces">← All provinces</a></p>
  <section class="hero">
    <h2>${esc(p.name)}</h2>
    <p class="lede">Capital <strong>${esc(p.capital)}</strong> · ${esc(p.region)} island group ·
    the ${rank}${rank === 1 ? "st" : rank === 2 ? "nd" : rank === 3 ? "rd" : "th"} most populous of ${PROVINCES.length} provinces.</p>
  </section>
  <section class="kpi-grid">
    <article class="kpi"><h3>Population</h3><p class="kpi-value">${millions(p.population)}</p><p class="kpi-note">${people(p.population)} people</p><p class="kpi-src">BPS · 2024 est.</p></article>
    <article class="kpi"><h3>Share of Indonesia</h3><p class="kpi-value">${pct(share)}</p><p class="kpi-note">of the national population</p><p class="kpi-src">computed</p></article>
    <article class="kpi"><h3>Land area</h3><p class="kpi-value">${int(p.areaKm2)} km²</p><p class="kpi-note">${pct((p.areaKm2 / TOTAL_AREA) * 100)} of national land area</p><p class="kpi-src">BPS · rounded</p></article>
    <article class="kpi"><h3>Density</h3><p class="kpi-value">${density(p.population, p.areaKm2)} /km²</p><p class="kpi-note">${denser}${denser === 1 ? "st" : denser === 2 ? "nd" : denser === 3 ? "rd" : "th"} densest province</p><p class="kpi-src">computed</p></article>
  </section>
  ${chartCard("Density against the national average", densityBars, srcLine("bps-projection", "national average computed from all 38 provinces"))}
  <section class="card">
    <h3>Other provinces in ${esc(p.region)}</h3>
    <ul class="link-list">${siblings.map((s) => `<li><a href="#/province/${slugOf(s.name)}">${esc(s.name)}</a> <span class="muted">— ${millions(s.population)} people, capital ${esc(s.capital)}</span></li>`).join("")}</ul>
    <p><a href="#/compare">Compare ${esc(p.name)} with another province →</a></p>
  </section>`;
}

export function economyView() {
  const tradeRows = TRADE.points.map((t) =>
    `<tr><td>${t.year}</td><td class="num">${t.exports.toFixed(1)}</td><td class="num">${t.imports.toFixed(1)}</td><td class="num">${(t.exports - t.imports >= 0 ? "+" : "") + (t.exports - t.imports).toFixed(1)}</td></tr>`).join("");
  return `
  <section class="hero">
    <h2>Economy</h2>
    <p class="lede">Growth, prices and trade: how the world's fourth most populous country earns and spends.
    GDP reached US$1.37 trillion in 2024 (World Bank), about US$4,810 per person.</p>
  </section>
  <div class="grid-2">
    ${chartCard("Real GDP growth, 2015–2024",
      barChart(GDP_GROWTH.points, { title: "GDP growth by year", fmt: (v) => v.toFixed(1) + "%" }),
      srcLine("bps-gdp", "2020 contraction was the COVID-19 shock"))}
    ${chartCard("Inflation, 2015–2024",
      lineChart(INFLATION.points, { title: "Inflation by year", color: "#c4532e", fmt: (v) => v.toFixed(1) + "%", labelFmt: (v) => v.toFixed(2) + "%" }),
      srcLine("bps-cpi", "December year-on-year"))}
  </div>
  <div class="grid-2">
    ${chartCard("Exports and imports, 2020–2024",
      groupedBars(TRADE.points.map((t) => ({ year: t.year, a: t.exports, b: t.imports })), { title: "Exports and imports", aLabel: "Exports", bLabel: "Imports", fmt: (v) => v.toFixed(0) }),
      srcLine("bps-trade", "goods, US$ billion"))}
    ${chartCard("GDP by sector, 2024",
      `<div class="donut-wrap">${donut(SECTORS.slices, { title: "GDP by sector", centerLabel: "2024", centerSub: "share of GDP" })}${donutLegend(SECTORS.slices, (v) => v.toFixed(1) + "%")}</div>`,
      srcLine("bps-gdp", "shares rounded"))}
  </div>
  <section class="card">
    <h3>Trade balance, US$ billion</h3>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Year</th><th class="num">Exports</th><th class="num">Imports</th><th class="num">Balance</th></tr></thead>
      <tbody>${tradeRows}</tbody>
    </table></div>
    ${srcLine("bps-trade", "balance computed as exports minus imports")}
  </section>`;
}

export function peopleView() {
  const cards = SOCIAL.map(figureCard).join("");
  return `
  <section class="hero">
    <h2>People &amp; society</h2>
    <p class="lede">Schooling, health, work and poverty — the human side of the numbers,
    from BPS household surveys and the Ministry of Health nutrition survey.</p>
  </section>
  <section class="kpi-grid" aria-label="Social indicators">${cards}</section>
  <div class="grid-2">
    ${chartCard("Poverty rate, 2019–2024",
      lineChart(POVERTY.points, { title: "Poverty rate by year", color: "#38618c", fmt: (v) => v.toFixed(1) + "%", labelFmt: (v) => v.toFixed(2) + "%" }),
      srcLine("bps-susenas", "measured each March"))}
    ${chartCard("Child stunting, 2019–2023",
      barChart(STUNTING.points, { title: "Stunting prevalence by year", color: "#d98e2b", fmt: (v) => v.toFixed(1) + "%" }),
      srcLine("kemenkes-ssgi", "children under five; no survey round in 2020"))}
  </div>
  ${chartCard("Open unemployment rate, 2019–2024",
    lineChart(UNEMPLOYMENT.points, { title: "Unemployment rate by year", color: "#7a6c2f", fmt: (v) => v.toFixed(1) + "%", labelFmt: (v) => v.toFixed(2) + "%" }),
    srcLine("bps-sakernas", "measured each August; 2020 spike was the COVID-19 shock"))}`;
}

export function compareView(aSlug, bSlug) {
  const a = provinceBySlug(aSlug) || PROVINCES[11]; // Jawa Barat
  const b = provinceBySlug(bSlug) || PROVINCES[14]; // Jawa Timur
  const options = (selected) => PROVINCES
    .map((p) => `<option value="${slugOf(p.name)}"${p === selected ? " selected" : ""}>${esc(p.name)}</option>`)
    .join("");
  const row = (label, va, vb) => `<tr><th>${label}</th><td>${va}</td><td>${vb}</td></tr>`;
  const bars = hBars([
    { label: a.name, value: a.population / 1e6, color: "#0e7c6b" },
    { label: b.name, value: b.population / 1e6, color: "#d98e2b" },
  ], { title: "Population compared", fmt: (v) => v.toFixed(1) + "M", labelW: 150 });
  const ratio = a.population >= b.population
    ? `${a.name} has ${(a.population / b.population).toFixed(1)}× the population of ${b.name}.`
    : `${b.name} has ${(b.population / a.population).toFixed(1)}× the population of ${a.name}.`;
  return `
  <section class="hero">
    <h2>Compare two provinces</h2>
    <p class="lede">Pick any two of the ${PROVINCES.length} provinces and see them side by side. ${esc(ratio)}</p>
  </section>
  <section class="card">
    <div class="controls">
      <label>Province A <select id="cmp-a">${options(a)}</select></label>
      <label>Province B <select id="cmp-b">${options(b)}</select></label>
    </div>
    <div class="table-wrap"><table class="data-table compare-table">
      <thead><tr><th></th><th><a href="#/province/${slugOf(a.name)}">${esc(a.name)}</a></th><th><a href="#/province/${slugOf(b.name)}">${esc(b.name)}</a></th></tr></thead>
      <tbody>
        ${row("Capital", esc(a.capital), esc(b.capital))}
        ${row("Island group", esc(a.region), esc(b.region))}
        ${row("Population", people(a.population), people(b.population))}
        ${row("Share of Indonesia", pct(shareOfNational(a)), pct(shareOfNational(b)))}
        ${row("Population rank", "#" + populationRank(a) + " of " + PROVINCES.length, "#" + populationRank(b) + " of " + PROVINCES.length)}
        ${row("Land area", km2(a.areaKm2), km2(b.areaKm2))}
        ${row("Density (people/km²)", density(a.population, a.areaKm2), density(b.population, b.areaKm2))}
      </tbody>
    </table></div>
    ${bars}
    ${srcLine("bps-projection", "BPS 2024 estimates, rounded; shares and ranks computed")}
  </section>`;
}

export function sourcesView() {
  const rows = SOURCES.map((s) => `<tr>
    <td>${esc(s.publisher)}</td><td><em>${esc(s.title)}</em></td><td>${s.year}</td><td>${esc(s.covers)}</td>
  </tr>`).join("");
  return `
  <section class="hero">
    <h2>Sources</h2>
    <p class="lede">Every figure on Peta Angka comes from one of the publications below — no number is
    invented. Where a value is computed from others (density, shares, ranks, the trade balance),
    the page says "computed" next to it.</p>
  </section>
  <section class="card">
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Publisher</th><th>Publication</th><th>Year</th><th>What it covers here</th></tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
  </section>
  <section class="card">
    <h3>How to read the figures</h3>
    <ul class="notes">
      <li>Provincial populations are the BPS 2024 estimates rounded to the nearest 10,000 people, so the provincial total differs slightly from the BPS national projection of 284.4 million.</li>
      <li>Land areas are rounded to the nearest 100 km² (Jakarta and Yogyakarta to the nearest km²).</li>
      <li>GDP sector shares for 2024 are rounded to one decimal; the "all other sectors" slice is the remainder to 100%.</li>
      <li>Inflation is the December year-on-year rate; unemployment is the August rate; poverty is the March rate — the reference periods BPS headlines each year.</li>
      <li>Stunting has no 2020 point: the nutrition survey round was skipped during the COVID-19 pandemic.</li>
    </ul>
  </section>`;
}

export function notFoundView() {
  return `<section class="hero">
    <h2>Page not found</h2>
    <p class="lede">That page does not exist. Start from the <a href="#/">overview</a> or the
    <a href="#/provinces">province explorer</a>.</p>
  </section>`;
}
