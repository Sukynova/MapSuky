
export function inicializarExpansion() {

  console.log("🚀 DLC v1.1 cargado correctamente");

  conectarBotonAdmin();
}

function conectarBotonAdmin() {

  const btn = document.getElementById("btn-clear-history");

  if (!btn) return;

  btn.onclick = () => {
    abrirPanelAdmin();
  };
}

function abrirPanelAdmin() {

  const modal = document.getElementById("ramclear-modal");
  const content = document.getElementById("ramclear-content");

  content.innerHTML = `
    <h3>🔐 Panel Administrativo</h3>

    <button id="admin-historial" class="btn-primary">
      Ver Historial RAM CLEAR
    </button>

    <button id="admin-fuera" class="btn-primary" style="margin-top:8px;">
      Ver FUERA_DE_SALA
    </button>

    <button id="admin-cerrar" class="btn-primary"
            style="margin-top:12px;background:#444;">
      Cerrar
    </button>
  `;

  modal.style.display = "flex";

  document.getElementById("admin-cerrar").onclick = () => {
    modal.style.display = "none";
  };

  document.getElementById("admin-historial").onclick = () => {
    abrirVistaHistorial();
  };

  document.getElementById("admin-fuera").onclick = () => {
    abrirVistaFuera();
  };
}

function abrirVistaHistorial() {

  const modal = document.getElementById("ramclear-modal");
  const content = document.getElementById("ramclear-content");

  const historial = window.ramClearHistory || [];

  let html = `
    <h3>Historial RAM CLEAR</h3>
    <div style="max-height:300px;overflow:auto;font-size:12px;">
  `;

  const eventosVisibles = historial
    .map(e => ({ ...e }))
    .filter(e => e.momento === "DESPUES");

  if (eventosVisibles.length === 0) {
    html += `<p>No hay eventos registrados.</p>`;
  } else {

    eventosVisibles.forEach(e => {

      html += `
        <div style="border-bottom:1px solid #333;padding:6px 0;">
          <strong>${e.id}</strong> - ${e.tipo}<br>
          ${new Date(e.fecha).toLocaleString()}
          <button data-fecha="${e.fecha}" class="btn-del"
                  style="float:right;background:#b71c1c;border:none;color:white;padding:2px 6px;cursor:pointer;">
            ✖
          </button>
        </div>
      `;

    });

  }

  html += `
    </div>

    <button id="admin-volver" class="btn-primary"
            style="margin-top:10px;background:#444;">
      Volver
    </button>
  `;

  content.innerHTML = html;

  document.getElementById("admin-volver").onclick = () => {
    document.getElementById("ramclear-modal").style.display = "none";
  };

  document.querySelectorAll(".btn-del").forEach(btn => {
    btn.onclick = () => {

      const fecha = parseInt(btn.dataset.fecha);

      eliminarEventoPorFecha(fecha);

    };
  });
}

function eliminarEventoPorFecha(fecha) {

  if (!confirm("¿Eliminar este evento?")) return;

  window.ramClearHistory =
    window.ramClearHistory.filter(e => e.fecha !== fecha);

  guardarProyecto();
  abrirVistaHistorial();
}

function abrirVistaFuera() {

  const modal = document.getElementById("ramclear-modal");
  const content = document.getElementById("ramclear-content");

  const maquinas = window.maquinas || {};

  const fuera = Object.values(window.maquinas)
    .filter(m => m.info.ESTADO === "FUERA_DE_SALA");

  let html = `
    <h3>Máquinas FUERA_DE_SALA</h3>
    <div style="max-height:300px;overflow:auto;font-size:12px;">
  `;

  if (fuera.length === 0) {
    html += `<p>No hay máquinas fuera de sala.</p>`;
  } else {
    fuera.forEach(m => {
    html += `
        <div style="border-bottom:1px solid #333;padding:6px 0;">
        <strong>${m.id}</strong>

        <button data-id="${m.id}" class="btn-reactivar"
                style="margin-left:10px;background:#4caf50;border:none;color:white;padding:2px 6px;cursor:pointer;">
            Reactivar
        </button>

        <button data-id="${m.id}" class="btn-eliminar"
                style="margin-left:5px;background:#b71c1c;border:none;color:white;padding:2px 6px;cursor:pointer;">
            Eliminar
        </button>
        </div>
    `;
    });
    
  }

  html += `
    </div>

    <button id="admin-volver" class="btn-primary"
            style="margin-top:10px;background:#444;">
      Volver
    </button>
  `;

  content.innerHTML = html;

    document.querySelectorAll(".btn-reactivar").forEach(btn => {
    btn.onclick = () => reactivarMaquina(btn.dataset.id);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
    btn.onclick = () => eliminarMaquinaPermanente(btn.dataset.id);
    });
  document.getElementById("admin-volver").onclick = () => {
    document.getElementById("ramclear-modal").style.display = "none";
  };
}

export function sincronizarColumnas() {

  const columnas = window.columnasExcel;
  const maquinas = window.maquinas;

  if (!columnas || !maquinas) return;

  Object.values(maquinas).forEach(m => {

    columnas.forEach(col => {

      if (col === "ID") return;

      if (!(col in m.info)) {
        m.info[col] = "";
      }

    });

  });

  console.log("✔ Columnas sincronizadas correctamente");
}

function reactivarMaquina(id) {

  if (!confirm("¿Reactivar máquina?")) return;

  const maquinas = window.maquinas;
  const m = maquinas[id];
  if (!m) return;

  // 1️⃣ Cambiar estado
  m.info.ESTADO = "OK";

  // 2️⃣ Sincronizar columnas
  if (window.columnasExcel) {
    window.columnasExcel.forEach(col => {
      if (col === "id") return;
      if (!(col in m.info)) {
        m.info[col] = "";
      }
    });
  }

// 3️⃣ Buscar SVG existente
let g = document.querySelector(`[data-id="${id}"]`);

// 4️⃣ Si no existe → crear
if (!g && typeof window.crearMaquina === "function") {
  window.crearMaquina(m);
  g = document.querySelector(`[data-id="${id}"]`);
}

// 5️⃣ Si existe → mostrarlo
if (g) {
  g.style.display = "block";
}

//aplicar filtros 
if (window.aplicarFiltros){
  window.aplicarFiltros();
}

  // 5️⃣ Guardar
  window.guardarProyecto();

  // 6️⃣ Refrescar vista fuera de sala
  abrirVistaFuera();

  // 7️⃣ Buscar automáticamente la máquina reactivada
  setTimeout(() => {

    if (window.buscarMaquinaPorID) {
      window.buscarMaquinaPorID(id);
    }

  }, 50);

}

function eliminarMaquinaPermanente(id) {

  if (!confirm("¿Eliminar permanentemente?")) return;

  const maquinas = window.maquinas;
  const m = maquinas[id];

  if (!m) return;

  if (typeof window.hacerIndependiente === "function") {
    window.hacerIndependiente(id);
    actualizarIndicadoresMaster();
  }

  // romper relación master/slave

  if (m.layout.master) {
    const master = maquinas[m.layout.master];
    if (master) {
      master.layout.slaves =
        master.layout.slaves.filter(s => s !== id);
    }
  }

  const g = document.querySelector(`[data-id="${id}"]`);
  if (g) g.remove();

  delete maquinas[id];

  guardarProyecto();

  abrirVistaFuera();
}

window.abrirVistaHistorial = abrirVistaHistorial;
window.abrirVistaFuera = abrirVistaFuera;

window.adminAPI = {
  abrirVistaFuera,
  abrirVistaHistorial
};