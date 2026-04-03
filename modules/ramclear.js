export function abrirRamClear(m) {

  console.log("inicio:", m.licencia.inicio);
  console.log("activa:", m.licencia.activa);
  console.log("permanente:", m.licencia.permanente);

  const modal = document.getElementById("ramclear-modal");
  const content = document.getElementById("ramclear-content");

  // 🔥 LIMPIAR TODO SIEMPRE
  content.innerHTML = "";
  modal.querySelectorAll(".ramclear-footer").forEach(f => f.remove());

  const hayTimebomb =
    m.licencia.activa && !m.licencia.permanente;

  let html = `<h3>RAM CLEAR ${m.id}</h3>`;

  // ==========================================
  // TIENE TIMEBOMB ACTIVO
  // ==========================================
  if (hayTimebomb) {

    html += `
      <p>La máquina tiene TimeBomb activo.</p>

      <button id="rc-full" class="btn-primary"
              style="margin-bottom:8px;">
        RAM CLEAR FULL (48h)
      </button>

      <button id="rc-parcial" class="btn-primary"
              style="background:#555;">
        RAM CLEAR PARCIAL
      </button>
    `;
  }

  // ==========================================
  // NO TIENE TIMEBOMB
  // ==========================================
  else {

    html += `
      <p>No tiene TimeBomb activo.</p>

      <button id="rc-full" class="btn-primary">
        RAM CLEAR FULL
      </button>
    `;
  }

  html += `
    <button id="rc-cancel" class="btn-primary"
            style="margin-top:12px;background:#444;">
      Cancelar
    </button>
  `;

  content.innerHTML = html;
  modal.style.display = "flex";

  document.getElementById("rc-cancel").onclick = () => {
    modal.style.display = "none";
  };

  const btnFull = document.getElementById("rc-full");
  if (btnFull) {
    btnFull.onclick = () => {
      abrirEditorRamClear(m, "FULL");
    };
  }

  const btnParcial = document.getElementById("rc-parcial");
  if (btnParcial) {
    btnParcial.onclick = () => {
      abrirEditorRamClear(m, "PARCIAL");
    };
  }
}

export function aplicarRamClear(m, tipo) {

  const hayTimebomb =
    m.licencia &&
    m.licencia.activa &&
    !m.licencia.permanente;

  // ==========================================
  // PARCIAL
  // ==========================================
  if (tipo === "PARCIAL") {

    showToast("RAM CLEAR PARCIAL aplicado", "#ff9800");
    guardarProyecto();
    actualizarFiltroEstados();
    aplicarFiltros();
    return;
  }

  // ==========================================
  // FULL
  // ==========================================
  if (tipo === "FULL") {

    // Si hay timebomb → aplicar 48h
    if (hayTimebomb) {

      // 🔥 reiniciar completamente licencia

      m.licencia.totalMin = 48 * 60;
      m.licencia.avisoMin = 5;
      m.licencia.rojoMin = 1;

      m.licencia.inicio = Date.now();
      m.licencia.restante = 48 * 60;

      m.licencia.activa = true;
      m.licencia.permanente = false;


      // 🔥 MUY IMPORTANTE → forzar recalculo inmediato
      m.licencia._forzarReset = Date.now();


      showToast("RAM CLEAR FULL → 48h aplicado", "#f44336");
    }

    // Si no hay timebomb → no tocar licencia
    else {
      showToast("RAM CLEAR FULL aplicado", "#ff5722");
    }

    guardarProyecto();

    actualizarFiltroEstados();
    aplicarFiltros();
  }
}

export function abrirEditorRamClear(m, tipo) {

  const modal = document.getElementById("ramclear-modal");
  const content = document.getElementById("ramclear-content");

  // 🔥 limpiar completamente contenido previo
  content.innerHTML = "";

  // 🔥 eliminar footers anteriores si existen
  modal.querySelectorAll(".ramclear-footer").forEach(f => f.remove());

  // clonamos estado anterior
  const datosAntes = JSON.parse(JSON.stringify(m));

  let html = `
    <h3>RAM CLEAR ${tipo} - ${m.id}</h3>

    <div style="display:flex;gap:20px;margin-bottom:15px;">

      <div style="flex:1;">
        <h4>ANTES</h4>
        ${generarVistaDatos(datosAntes, false)}
      </div>

      <div style="flex:1;">
        <h4>DESPUÉS</h4>
        ${generarVistaDatos(m, true)}
      </div>

    </div>
  `;

  content.innerHTML = html;

  // Crear botones fijos
  const footer = document.createElement("div");
  footer.style.marginTop = "10px";
  footer.classList.add("ramclear-footer");

  footer.innerHTML = `
    <button id="rc-guardar" class="btn-primary">
      Aceptar Cambios
    </button>

    <button id="rc-cancel" class="btn-primary"
            style="margin-top:6px;background:#444;">
      Cancelar
    </button>
  `;
  
  content.parentElement.appendChild(footer);

  content.innerHTML = html;
  modal.style.display = "flex";

  document.getElementById("rc-cancel").onclick = () => {
    modal.style.display = "none";
    document.querySelectorAll(".ramclear-footer").forEach(f => f.remove());
  };

  document.getElementById("rc-guardar").onclick = () => {

    if (!confirm("¿Seguro aplicar RAM CLEAR?")) return;

    const datosAntes = JSON.parse(JSON.stringify(m));

    // 🔥 copiar inputs
    document.querySelectorAll("[data-key]").forEach(input => {

      const key = input.dataset.key;
      if (!key) return;
      if (key === "id") return;
      if (key === "area") return;

      m.info[key] = input.value;

    });

    // 🔥 ahora sí actualizar fecha
    m.info.ULTIMO_RAM_CLEAR = new Date().toLocaleString();

    registrarEventoRamClear(datosAntes, m, tipo);

    if (tipo === "FULL") {

      const hayTimebomb =
        m.licencia &&
        m.licencia.activa &&
        !m.licencia.permanente;

      //solo si hay timebomb aplica las 48 horas :D

      if (hayTimebomb){
      
        m.licencia.totalMin = 48 * 60;
        m.licencia.avisoMin = 5;
        m.licencia.rojoMin = 1;

        m.licencia.inicio = Date.now();
        m.licencia.activa = true;
        m.licencia.permanente = false;

        m.licencia.restante = 48 * 60;
      }
    
    }
    document.querySelectorAll(".ramclear-footer").forEach(f => f.remove());

    guardarProyecto();
    actualizarFiltroEstados();
    aplicarFiltros();

    modal.style.display = "none";

    if (window.seleccionada) {
      const idActual = window.seleccionada.dataset.id;
      if (window.maquinas[idActual]) {
        mostrarInfo(window.maquinas[idActual]);
      }
    }
    showToast("✔ RAM CLEAR aplicado", "#ff5722");
  };
}

export function generarVistaDatos(m, editable) {

  let html = "";

  // ID (no editable nunca)
  html += `
    <div style="margin-bottom:6px;">
      <label style="font-size:11px;">ID</label>
      <input value="${m.id}" disabled
             style="width:100%;font-size:12px;">
    </div>
  `;

  // AREA (no editable nunca)
  html += `
    <div style="margin-bottom:6px;">
      <label style="font-size:11px;">AREA</label>
      <input value="${m.layout.area ?? "SIN_AREA"}" disabled
             style="width:100%;font-size:12px;">
    </div>
  `;

  Object.keys(m.info).forEach(key => {

    const nombre = key.trim().toUpperCase();

    // 🔥 NO mostrar ultimo_ram_clear en RAM CLEAR
    if (nombre === "ULTIMO_RAM_CLEAR") return;

    html += `
      <div style="margin-bottom:6px;">
        <label style="font-size:11px;">${key}</label>
        <input 
          data-key="${key}"
          value="${m.info[key] ?? ""}"
          ${editable ? "" : "disabled"}
          style="width:100%;font-size:12px;">
      </div>
    `;
  });

  return html;
}

export function registrarEventoRamClear(antes, despues, tipo) {

  if (!window.ramClearHistory) {
    window.ramClearHistory = [];
  }

  const fechaEvento = Date.now();

  // ===== FILA ANTES =====
  window.ramClearHistory.push({
    id: antes.id,
    momento: "ANTES",
    tipo,
    fecha: fechaEvento,
    info: JSON.parse(JSON.stringify(antes.info))
  });

  // ===== FILA DESPUÉS =====
  window.ramClearHistory.push({
    id: despues.id,
    momento: "DESPUES",
    tipo,
    fecha: fechaEvento,
    info: JSON.parse(JSON.stringify(despues.info))
  });

  guardarProyecto();
}
