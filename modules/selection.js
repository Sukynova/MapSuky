import { maquinas } from "../core/dataStore.js";

window.seleccionMultiple = false;
window.seleccionada = null;
window.seleccionadas = new Set();


export function obtenerIdsSeleccionados() {

  if (seleccionMultiple && seleccionadas.size > 0) {
    return [...seleccionadas];
  }

  if (seleccionada) {
    return [seleccionada.dataset.id];
  }

  return [];

}

export function seleccionarMaquina(g) {

  document.getElementById("sidebar").style.display = "block";

  if (seleccionada) {
    seleccionada.classList.remove("selected");
  }

  seleccionada = g;

  g.classList.add("selected");

  const m = maquinas[g.dataset.id];

  if (!m) return;

  if (window.getCentroReal && window.detectarArea) {

    const centro =
      window.getCentroReal(g);

    m.layout.area =
      window.detectarArea(
        centro.x,
        centro.y,
        g
      );

  }

  if (window.mostrarInfo) {
    window.mostrarInfo(m);
  }

  if (
    m.licencia &&
    m.licencia.activa &&
    window.actualizarVistaLicencia
  ) {
    window.actualizarVistaLicencia(m);
  }

}

window.limpiarSeleccionMultiple = function() {

  // 🔥 estado lógico
  window.seleccionMultiple = false;

  // 🔥 limpiar set
  if (window.seleccionadas) {
    window.seleccionadas.clear();
  }

  // 🔥 quitar clases visuales
  document.querySelectorAll(".multi-selected")
    .forEach(el => el.classList.remove("multi-selected"));

  // 🔥 reset botón
  const btn = document.getElementById("btn-select");
  if (btn) btn.style.background = "";

  // 🔥 limpiar sidebar
  if (window.limpiarSidebar) {
    window.limpiarSidebar();
  }

};

window.seleccionMultiple = seleccionMultiple;
window.seleccionada = seleccionada;
window.seleccionadas = seleccionadas;
window.obtenerIdsSeleccionados = obtenerIdsSeleccionados;