const { ipcRenderer } = require("electron");

// 🔥 versión actual (luego la hacemos automática)
const VERSION_ACTUAL = "1.0.2";

// 🔥 URL base (SIN nocache aquí)
const VERSION_URL = "https://raw.githubusercontent.com/Sukynova/MapSuky/main/version.json";


// ===============================
// 🔍 CHECK UPDATE
// ===============================
export async function checkUpdate() {
  console.log("🔍 Buscando actualizaciones...");

  try {
    // ✅ nocache SOLO AQUÍ
    const res = await fetch(VERSION_URL + "?nocache=" + Date.now());
    const data = await res.json();

    console.log("🌐 Versión en servidor:", data.version);
    console.log("💻 Versión actual:", VERSION_ACTUAL);

    if (esVersionMasNueva(data.version, VERSION_ACTUAL)) {
      console.log("🆕 Update disponible:", data.version);
      mostrarUpdateUI(data);
    } else {
      console.log("✔ Sistema actualizado");
    }

  } catch (err) {
    console.error("❌ Error al buscar update:", err);
  }
}


// ===============================
// 🧠 COMPARAR VERSIONES
// ===============================
function esVersionMasNueva(vServer, vLocal) {
  const server = vServer.split(".").map(Number);
  const local = vLocal.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (server[i] > local[i]) return true;
    if (server[i] < local[i]) return false;
  }

  return false;
}


// ===============================
// 🎨 UI DEL UPDATE
// ===============================
function mostrarUpdateUI(data) {

  const container = document.getElementById("update-container");
  if (!container) {
    console.warn("⚠ No existe #update-container");
    return;
  }

  // mostrar contenedor
  container.style.display = "block";

  // colocar versión
  const versionSpan = document.getElementById("update-version");
  if (versionSpan) {
    versionSpan.textContent = data.version;
  }

  // botón actualizar
  const btnUpdate = document.getElementById("btn-update");
  if (btnUpdate) {
    btnUpdate.onclick = async () => {
      btnUpdate.textContent = "Descargando...";
      btnUpdate.disabled = true;

      await aplicarUpdate();

      container.style.display = "none";
    };
  }

  // botón cerrar
  const btnClose = document.getElementById("btn-close-update");
  if (btnClose) {
    btnClose.onclick = () => {
      container.style.display = "none";
    };
  }
}


// ===============================
// ⬇ DESCARGAR Y EJECUTAR UPDATE
// ===============================
async function aplicarUpdate() {
  try {
    console.log("⬇ Ejecutando actualización...");

    await ipcRenderer.invoke("descargar-update");

    console.log("🚀 Instalador lanzado");

  } catch (err) {
    console.error("❌ Error en update:", err);
  }
}