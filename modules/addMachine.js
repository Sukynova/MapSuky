import { maquinas } from "../core/dataStore.js";

// 🔥 Obtener siguiente ID correcto (NO depende del length)
function obtenerSiguienteNumero() {

  const ids = Object.keys(maquinas);

  if (ids.length === 0) return 1;

  const numeros = ids.map(id => {
    const n = parseInt(id.replace("M", ""));
    return isNaN(n) ? 0 : n;
  });

  return Math.max(...numeros) + 1;
}
 
export function agregarMaquinaNueva() {

  // 🔥 generar ID único REAL
  const numero = obtenerSiguienteNumero();
  const id = "M" + String(numero).padStart(3, "0");

  // 🔥 centro de pantalla
  const cx = viewBox.x + viewBox.w / 2;
  const cy = viewBox.y + viewBox.h / 2;

  // ===== CREAR INFO BASADA EN COLUMNAS =====
  const infoNueva = {};

  if (window.columnasSistema) {
    window.columnasSistema.forEach(col => {

      if (col === "ESTADO") {
        infoNueva[col] = "OK";
      } else {
        infoNueva[col] = "";
      }

    });
  }

  // 🔥 campo fijo
  infoNueva["ULTIMO_RAM_CLEAR"] = "";

  // ===== CREAR OBJETO =====
  maquinas[id] = {
    id,
    layout: {
      x: cx,
      y: cy,
      rot: 0,
      area: "SIN_AREA",
      master: null,
      slaves: []
    },
    info: infoNueva,
    config: {
      permiteParcial: true
    },
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

  // 🔥 crear en el mapa
  if (typeof window.crearMaquina === "function") {
    window.crearMaquina(maquinas[id]);
  }

  // 🔥 seleccionar automáticamente
  const g = document.querySelector(`[data-id="${id}"]`);
  if (g && window.seleccionarMaquina) {
    window.seleccionarMaquina(g);
  }

  // 🔥 guardar
  if (window.guardarProyecto) {
    window.guardarProyecto();
  }

}