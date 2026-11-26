// data.js — every figure Peta Angka shows, with the publisher and year it came from.
// National series are the values BPS, the World Bank, Kemenkes and APJII publish;
// provincial populations are the BPS 2024 estimates, rounded, and the UI says so.

export const SITE = {
  name: "Peta Angka",
  tagline: "Indonesia's statistics, mapped province by province.",
  country: "Indonesia",
};

export const SOURCES = [
  { id: "bps-projection", publisher: "BPS (Statistics Indonesia)", title: "Population Projection 2020–2050", year: 2024, covers: "National and provincial population estimates, mid-2024" },
  { id: "bps-census", publisher: "BPS (Statistics Indonesia)", title: "Population Censuses 1980–2020", year: 2020, covers: "Census population counts by census year" },
  { id: "bps-gdp", publisher: "BPS (Statistics Indonesia)", title: "National Accounts, GDP release", year: 2024, covers: "GDP, GDP growth by year, GDP by industry sector" },
  { id: "world-bank", publisher: "World Bank", title: "World Development Indicators", year: 2025, covers: "GDP in US dollars and GDP per capita (2024 values)" },
  { id: "bps-cpi", publisher: "BPS (Statistics Indonesia)", title: "Consumer Price Index release", year: 2024, covers: "Inflation, December year-on-year, by year" },
  { id: "bps-sakernas", publisher: "BPS (Statistics Indonesia)", title: "National Labour Force Survey (Sakernas)", year: 2024, covers: "Open unemployment rate, August each year" },
  { id: "bps-trade", publisher: "BPS (Statistics Indonesia)", title: "Foreign Trade Statistics", year: 2024, covers: "Exports and imports of goods, US dollars, by year" },
  { id: "bps-susenas", publisher: "BPS (Statistics Indonesia)", title: "National Socio-Economic Survey (Susenas)", year: 2024, covers: "Poverty rate (March) and literacy rate (2023)" },
  { id: "bps-hdi", publisher: "BPS (Statistics Indonesia)", title: "Human Development Index (IPM)", year: 2024, covers: "HDI, life expectancy at birth, mean years of schooling" },
  { id: "kemenkes-ssgi", publisher: "Ministry of Health (Kemenkes)", title: "Indonesian Nutrition Status Survey (SSGI)", year: 2023, covers: "Stunting prevalence in children under five" },
  { id: "apjii", publisher: "APJII", title: "Internet Penetration Survey", year: 2024, covers: "Internet users and penetration rate" },
];

export function sourceById(id) {
  return SOURCES.find((s) => s.id === id) || null;
}

// Headline indicators for the overview dashboard. `src` names the source above;
// `asOf` is the reference period printed under each figure.
export const HEADLINE = [
  { key: "population", label: "Population", value: "284.4 million", note: "4th most populous country", src: "bps-projection", asOf: "mid-2024" },
  { key: "gdp", label: "GDP", value: "US$1.37 trillion", note: "largest economy in Southeast Asia", src: "world-bank", asOf: "2024" },
  { key: "gdp-per-capita", label: "GDP per capita", value: "US$4,810", note: "upper-middle income", src: "world-bank", asOf: "2024" },
  { key: "inflation", label: "Inflation", value: "1.57%", note: "year-on-year, December", src: "bps-cpi", asOf: "Dec 2024" },
  { key: "unemployment", label: "Unemployment", value: "4.91%", note: "open unemployment rate", src: "bps-sakernas", asOf: "Aug 2024" },
  { key: "life-expectancy", label: "Life expectancy", value: "72.4 years", note: "at birth", src: "bps-hdi", asOf: "2024" },
];

// Population at each census, plus the mid-2024 projection (millions of people).
export const POPULATION_TREND = {
  unit: "million people",
  src: "bps-census",
  points: [
    { year: 1980, value: 147.5 },
    { year: 1990, value: 179.4 },
    { year: 2000, value: 206.3 },
    { year: 2010, value: 237.6 },
    { year: 2020, value: 270.2 },
    { year: 2024, value: 284.4 },
  ],
};

// Real GDP growth, percent year-on-year (BPS national accounts).
export const GDP_GROWTH = {
  unit: "% year-on-year",
  src: "bps-gdp",
  points: [
    { year: 2015, value: 4.88 },
    { year: 2016, value: 5.03 },
    { year: 2017, value: 5.07 },
    { year: 2018, value: 5.17 },
    { year: 2019, value: 5.02 },
    { year: 2020, value: -2.07 },
    { year: 2021, value: 3.7 },
    { year: 2022, value: 5.31 },
    { year: 2023, value: 5.05 },
    { year: 2024, value: 5.03 },
  ],
};

// Inflation, December year-on-year percent (BPS consumer price index).
export const INFLATION = {
  unit: "% year-on-year",
  src: "bps-cpi",
  points: [
    { year: 2015, value: 3.35 },
    { year: 2016, value: 3.02 },
    { year: 2017, value: 3.61 },
    { year: 2018, value: 3.13 },
    { year: 2019, value: 2.72 },
    { year: 2020, value: 1.68 },
    { year: 2021, value: 1.87 },
    { year: 2022, value: 5.51 },
    { year: 2023, value: 2.61 },
    { year: 2024, value: 1.57 },
  ],
};

// Open unemployment rate each August, percent of the labour force (BPS Sakernas).
export const UNEMPLOYMENT = {
  unit: "% of labour force",
  src: "bps-sakernas",
  points: [
    { year: 2019, value: 5.23 },
    { year: 2020, value: 7.07 },
    { year: 2021, value: 6.49 },
    { year: 2022, value: 5.86 },
    { year: 2023, value: 5.32 },
    { year: 2024, value: 4.91 },
  ],
};

// Merchandise trade, billions of US dollars (BPS foreign trade statistics).
export const TRADE = {
  unit: "US$ billion",
  src: "bps-trade",
  points: [
    { year: 2020, exports: 163.2, imports: 141.6 },
    { year: 2021, exports: 231.6, imports: 196.2 },
    { year: 2022, exports: 291.9, imports: 237.4 },
    { year: 2023, exports: 258.8, imports: 221.9 },
    { year: 2024, exports: 264.7, imports: 233.7 },
  ],
};

// GDP by industry sector, share of GDP in 2024, percent, rounded (BPS).
export const SECTORS = {
  unit: "% of GDP",
  src: "bps-gdp",
  year: 2024,
  slices: [
    { label: "Manufacturing", value: 19.0 },
    { label: "Wholesale & retail trade", value: 12.9 },
    { label: "Agriculture, forestry & fishing", value: 12.6 },
    { label: "Construction", value: 9.9 },
    { label: "Mining & quarrying", value: 9.2 },
    { label: "All other sectors", value: 36.4 },
  ],
};

// Poverty rate each March, percent of population (BPS Susenas).
export const POVERTY = {
  unit: "% of population",
  src: "bps-susenas",
  points: [
    { year: 2019, value: 9.22 },
    { year: 2020, value: 9.78 },
    { year: 2021, value: 10.14 },
    { year: 2022, value: 9.54 },
    { year: 2023, value: 9.36 },
    { year: 2024, value: 9.03 },
  ],
};

// Stunting prevalence in children under five, percent (Kemenkes SSGI; no 2020 round).
export const STUNTING = {
  unit: "% of children under five",
  src: "kemenkes-ssgi",
  points: [
    { year: 2019, value: 27.7 },
    { year: 2021, value: 24.4 },
    { year: 2022, value: 21.6 },
    { year: 2023, value: 21.5 },
  ],
};

// Social indicators shown as figure cards on the People page.
export const SOCIAL = [
  { key: "literacy", label: "Literacy rate (age 15+)", value: "96.1%", note: "can read and write Latin script", src: "bps-susenas", asOf: "2023" },
  { key: "schooling", label: "Mean years of schooling", value: "8.9 years", note: "adults aged 25 and over", src: "bps-hdi", asOf: "2024" },
  { key: "hdi", label: "Human Development Index", value: "75.02", note: "scale of 0–100, \"high\" category", src: "bps-hdi", asOf: "2024" },
  { key: "life", label: "Life expectancy at birth", value: "72.4 years", note: "both sexes combined", src: "bps-hdi", asOf: "2024" },
  { key: "internet", label: "Internet users", value: "221.6 million", note: "79.5% of the population online", src: "apjii", asOf: "2024" },
  { key: "poverty-now", label: "Poverty rate", value: "9.03%", note: "25.2 million people below the line", src: "bps-susenas", asOf: "Mar 2024" },
];

// The 38 provinces. Population: BPS 2024 estimate in people, rounded to the
// nearest ten thousand. Area: land area in km², rounded. Density, shares and
// ranks are computed from these two columns by the site itself.
export const PROVINCES = [
  { name: "Aceh", capital: "Banda Aceh", region: "Sumatera", population: 5550000, areaKm2: 56800 },
  { name: "Sumatera Utara", capital: "Medan", region: "Sumatera", population: 15590000, areaKm2: 73000 },
  { name: "Sumatera Barat", capital: "Padang", region: "Sumatera", population: 5840000, areaKm2: 42000 },
  { name: "Riau", capital: "Pekanbaru", region: "Sumatera", population: 6640000, areaKm2: 87000 },
  { name: "Kepulauan Riau", capital: "Tanjung Pinang", region: "Sumatera", population: 2190000, areaKm2: 8200 },
  { name: "Jambi", capital: "Jambi", region: "Sumatera", population: 3750000, areaKm2: 49000 },
  { name: "Sumatera Selatan", capital: "Palembang", region: "Sumatera", population: 8840000, areaKm2: 86800 },
  { name: "Kepulauan Bangka Belitung", capital: "Pangkal Pinang", region: "Sumatera", population: 1530000, areaKm2: 16400 },
  { name: "Bengkulu", capital: "Bengkulu", region: "Sumatera", population: 2090000, areaKm2: 19900 },
  { name: "Lampung", capital: "Bandar Lampung", region: "Sumatera", population: 9400000, areaKm2: 33600 },
  { name: "DKI Jakarta", capital: "Jakarta", region: "Jawa", population: 10680000, areaKm2: 664 },
  { name: "Jawa Barat", capital: "Bandung", region: "Jawa", population: 50350000, areaKm2: 35400 },
  { name: "Jawa Tengah", capital: "Semarang", region: "Jawa", population: 37890000, areaKm2: 32800 },
  { name: "DI Yogyakarta", capital: "Yogyakarta", region: "Jawa", population: 3760000, areaKm2: 3133 },
  { name: "Jawa Timur", capital: "Surabaya", region: "Jawa", population: 41810000, areaKm2: 47800 },
  { name: "Banten", capital: "Serang", region: "Jawa", population: 12430000, areaKm2: 9663 },
  { name: "Bali", capital: "Denpasar", region: "Bali & Nusa Tenggara", population: 4430000, areaKm2: 5780 },
  { name: "Nusa Tenggara Barat", capital: "Mataram", region: "Bali & Nusa Tenggara", population: 5650000, areaKm2: 18600 },
  { name: "Nusa Tenggara Timur", capital: "Kupang", region: "Bali & Nusa Tenggara", population: 5570000, areaKm2: 46400 },
  { name: "Kalimantan Barat", capital: "Pontianak", region: "Kalimantan", population: 5540000, areaKm2: 147300 },
  { name: "Kalimantan Tengah", capital: "Palangka Raya", region: "Kalimantan", population: 2800000, areaKm2: 153600 },
  { name: "Kalimantan Selatan", capital: "Banjarmasin", region: "Kalimantan", population: 4270000, areaKm2: 37500 },
  { name: "Kalimantan Timur", capital: "Samarinda", region: "Kalimantan", population: 4050000, areaKm2: 127300 },
  { name: "Kalimantan Utara", capital: "Tanjung Selor", region: "Kalimantan", population: 740000, areaKm2: 70100 },
  { name: "Sulawesi Utara", capital: "Manado", region: "Sulawesi", population: 2700000, areaKm2: 13900 },
  { name: "Gorontalo", capital: "Gorontalo", region: "Sulawesi", population: 1200000, areaKm2: 11300 },
  { name: "Sulawesi Tengah", capital: "Palu", region: "Sulawesi", population: 3120000, areaKm2: 61800 },
  { name: "Sulawesi Barat", capital: "Mamuju", region: "Sulawesi", population: 1480000, areaKm2: 16800 },
  { name: "Sulawesi Selatan", capital: "Makassar", region: "Sulawesi", population: 9460000, areaKm2: 45300 },
  { name: "Sulawesi Tenggara", capital: "Kendari", region: "Sulawesi", population: 2790000, areaKm2: 36200 },
  { name: "Maluku", capital: "Ambon", region: "Maluku & Papua", population: 1950000, areaKm2: 46900 },
  { name: "Maluku Utara", capital: "Sofifi", region: "Maluku & Papua", population: 1360000, areaKm2: 32000 },
  { name: "Papua", capital: "Jayapura", region: "Maluku & Papua", population: 1090000, areaKm2: 82700 },
  { name: "Papua Barat", capital: "Manokwari", region: "Maluku & Papua", population: 580000, areaKm2: 59800 },
  { name: "Papua Selatan", capital: "Merauke", region: "Maluku & Papua", population: 540000, areaKm2: 117800 },
  { name: "Papua Tengah", capital: "Nabire", region: "Maluku & Papua", population: 1430000, areaKm2: 61100 },
  { name: "Papua Pegunungan", capital: "Wamena", region: "Maluku & Papua", population: 1470000, areaKm2: 51200 },
  { name: "Papua Barat Daya", capital: "Sorong", region: "Maluku & Papua", population: 620000, areaKm2: 39200 },
];

export const REGIONS = ["Sumatera", "Jawa", "Bali & Nusa Tenggara", "Kalimantan", "Sulawesi", "Maluku & Papua"];
