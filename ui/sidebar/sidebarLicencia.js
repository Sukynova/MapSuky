export function renderLicencia(m) {

  document.getElementById("tab-licencia").innerHTML = `
    <div class="info-row">
      <span>Total (h)</span>
      <input id="lic-total" type="number"
        value="${Math.round((m.licencia.totalMin || 0) / 60)}">
    </div>

    <div class="info-row">
      <span>Aviso (h)</span>
      <input id="lic-aviso" type="number"
        value="${Math.round((m.licencia.avisoMin || 0) / 60)}">
    </div>

    <div class="info-row">
      <span>Rojo (h)</span>
      <input id="lic-rojo" type="number"
        value="${Math.round((m.licencia.rojoMin || 0) / 60)}">
    </div>

    <div id="licencia-info">
    </div>

    <button id="start-lic" class="btn-primary">
      Iniciar / Reset
    </button>

    <button id="btn-permanente" class="btn-primary" 
            style="margin-top:6px;background:#444;">
      Licencia Permanente
    </button>
  `;

}