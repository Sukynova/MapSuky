import { initCamera, viewBox } from "./camera.js";
import { iniciarAppLoop } from "./appLoop.js";

import { checkUpdate } from "./updater.js";


export let svg;
export let mapLayer;
export let areasLayer;
export let machinesLayer;


export function loadMap() {

  console.log("Renderer cargado");

  const app = document.getElementById("app");

  if (!app) {
    console.error("No se encontró #app");
    return;
  }

  // ===== SVG =====

  svg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );

  svg.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`
  );

  const background = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );

  background.setAttribute("x", 0);
  background.setAttribute("y", 0);
  background.setAttribute("width", 2000);
  background.setAttribute("height", 2000);
  background.setAttribute("fill", "transparent");

  svg.appendChild(background);

  mapLayer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  areasLayer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  areasLayer.style.display = "none";
  window.areasVisibles = false;

  machinesLayer = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );

  svg.appendChild(mapLayer);
  svg.appendChild(areasLayer);
  svg.appendChild(machinesLayer);

  svg.style.userSelect = "none";
  svg.style.webkitUserSelect = "none";
  svg.style.msUserSelect = "none";

  app.appendChild(svg);

  window.viewBox = viewBox;

  initCamera(svg);

  // ===== GLOBAL =====

  window.svg = svg;
  window.mapLayer = mapLayer;
  window.areasLayer = areasLayer;
  window.machinesLayer = machinesLayer;

  // ===== CAMERA =====

  initCamera(svg);

  // ===== CARGAR MAPA =====

  fetch("assets/mapa.svg")
    .then(r => r.text())
    .then(text => {

      const parser = new DOMParser();

      const doc = parser.parseFromString(
        text,
        "image/svg+xml"
      );

      const extSvg = doc.documentElement;

      Array.from(extSvg.childNodes).forEach(n => {

        if (n.nodeType !== 1) return;

        const imported =
          document.importNode(n, true);

        if (
          imported.tagName === "g" &&
          imported.id &&
          imported.id.startsWith("AREA_")
        ) {

          imported.setAttribute(
            "pointer-events",
            "none"
          );

          areasLayer.appendChild(imported);

        } else {

          mapLayer.appendChild(imported);

        }

      });

      // ===== CREAR MAQUINAS =====

      Object.values(maquinas).forEach(m => {

        if (
          m.info.ESTADO !== "FUERA_DE_SALA"
        ) {

          window.crearMaquina(m);

        }

      });

      // ===== DETECTAR AREAS =====

      Object.values(maquinas).forEach(m => {

        const g =
          document.querySelector(
            `[data-id="${m.id}"]`
          );

        if (!g) return;

        const box = g.getBBox();

        const cx =
          box.x + box.width / 2;

        const cy =
          box.y + box.height / 2;

        m.layout.area =
          window.detectarArea(
            cx,
            cy,
            g
          );

      });

      console.log(
        "Áreas detectadas:",
        areasLayer.querySelectorAll(
          "g[id^='AREA_']"
        )
      );

      // ===== AJUSTAR VIEWBOX =====

      
    });

    checkUpdate();
    iniciarAppLoop();
    window.rendererReady = true;
    window.dispatchEvent(new Event("rendererReady"));

  }
