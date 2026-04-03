const SEARCH_ZOOM_SIZE = 300; 

export function aplicarFiltros() {

  const area = document.getElementById("filtro-area").value;
  const selectEstado = document.getElementById("filtro-estado");
  if (!selectEstado) return;

  const estadoSeleccionado = selectEstado.value;
  document.querySelectorAll("[data-id]").forEach(g => {

    const id = g.dataset.id;
    if (!id || !maquinas[id]) return;

    const m = maquinas[id];

    if (m.info.ESTADO === "FUERA_DE_SALA"){
      g.style.display = "none";
      return;
    }

    const pasaArea =
    area === "TODAS" ||
    (m.layout.area || "").toUpperCase() === area.toUpperCase();

    let pasaEstado = true;

    if (estadoSeleccionado === "TODOS") {
      pasaEstado = true;
    }
    else if (estadoSeleccionado === "MASTER") {
      pasaEstado = m.layout.slaves.length > 0;
    }
    else {
      const estadoNormal = normalizarEstado(m.info.ESTADO || "");
      pasaEstado =
        estadoSeleccionado === "TODOS" ||
        estadoNormal === estadoSeleccionado.toUpperCase();
    }

    g.style.display = (pasaArea && pasaEstado)
      ? "inline"
      : "none";

  });
}

export function buscarMaquinaPorID(id) {

  if (!maquinas[id]) return;

  const m = maquinas[id];
  const g = document.querySelector(`[data-id="${m.id}"]`);
  if (!g) return;

  // seleccionar máquina
  seleccionarMaquina(g);

  // forzar tab info
  document.querySelectorAll("#tabs button")
    .forEach(b => b.classList.remove("active"));
  document.querySelector('[data-tab="info"]').classList.add("active");

  document.querySelectorAll(".tab")
    .forEach(t => t.classList.remove("active"));
  document.getElementById("tab-info").classList.add("active");

  // zoom
  viewBox.w = SEARCH_ZOOM_SIZE;
  viewBox.h = SEARCH_ZOOM_SIZE;
  viewBox.x = m.layout.x - SEARCH_ZOOM_SIZE / 2;
  viewBox.y = m.layout.y - SEARCH_ZOOM_SIZE / 2;
  updateViewBox();

  // destello
  g.classList.add("multi-selected");
  setTimeout(() => g.classList.remove("multi-selected"), 1200);

}

export function actualizarFiltroEstados() {

  const select = document.getElementById("filtro-estado");
  if (!select) return;

  const estadosUnicos = new Set();

  Object.values(maquinas).forEach(m => {

    if (!m.info.ESTADO) return;

    const estadoNormal = normalizarEstado(m.info.ESTADO);

    if (estadoNormal !== "") {
      estadosUnicos.add(estadoNormal);
    }

  });

  select.innerHTML = `
    <option value="TODOS">TODOS</option>
    <option value="MASTER">MASTER</option>
  `;

  estadosUnicos.forEach(est => {
    select.innerHTML += `<option value="${est}">${est}</option>`;
  });

  select.dispatchEvent(new Event("change"));
}

export function normalizarEstado(valor) {
  if (!valor) return "";

  return valor
    .toString()
    .trim()
    .toUpperCase();
}

