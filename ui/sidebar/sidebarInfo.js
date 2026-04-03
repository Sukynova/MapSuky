export function renderInfo(m) {

  let infoHTML = `
    <div class="info-row">
      <span>ID</span>
      <input value="${m.id}" disabled>
    </div>
  `;
  
  infoHTML += `
    <div class="info-row">
      <span>AREA</span>
      <input value="${m.layout.area ?? "SIN_AREA"}" disabled>
    </div>
  `;

  if (window.columnasSistema) {
    window.columnasSistema.forEach(col => {
      infoHTML += `
        <div class="info-row">
          <span>${col}</span>
          <input value="${m.info[col] ?? ""}" disabled>
        </div>
      `;
    });
  }

  if (m.info.ULTIMO_RAM_CLEAR !== undefined) {
    infoHTML += `
      <div class="info-row">
        <span>ULTIMO_RAM_CLEAR</span>
        <input value="${m.info.ULTIMO_RAM_CLEAR ?? ""}" disabled>
      </div>
    `;
  }

  // ROL
  if (m.layout.slaves.length > 0) {
    infoHTML += `
      <div class="info-row">
        <span>Rol</span>
        <input value="MASTER" disabled>
      </div>
    `;
  } else if (m.layout.master) {
    infoHTML += `
      <div class="info-row">
        <span>Rol</span>
        <input value="ESCLAVA" disabled>
      </div>
    `;
  } else {
    infoHTML += `
      <div class="info-row">
        <span>Rol</span>
        <input value="INDEPENDIENTE" disabled>
      </div>
    `;
  }

  //botones de guardar y editar
  infoHTML += `
    <button id="btn-edit" class="btn-primary">Editar</button>
    <button id="btn-save" class="btn-primary"
            style="display:none;background:#4caf50;">
      Guardar
    </button>
  `;

  document.getElementById("tab-info").innerHTML = infoHTML;

}