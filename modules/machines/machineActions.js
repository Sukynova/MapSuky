export function eliminarMaquina(m) {

  if (!confirm("Eliminar máquina?")) return;

  window.hacerIndependiente(m.id);

  m.info.ESTADO = "FUERA_DE_SALA";

  const g = document.querySelector(`[data-id="${m.id}"]`);
  if (g) g.style.display = "none";

  if (window.aplicarFiltros) {
    window.aplicarFiltros();
  }

  window.actualizarIndicadoresMaster();
  window.guardarProyecto();

}


export function rotarMaquina(m) {

  const ang = prompt(
    "Rotación (0-359):",
    m.layout.rot || 0
  );

  if (ang === null) return;

  const rot = Number(ang) || 0;

  const esMultiple = window.seleccionadas && window.seleccionadas.size > 1;

  if (esMultiple) {

    const ids = window.obtenerIdsSeleccionados();

    ids.forEach(id => {
      const mm = window.maquinas[id];
      if (!mm) return;

      mm.layout.rot = rot;
      window.actualizarTransformacion(mm);
    });

  } else {

    m.layout.rot = rot;
    window.actualizarTransformacion(m);

  }

}


export function duplicarMaquina(m) {
  window.clonarMaquina(m.id);
}


export function aplicarRamClearAction(m) {
  window.abrirRamClear(m);
}