// main.js — hash router and control wiring. Renders the view for the current
// hash route, marks the active nav link, wires page controls, and sets
// window.__shotReady once the page is fully rendered (used by screenshots).

import {
  overviewView, provincesView, provinceView, economyView, peopleView, compareView, sourcesView, notFoundView,
} from "./views.js";

const app = document.getElementById("app");

// Explorer state survives re-renders while the visitor stays on the page.
const explorer = { query: "", region: "all", sortKey: "population", sortDir: "desc" };
// Compare selections.
const compare = { a: "jawa-barat", b: "jawa-timur" };

const ROUTES = [
  { match: /^#\/?$/, nav: "overview", render: () => overviewView() },
  { match: /^#\/provinces$/, nav: "provinces", render: () => provincesView(explorer), wire: wireExplorer },
  { match: /^#\/province\/([a-z-]+)$/, nav: "provinces", render: (m) => provinceView(m[1]) },
  { match: /^#\/economy$/, nav: "economy", render: () => economyView() },
  { match: /^#\/people$/, nav: "people", render: () => peopleView() },
  { match: /^#\/compare$/, nav: "compare", render: () => compareView(compare.a, compare.b), wire: wireCompare },
  { match: /^#\/sources$/, nav: "sources", render: () => sourcesView() },
];

function wireExplorer() {
  const search = document.getElementById("prov-search");
  const region = document.getElementById("prov-region");
  if (search) {
    search.addEventListener("input", () => {
      explorer.query = search.value;
      render(true);
      const again = document.getElementById("prov-search");
      if (again) { again.focus(); again.setSelectionRange(again.value.length, again.value.length); }
    });
  }
  if (region) {
    region.addEventListener("change", () => {
      explorer.region = region.value;
      render(true);
    });
  }
  document.querySelectorAll(".sort-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const k = btn.dataset.sort;
      if (explorer.sortKey === k) {
        explorer.sortDir = explorer.sortDir === "asc" ? "desc" : "asc";
      } else {
        explorer.sortKey = k;
        explorer.sortDir = k === "name" ? "asc" : "desc";
      }
      render(true);
    });
  });
}

function wireCompare() {
  const selA = document.getElementById("cmp-a");
  const selB = document.getElementById("cmp-b");
  if (selA) selA.addEventListener("change", () => { compare.a = selA.value; render(true); });
  if (selB) selB.addEventListener("change", () => { compare.b = selB.value; render(true); });
}

function render(keepScroll = false) {
  const hash = location.hash || "#/";
  const route = ROUTES.find((r) => r.match.test(hash));
  const m = route ? hash.match(route.match) : null;
  app.innerHTML = route ? route.render(m) : notFoundView();
  document.querySelectorAll(".site-nav a").forEach((a) => {
    a.classList.toggle("active", route !== undefined && a.dataset.nav === route.nav);
  });
  if (route && route.wire) route.wire();
  if (!keepScroll) window.scrollTo(0, 0);
  document.title = "Peta Angka — Indonesia statistics";
  window.__shotReady = true;
}

window.addEventListener("hashchange", () => render());
render();
