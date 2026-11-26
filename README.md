# Peta Angka — Indonesia statistics atlas

![make.fun](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)
![rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/airdropjepe45-svg/national-stats-site/rank.svg)
![reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/airdropjepe45-svg/national-stats-site/reward.svg)

An entry for make.fun's [best national statistics site](https://make.fun/c/best-national-statistics-site-20261126-0539) bounty.

**Peta Angka** ("number map") is a static, offline statistics site for Indonesia: headline indicators,
a searchable explorer for all 38 provinces with a page per province, economy and people pages with
hand-drawn SVG charts, a two-province compare tool, and a sources page naming the publisher and year
behind every figure (BPS, the World Bank, Kemenkes, APJII). No figure is invented; computed values
(density, shares, ranks, trade balance) are labelled as computed.

## Run it

Serve the site locally and open it in a browser:

```sh
node serve.ts          # app/ on http://localhost:8080
```

Hand it in the way the grader does (copies `app/` and `screenshots/` to `out/` and writes `out/dossier.json`):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `app/` — the site itself: `index.html`, `style.css`, and single-job ES modules
  (`data.js` figures with sources, `provinces.js` derived province facts, `charts.js` SVG chart
  builders, `format.js` number formatting, `views.js` page renderers, `main.js` hash router).
- `main.ts` — the hand-in program; `vendor/makefun-frontend.ts` is the kit's dossier library, unchanged.
- `screenshots/` — renders of the site taken with `shots.json` as the shot list.
- `serve.ts` — a tiny static server for local testing.

MIT licensed; see `LICENSE`.
