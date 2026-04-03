import { maquinas } from "../core/dataStore.js";

export function haySeleccion() {

  return (
    window.seleccionadas.size > 0 ||
    window.seleccionada !== null
  );

}


export function renderListaSeleccionadas() {

  const box =
    document.getElementById(
      "lista-seleccionadas"
    );

  if (!box) return;

  box.innerHTML =
    [...window.seleccionadas]
      .map(
        id => `<div>${id}</div>`
      )
      .join("");

}


export function actualizarIndicadoresMaster() {

  Object.values(maquinas)
    .forEach(m => {

      const g =
        document.querySelector(
          `[data-id="${m.id}"]`
        );

      if (!g) return;

      const text =
        g.querySelector(
          ".role-label"
        );

      const circle =
        g.querySelector("circle");

      if (!text || !circle)
        return;


      if (m.layout.slaves.length > 0) {

        text.textContent = "M";

        circle.setAttribute(
          "fill",
          "gold"
        );

      }

      else if (m.layout.master) {

        text.textContent = "E";

        circle.setAttribute(
          "fill",
          "#4fc3f7"
        );

      }

      else {

        text.textContent = "";

        circle.setAttribute(
          "fill",
          "transparent"
        );

      }

    });

}
window.actualizarIndicadoresMaster = actualizarIndicadoresMaster;

export function hacerIndependiente(id) {

  const m = maquinas[id];


  if (m.layout.master) {

    const master =
      maquinas[m.layout.master];

    master.layout.slaves =
      master.layout.slaves
        .filter(x => x !== id);

    m.layout.master = null;

  }


  if (m.layout.slaves.length > 0) {

    m.layout.slaves.forEach(eid => {

      maquinas[eid]
        .layout.master = null;

    });

    m.layout.slaves = [];

  }

}
window.hacerIndependiente = hacerIndependiente;

export function quitarEsclava(
  masterId,
  slaveId
) {

  const master =
    maquinas[masterId];

  master.layout.slaves =
    master.layout.slaves
      .filter(id => id !== slaveId);

  maquinas[slaveId]
    .layout.master = null;

  actualizarIndicadoresMaster();

}


export function clonarMaquina(
  idOriginal
) {

  const original =
    maquinas[idOriginal];

  const nuevoId =
    prompt("Nuevo ID:");

  if (!nuevoId) return;

  if (maquinas[nuevoId])
    return;


  maquinas[nuevoId] =
    JSON.parse(
      JSON.stringify(original)
    );

  maquinas[nuevoId].id =
    nuevoId;

  maquinas[nuevoId]
    .layout.master = null;

  maquinas[nuevoId]
    .layout.slaves = [];


  window.crearMaquina(
    maquinas[nuevoId]
  );

}