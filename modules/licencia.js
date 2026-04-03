export function estadoLicencia(m) {
  if (m.licencia.permanente) return "OK"; // se comporta como normal
  if (!m.licencia.activa) return "SIN";

  const ahora = Date.now();
  const transcurridoMin =
    (ahora - m.licencia.inicio) / 60000;

  const restante =
    m.licencia.totalMin - transcurridoMin;

  if (restante <= 0) return "VENCIDA";
  if (restante <= m.licencia.avisoMin) return "AVISO";
  return "OK";
}

export function actualizarTimebombs() {

  Object.values(maquinas).forEach(m => {

    if (m.info.ESTADO === "FUERA_DE_SALA") return;

    // 🔥 calcular restante SIEMPRE
    if (m.licencia.activa && !m.licencia.permanente) {

      const ahora = Date.now();

      const transcurridoMin =
        (ahora - m.licencia.inicio) / 60000;

      m.licencia.restante =
        m.licencia.totalMin - transcurridoMin;

    }

    const estado = estadoLicencia(m);

    const g = document.querySelector(`[data-id="${m.id}"]`);
    if (!g) return;

    const label = g.querySelector(".machine-id");
    if (!label) return;

    if (estado === "OK") label.setAttribute("fill", "#000");
    if (estado === "AVISO") label.setAttribute("fill", "#ff9800");
    if (estado === "VENCIDA") label.setAttribute("fill", "#999");

  });

}

export function actualizarVistaLicencia(m) {

  const div = document.getElementById("licencia-info");
  if (!div) return;

  if (!window.seleccionada || window.seleccionada.dataset.id !== m.id) return;

  if (!m.licencia.activa) {
    div.textContent = "Licencia inactiva";
    return;
  }

  const totalMin = Math.floor(m.licencia.restante || 0);

  const horas = Math.floor(totalMin / 60);
  const minutos = totalMin % 60;

  div.textContent =
    `Tiempo restante: ${horas}:${minutos
      .toString()
      .padStart(2, "0")}`;
}

export function actualizarColorLicencia(g, m) {
  if (m.licencia.permanente) {
    const label = g.querySelector(".machine-id");
    if (label) label.setAttribute("fill", "#000");
    return;
  }

  const label = g.querySelector(".machine-id");
  
  if (!label) return;

  const r = m.licencia.restante;

  if (!m.licencia.activa) {
    label.setAttribute("fill", "#000");
  } else if (r <= 0) {
    label.setAttribute("fill", "#9e9e9e");
  } else if (r <= m.licencia.rojoMin) {
    label.setAttribute("fill", "#f44336");
  } else if (r <= m.licencia.avisoMin) {
    label.setAttribute("fill", "#ff9800");
  } else {
    label.setAttribute("fill", "#000");
  }
}

export function iniciarLicencia(m) {
  m.licencia.totalMin = +document.getElementById("lic-total").value;
  m.licencia.avisoMin = +document.getElementById("lic-aviso").value;
  m.licencia.rojoMin  = +document.getElementById("lic-rojo").value;

  m.licencia.inicio = Date.now();
  m.licencia.activa = true;
  m.licencia.restante = m.licencia.totalMin; // 👈 CLAVE
}

export function resetLicencia(ids) {
  const ahora = Date.now();

  ids.forEach(id => {
    const m = maquinas[id];
    m.licencia.inicio = ahora;
    m.licencia.activa = true;
  });
}

export function aplicarRotacionMasiva() {
  const rot = +document.getElementById("rot").value || 0;
  const ids = obtenerIdsSeleccionados();

  ids.forEach(id => {
    const m = maquinas[id];
    m.layout.rot = rot;
    actualizarTransformacion(m);
  });
}

export function iniciarLicenciaMasiva() {
  const ids = obtenerIdsSeleccionados();
  ids.forEach(id => {
    const m = maquinas[id];
    if (!m) return;
    iniciarLicencia(m); // 🔥 reutiliza la buena
  });

  // 🔥 limpiar selección
  window.seleccionadas.clear();
  window.seleccionMultiple = false;
  document.querySelectorAll(".multi-selected")
    .forEach(el => el.classList.remove("multi-selected"));
  if (window.limpiarSidebar) {
    window.limpiarSidebar();
  }
}
