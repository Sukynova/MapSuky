import { maquinas } from "../core/dataStore.js";

const SEARCH_ZOOM_SIZE = 300;


export function initSearch() {

  const btn =
    document.getElementById("search-btn");

  if (!btn) return;


  btn.onclick = () => {

    const input =
      document.getElementById(
        "search-input"
      );

    if (!input) return;

    const id =
      input.value.trim();

    if (!maquinas[id]) return;


    const m = maquinas[id];

    const g =
      document.querySelector(
        `[data-id="${m.id}"]`
      );

    if (!g) return;


    window.seleccionarMaquina(g);


    document
      .querySelectorAll("#tabs button")
      .forEach(b =>
        b.classList.remove("active")
      );


    document
      .querySelector('[data-tab="info"]')
      .classList.add("active");


    document
      .querySelectorAll(".tab")
      .forEach(t =>
        t.classList.remove("active")
      );


    document
      .getElementById("tab-info")
      .classList.add("active");



const pt = window.svg.createSVGPoint();
const centro = window.getCentroReal(g);

pt.x = centro.x;
pt.y = centro.y;

const transformed = pt.matrixTransform(window.svg.getScreenCTM().inverse());

const vb = window.viewBox;

vb.w = SEARCH_ZOOM_SIZE;
vb.h = SEARCH_ZOOM_SIZE;

vb.x = transformed.x - vb.w / 2;
vb.y = transformed.y - vb.h / 2;

window.updateViewBox();


    window.updateViewBox();


    g.classList.add("multi-selected");


    setTimeout(
      () =>
        g.classList.remove(
          "multi-selected"
        ),
      1200
    );

  };

}

