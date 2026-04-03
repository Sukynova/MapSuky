export function renderMultiple(ids) {

  document.getElementById("tab-info").innerHTML = `
    <strong>Selección múltiple</strong>

    <div id="lista-seleccionadas" style="margin-bottom:10px;">
      ${ids.map(id => `<div>${id}</div>`).join("")}
    </div>

    <label>Elegir Master:</label>
    <select id="master-select" style="width:100%;margin-bottom:6px;">
      ${ids.map(id => `<option value="${id}">${id}</option>`).join("")}
    </select>

    <button id="btn-assign-master" class="btn-primary">
      Asignar Master
    </button>

    <button id="btn-independiente" class="btn-primary"
            style="margin-top:6px;background:#555;">
      Volver Independientes
    </button>
  `;

  document.getElementById("tab-licencia").innerHTML = `
    <div class="info-row">
      <span>Total (h)</span>
      <input id="lic-total" type="number" value="1">
    </div>

    <div class="info-row">
      <span>Aviso (h)</span>
      <input id="lic-aviso" type="number" value="0.5">
    </div>

    <div class="info-row">
      <span>Rojo (h)</span>
      <input id="lic-rojo" type="number" value="0.1">
    </div>

    <button id="start-lic" class="btn-primary">
      Iniciar (${ids.length})
    </button>
  `;
}