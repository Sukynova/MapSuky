import {
  mostrarSidebarIndividual,
  mostrarSidebarMultiple,
  limpiarSidebarUI
} from "./sidebar/sidebarManager.js";

export function mostrarInfo(m) {
  mostrarSidebarIndividual(m);
}

export function mostrarPanelMultiple() {
  mostrarSidebarMultiple([...seleccionadas]);
}

export function limpiarSidebar() {
  limpiarSidebarUI();
}