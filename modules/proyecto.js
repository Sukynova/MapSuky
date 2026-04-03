export function guardarProyecto() {

  const data = {

    versionSistema: "1.0.0",

    fechaGuardado: Date.now(),

    maquinas: maquinas,

    columnasSistema: window.columnasSistema,

    ramClearHistory: window.ramClearHistory,

    areas: window.areas || {},

    config: window.config || {},

    logs: window.logs || [],

    backups: window.backups || []

  };

  localStorage.setItem(
    "casino_layout",
    JSON.stringify(data)
  );

  showToast(
    "💾 Proyecto guardado correctamente",
    "#4caf50"
  );
}

export function cargarProyecto() {

  const guardado =
    localStorage.getItem("casino_layout");

  if (!guardado) return;

  try {

    const data =
      JSON.parse(guardado);

    Object.keys(window.maquinas)
      .forEach(
        k => delete window.maquinas[k]
      );

    if (data.maquinas) {

      Object.assign(
        window.maquinas,
        data.maquinas
      );

      window.versionSistema =
        data.versionSistema || [];

      window.columnasSistema =
        data.columnasSistema || [];

      window.ramClearHistory =
        data.ramClearHistory || [];

      window.areas =
        data.areas || {};

      window.config =
        data.config || {};

      window.logs =
        data.logs || [];

      window.backups =
        data.backups || [];

    }

    window.actualizarFiltroEstados();

    console.log(
      "✔ Proyecto restaurado correctamente"
    );

  }

  catch (err) {

    console.error(
      "Error al cargar proyecto:",
      err
    );

  }

} 

export function exportarExcel() {

  const dataActiva = [];
  const dataFuera = [];

  Object.values(window.maquinas)

  .sort((a, b) => {

    const orden = {
      GENERAL: 1,
      VIP: 2,
      SIN_AREA: 3
    };

    const areaA = a.layout.area || "SIN_AREA";
    const areaB = b.layout.area || "SIN_AREA";

    return (orden[areaA] || 99) - (orden[areaB] || 99);

  })

  .forEach(m => {

    const fila = {};

    fila["ID"] = m.id;

    fila["AREA"] = m.layout.area;

    window.columnasSistema.forEach(col => {
      if (col === "id") return;
      fila[col] = m.info[col] ?? "";
    });

    if (m.info.ESTADO === "FUERA_DE_SALA") {
      dataFuera.push(fila);
    } else {
      dataActiva.push(fila);
    }

  });

  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(dataActiva),
    "ACTIVA"
  );

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(dataFuera),
    "FUERA_DE_SALA"
  );

  // ======= HISTORIAL RAM CLEAR =======

  const historialFormateado = [];

  let primero = true;

  (window.ramClearHistory || []).forEach(e => {

    // si cambia envento -> agregar separador 
    if (!primero && e.momento === "ANTES"){
      historialFormateado.push({});
    }
    
    primero = false;
    
    const fila = {
      ID: e.id,
      MOMENTO: e.momento,
      TIPO: e.tipo,
      FECHA_EVENTO: new Date(e.fecha).toLocaleString()
    };

    Object.keys(e.info || {}).forEach(k => {
      fila[k.toUpperCase()] = e.info[k];
    });

    historialFormateado.push(fila);
  });

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(historialFormateado),
    "RAM_CLEAR_HISTORY"
  );

  //fin historial ram clear

  XLSX.writeFile(wb, "Casino_Layout_Export.xlsx");

  showToast("📄 Excel exportado correctamente", "#4caf50");
}

export function exportarPDF() {

  const { jsPDF } = window.jspdf;

  // 🔥 Obtener tamaño REAL del contenido
  const bbox = svg.getBBox();

  const width = bbox.width;
  const height = bbox.height;

  // 🔥 Guardar viewBox original
  const originalViewBox = svg.getAttribute("viewBox");

  // 🔥 Ajustar viewBox al contenido real
  svg.setAttribute(
    "viewBox",
    `${bbox.x} ${bbox.y} ${width} ${height}`
  );

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);

  const canvas = document.createElement("canvas");

  // 🔥 AJUSTA CALIDAD AQUÍ
  const QUALITY = 3; // cambia 1,2,3,4
  const SCALE = QUALITY;


  canvas.width = width * SCALE;
  canvas.height = height * SCALE;

  const ctx = canvas.getContext("2d");

  const img = new Image();

  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8"
  });

  const url = URL.createObjectURL(svgBlob);

  img.onload = function () {

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: width > height ? "landscape" : "portrait",
      unit: "px",
      format: [width, height]
    });

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    pdf.save("Casino_Layout_Mapa.pdf");

    URL.revokeObjectURL(url);

    // 🔥 Restaurar viewBox original
    svg.setAttribute("viewBox", originalViewBox);

    showToast("📄 PDF exportado correctamente", "#2196f3");
  };

  img.src = url;
}

