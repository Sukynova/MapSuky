export function bindMultipleEvents(ids) {

  const btnMaster = document.getElementById("btn-assign-master");
  const btnInd = document.getElementById("btn-independiente");
  const btnStart = document.getElementById("start-lic");

  // ================= MASTER =================
  if (btnMaster) {
    btnMaster.onclick = () => {

      const masterId = document.getElementById("master-select").value;

      if (ids.length < 2) return;

      ids.forEach(id => window.hacerIndependiente(id));
      window.actualizarIndicadoresMaster();

      const master = window.maquinas[masterId];

      master.layout.slaves = ids.filter(id => id !== masterId);

      master.layout.slaves.forEach(id => {
        window.maquinas[id].layout.master = masterId;
      });

      window.actualizarIndicadoresMaster();

      limpiarSeleccionUI();

      window.showToast(`✔ ${masterId} ahora es Master`);
    };
  }

  // ================= INDEPENDIENTE =================
  if (btnInd) {
    btnInd.onclick = () => {

      ids.forEach(id => window.hacerIndependiente(id));

      window.actualizarIndicadoresMaster();

      limpiarSeleccionUI();

      window.showToast("✔ Máquinas independientes");
    };
  }

  // ================= TIMEBOMB =================
  if (btnStart) {
    btnStart.onclick = () => {

      const ahora = Date.now();

      const total = +document.getElementById("lic-total").value;
      const aviso = +document.getElementById("lic-aviso").value;
      const rojo = +document.getElementById("lic-rojo").value;

      ids.forEach(id => {

        const m = window.maquinas[id];

        m.licencia.permanente = false;

        m.licencia.totalMin = total * 60;
        m.licencia.avisoMin = aviso * 60;
        m.licencia.rojoMin  = rojo * 60;

        m.licencia.inicio = ahora;
        m.licencia.activa = true;
        m.licencia.restante = m.licencia.totalMin;

        const g = document.querySelector(`[data-id="${id}"]`);
        if (g && window.actualizarColorLicencia) {
          window.actualizarColorLicencia(g, m);
        }

      });

      limpiarSeleccionUI();

      window.showToast(`✔ TimeBomb aplicado (${total}h)`);
    };
  }

}


// ================= LIMPIEZA GLOBAL =================
function limpiarSeleccionUI() {

  window.seleccionadas.clear();
  window.seleccionMultiple = false;
  window.seleccionada = null;

  document.querySelectorAll(".multi-selected")
    .forEach(g => g.classList.remove("multi-selected"));

  const btn = document.getElementById("btn-select");
  if (btn) btn.style.background = "";

  if (window.limpiarSidebar) {
    window.limpiarSidebar();
  }

}