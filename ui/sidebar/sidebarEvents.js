export function bindLicenciaEvents(m) {

  const btnStart = document.getElementById("start-lic");
  const btnPerm = document.getElementById("btn-permanente");

  if (btnStart) {
    btnStart.onclick = () => {

      m.licencia.permanente = false;

      m.licencia.totalMin =
        +document.getElementById("lic-total").value * 60;

      m.licencia.avisoMin =
        +document.getElementById("lic-aviso").value * 60;

      m.licencia.rojoMin =
        +document.getElementById("lic-rojo").value * 60;

      m.licencia.inicio = Date.now();
      m.licencia.activa = true;
      m.licencia.restante = m.licencia.totalMin;

      const g = document.querySelector(`[data-id="${m.id}"]`);
      if (g && window.actualizarColorLicencia) {
        window.actualizarColorLicencia(g, m);
      }

      if (window.guardarProyecto) window.guardarProyecto();

      showToast("✔ TimeBomb iniciado");
    };
  }

  if (btnPerm) {
    btnPerm.onclick = () => {

      m.licencia.permanente = true;
      m.licencia.activa = false;
      m.licencia.inicio = null;
      m.licencia.restante = null;

      const g = document.querySelector(`[data-id="${m.id}"]`);
      if (g && window.actualizarColorLicencia) {
        window.actualizarColorLicencia(g, m);
      }

      showToast("✔ Licencia Permanente Activada");
    };
  }

}