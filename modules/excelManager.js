
export function importarExcel(file, maquinas, machinesLayer, crearMaquina, viewBox) {

  const reader = new FileReader();

  reader.onload = function (e) {

    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetActiva = workbook.Sheets["ACTIVA"];
    if (!sheetActiva) {
      alert("No existe hoja ACTIVA");
      return;
    }

    const rowsActiva = XLSX.utils.sheet_to_json(sheetActiva, { defval: "" });

    const idsActiva = new Set();

    // ================= ACTIVA =================

    rowsActiva.forEach(row => {

      // 🔥 Normalizar columnas del Excel (espacios y mayúsculas)
      const rowNormalizada = {};

      Object.keys(row).forEach(key => {
        const keyNormal = key.toString().trim().toUpperCase();
        rowNormalizada[keyNormal] = row[key];
      });

      const id = String(rowNormalizada["ID"] || "").trim();
      if (!id) return;

      idsActiva.add(id);

      // 🔹 Crear si no existe
      if (!maquinas[id]) {

        maquinas[id] = {
          id,
          layout: {
            x: viewBox.x + viewBox.w / 2,
            y: viewBox.y + viewBox.h / 2,
            rot: 0,
            area: "SIN_AREA",
            master: null,
            slaves: []
          },
          info: {},
          config: { permiteParcial: true },
          licencia: {
            totalMin: 10,
            avisoMin: 5,
            rojoMin: 1,
            inicio: null,
            activa: false,
            permanente: false,
            restante: null
          }
        };

      }

      const m = maquinas[id];

      // 🔹 Actualizar SOLO columnas oficiales
      window.columnasSistema.forEach(col => {

      const colNormal = col.toString().trim().toUpperCase();

      if (colNormal === "ESTADO") {
        m.info[col] = rowNormalizada["ESTADO"] || "OK";
        return;
      }

      if (rowNormalizada[colNormal] !== undefined) {
        m.info[col] = rowNormalizada[colNormal];
      }

      });

      // 🔹 Asegurar ESTADO mínimo
      if (!m.info.ESTADO) {
        m.info.ESTADO = "OK";
      }

      // 🔹 Asegurar ULTIMO_RAM_CLEAR siempre exista
      if (!m.info.hasOwnProperty("ULTIMO_RAM_CLEAR")) {
        m.info["ULTIMO_RAM_CLEAR"] = "";
      }
      
    });

    // ================= FUERA_DE_SALA =================

    const sheetFuera = workbook.Sheets["FUERA_DE_SALA"];

    if (sheetFuera) {

      const rowsFuera = XLSX.utils.sheet_to_json(sheetFuera, { defval: "" });

      rowsFuera.forEach(row => {

        const rowNormalizada = {};

        Object.keys(row).forEach(key => {
          const keyNormal = key.toString().trim().toUpperCase();
          rowNormalizada[keyNormal] = row[key];
        });

        const id = String(rowNormalizada["ID"] || "").trim();
        if (!id) return;

        if (idsActiva.has(id)) return;

        if (!maquinas[id]) {
          maquinas[id] = {
            id,
            layout: {
              x: 0,
              y: 0,
              rot: 0,
              area: "SIN_AREA",
              master: null,
              slaves: []
            },
            info: {},
            config: { permiteParcial: true },
            licencia: {
              totalMin: 10,
              avisoMin: 5,
              rojoMin: 1,
              inicio: null,
              activa: false,
              permanente: false,
              restante: null
            }
          };
        }

        const m = maquinas[id];

        // 🔥 SI YA TIENE POSICIÓN EN EL LAYOUT, NO MOVERLA A FUERA_DE_SALA
        if (
          m.layout &&
          (
            m.layout.x !== 0 ||
            m.layout.y !== 0
          )
        ) {
          return;
        }

        // 🔥 copiar columnas oficiales
        window.columnasSistema.forEach(col => {

          const colNormal = col.toUpperCase();

          if (rowNormalizada[colNormal] !== undefined) {
            m.info[colNormal] = rowNormalizada[colNormal];
          }

        });

        // 🔥 FORZAR ESTADO CORRECTO
        m.info.ESTADO = "FUERA_DE_SALA";

        // 🔥 asegurar ultimo ram clear
        if (!m.info.hasOwnProperty("ULTIMO_RAM_CLEAR")) {
          m.info.ULTIMO_RAM_CLEAR = "";
        }

      });
    }

    // ================= RECONSTRUIR SVG =================

    document.querySelectorAll("#machines-layer > g")
      .forEach(g => g.remove());

    Object.values(maquinas).forEach(m => {

      //siempre crea la maquina
      crearMaquina(m);

      //si esta fuera, la oculta
      if ((m.info.ESTADO || "").toUpperCase() === "FUERA_DE_SALA"){
        const g = document.querySelector(`[data-id="${m.id}"]`);
        if (g) g.style.display = "none";
      }
    });


    guardarProyecto();
    actualizarFiltroEstados();
    aplicarFiltros();
    window.dispatchEvent(new Event("excelActualizado"));

  };

  reader.readAsArrayBuffer(file);
}

