let dragging = null;
let dragStart = { x: 0, y: 0 };
let machineStart = [];

import { setPanning } from "../../core/camera.js";

export function bindMachineDrag(g, m, getSVGPoint) {

  g.addEventListener("mousedown", e => {

    e.stopPropagation();

    setPanning(false);

    dragging = g;

    const p = getSVGPoint(e);

    dragStart.x = p.x;
    dragStart.y = p.y;

    machineStart = [];

    if (!window.seleccionMultiple) {

      machineStart.push({
        id: m.id,
        x: m.layout.x,
        y: m.layout.y
      });

    } else {

      const ids = window.obtenerIdsSeleccionados();

      ids.forEach(id => {
        const mm = window.maquinas[id];

        machineStart.push({
          id,
          x: mm.layout.x,
          y: mm.layout.y
        });
      });

    }

  });

}

export function initGlobalDrag(getSVGPoint, actualizarTransformacion) {

  window.addEventListener("mouseup", () => {
    dragging = null;
  });

  window.addEventListener("mousemove", e => {

    if (!dragging) return;

    const p = getSVGPoint(e);

    const dx = p.x - dragStart.x;
    const dy = p.y - dragStart.y;

    machineStart.forEach(start => {

      const m = window.maquinas[start.id];
      if (!m) return;

      m.layout.x = start.x + dx;
      m.layout.y = start.y + dy;

      actualizarTransformacion(m);

    });

  });

}