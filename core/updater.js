
const VERSION_ACTUAL = "1.0.1";

export async function checkUpdate() {

  try {

    const res = await fetch("version.json");
    const data = await res.json();

    if (data.version !== VERSION_ACTUAL) {

      console.log("🆕 Update disponible:", data.version);

      mostrarUpdateUI(data);

    } else {

      console.log("✔ Sistema actualizado");

    }

  } catch (err) {

    console.error("Error al buscar update:", err);

  }

}


function mostrarUpdateUI(data) {

  const container = document.getElementById("update-container");
  if (!container) return;

  if (document.getElementById("update-box")) return;

  const div = document.createElement("div");
  div.id = "update-box";
  div.classList.add("update-box");

  div.innerHTML = `
    <div class="update-text">
      <span>Nueva actualización</span>
      <span>Disponible</span>
    </div>

    <button id="btn-update">Actualizar</button>
    <span id="btn-close-update" class="update-close">✖</span>
  `;

  container.appendChild(div);

  document.getElementById("btn-update").onclick = async () => {
    const btn = document.getElementById("btn-update");

    btn.textContent = "Descargando...";
    btn.disabled = true;

    await aplicarUpdate();

    div.remove();
  };

  document.getElementById("btn-close-update").onclick = () => {
    div.remove();
  };
}


async function aplicarUpdate() {

  try {

    console.log("⬇ Descargando actualización...");

    const res = await fetch("updates/update.zip");

    if (!res.ok) throw new Error("No se encontró update.zip");

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "update.zip";
    a.click();

    URL.revokeObjectURL(url);

    alert("✔ Update descargado");

  } catch (err) {

    console.error("Error descargando update:", err);

  }

}