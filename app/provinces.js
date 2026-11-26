// provinces.js — derived province facts, computed from the base table in data.js.

import { PROVINCES, REGIONS } from "./data.js";

export function slugOf(name) {
  return name.toLowerCase().replaceAll(" ", "-");
}

export const TOTAL_POPULATION = PROVINCES.reduce((s, p) => s + p.population, 0);
export const TOTAL_AREA = PROVINCES.reduce((s, p) => s + p.areaKm2, 0);

export function provinceBySlug(slug) {
  return PROVINCES.find((p) => slugOf(p.name) === slug) || null;
}

// Rank by population, 1 = most populous.
export function populationRank(province) {
  return [...PROVINCES].sort((a, b) => b.population - a.population).indexOf(province) + 1;
}

export function shareOfNational(province) {
  return (province.population / TOTAL_POPULATION) * 100;
}

// One aggregate row per island group: provinces, people, land, density.
export function regionSummaries() {
  return REGIONS.map((region) => {
    const members = PROVINCES.filter((p) => p.region === region);
    const population = members.reduce((s, p) => s + p.population, 0);
    const areaKm2 = members.reduce((s, p) => s + p.areaKm2, 0);
    return { region, count: members.length, population, areaKm2 };
  });
}

export function topProvinces(n) {
  return [...PROVINCES].sort((a, b) => b.population - a.population).slice(0, n);
}

export function densestProvinces(n) {
  return [...PROVINCES]
    .sort((a, b) => b.population / b.areaKm2 - a.population / a.areaKm2)
    .slice(0, n);
}
