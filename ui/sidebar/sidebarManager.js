import { renderInfo } from "./sidebarInfo.js";
import { renderLicencia } from "./sidebarLicencia.js";
import { renderMultiple } from "./sidebarMultiple.js";
import { bindLicenciaEvents } from "./sidebarEvents.js";
import { bindEditEvents } from "./sidebarEditEvents.js";
import { bindMultipleEvents } from "./sidebarMultipleEvents.js";

// ================= INDIVIDUAL =================
export function mostrarSidebarIndividual(m) {

  renderInfo(m);
  renderLicencia(m);

  // 🔥 activar eventos
  bindLicenciaEvents(m);
  bindEditEvents(m);
}

// ================= MULTIPLE =================
export function mostrarSidebarMultiple(ids) {

  renderMultiple(ids);
  bindMultipleEvents(ids);

}

// ================= LIMPIAR =================
export function limpiarSidebarUI() {

  document.getElementById("tab-info").innerHTML =
    "<em>Selecciona una máquina</em>";

  document.getElementById("tab-licencia").innerHTML = "";

}