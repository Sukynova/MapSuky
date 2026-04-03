
// modules/columnEditor.js

export function inicializarEditorColumnas() {
  console.log("🧩 Editor de Columnas cargado");

  if (!window.columnasSistema) {
    cargarColumnasSistema();
  }

  conectarBotonEditor();
}

function cargarColumnasSistema() {

  const guardadas = localStorage.getItem("casino_columnas");

  if (guardadas) {

    const parsed = JSON.parse(guardadas);

    // 🔥 Normalizar todo a MAYÚSCULAS
    window.columnasSistema = parsed.map(col =>
      col.toUpperCase()
    );

  } else {

    window.columnasSistema = [
      "ESTADO",
      "MARCA",
      "MODELO",
      "SERIE",
      "JUEGO"
    ];

    guardarColumnasSistema();
  }

}

function guardarColumnasSistema() {

  // 🔹 Guardar estructura
  localStorage.setItem(
    "casino_columnas",
    JSON.stringify(window.columnasSistema)
  );

  // 🔹 Sincronizar TODAS las máquinas existentes
  if (window.maquinas) {

    Object.values(window.maquinas).forEach(m => {

      // 1️⃣ Agregar columnas nuevas si no existen
      window.columnasSistema.forEach(col => {
        if (!(col in m.info)) {
          m.info[col] = "";
        }
      });

      // 2️⃣ Eliminar columnas que ya no existen en el sistema
      Object.keys(m.info).forEach(key => {

        // No tocar campos internos
        if (
          key === "ESTADO" ||
          key === "ULTIMO_RAM_CLEAR"
        ) return;

        if (!window.columnasSistema.includes(key)) {
          delete m.info[key];
        }

      });

    });

  }
  if (!window.columnasSistema.includes("ESTADO")) {
    window.columnasSistema.unshift("ESTADO");
  }
  // 🔹 Guardar proyecto completo
  if (window.guardarProyecto) {
    window.guardarProyecto();
  }

}

function conectarBotonEditor() {

  const btn = document.getElementById("btn-clear-history");
  if (!btn) return;

  btn.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    abrirEditorColumnas();
  });
}

function abrirEditorColumnas() {

  const modal = document.getElementById("ramclear-modal");
  const content = document.getElementById("ramclear-content");

  renderEditor();

  modal.style.display = "flex";

  function renderEditor() {

    let html = `
      <h3>🧩 Editor de Columnas</h3>
      <div id="column-list" style="max-height:300px;overflow:auto;">
    `;

    window.columnasSistema.forEach((col, index) => {

      const bloqueada = col === "ESTADO";

      html += `
        <div style="
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:8px 10px;
          border-bottom:1px solid #333;
          background:${index % 2 === 0 ? "#1f1f1f" : "#181818"};
        ">

          <span style="
            flex:1;
            font-weight:500;
            letter-spacing:0.5px;
          ">
            ${col}
          </span>

          <div style="display:flex;gap:6px;">
            <button data-up="${index}">↑</button>
            <button data-down="${index}">↓</button>
            ${bloqueada ? "" : `<button data-del="${index}" style="color:red;">✖</button>`}
          </div>

        </div>
      `;
    });

    html += `
      </div>

      <div style="margin-top:10px;">
        <input id="new-column-name" placeholder="Nueva columna" />
        <button id="add-column">Agregar</button>
      </div>

      <button id="close-editor" style="margin-top:12px;">Cerrar</button>
    `;

    content.innerHTML = html;

    conectarEventosEditor();
  }

  function conectarEventosEditor() {

    document.querySelectorAll("[data-up]").forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.up;
        if (i === 0) return;

        const temp = window.columnasSistema[i - 1];
        window.columnasSistema[i - 1] = window.columnasSistema[i];
        window.columnasSistema[i] = temp;

        guardarColumnasSistema();
        renderEditor();
      };
    });

    document.querySelectorAll("[data-down]").forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.down;
        if (i === window.columnasSistema.length - 1) return;

        const temp = window.columnasSistema[i + 1];
        window.columnasSistema[i + 1] = window.columnasSistema[i];
        window.columnasSistema[i] = temp;

        guardarColumnasSistema();
        renderEditor();
      };
    });

    document.querySelectorAll("[data-del]").forEach(btn => {
      btn.onclick = () => {
        const i = +btn.dataset.del;
        window.columnasSistema.splice(i, 1);
        guardarColumnasSistema();
        renderEditor();
      };
    });

    const addBtn = document.getElementById("add-column");
    if (addBtn) {
      addBtn.onclick = () => {
        const input = document.getElementById("new-column-name");

        //inicio 
          let name = input.value.trim();
          if (!name) return;

          // 🔥 normalizar
          name = name.toUpperCase();

          // evitar duplicados ignorando mayúsculas
          if (
            window.columnasSistema.some(
              col => col.toUpperCase() === name
            )
          ) return;
        //fin 

        if (!name) return;
        if (window.columnasSistema.includes(name)) return;

        window.columnasSistema.push(name);
        guardarColumnasSistema();
        renderEditor();
      };
    }

    document.getElementById("close-editor").onclick = () => {
      modal.style.display = "none";
    };
  }
}

window.abrirEditorColumnas = abrirEditorColumnas;