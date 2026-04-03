export const alertasActivas = new Set();

export function showToast(message, color = "#4caf50") {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.background = color;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000);
}

export function crearAlertaVencida(id) {
  if (alertasActivas.has(id)) return;

  alertasActivas.add(id);

  const container = document.getElementById("alert-container");

  const box = document.createElement("div");
  box.style.background = "#b71c1c";
  box.style.color = "white";
  box.style.padding = "8px 12px";
  box.style.borderRadius = "6px";
  box.style.display = "flex";
  box.style.justifyContent = "space-between";
  box.style.alignItems = "center";
  box.style.minWidth = "220px";
  box.style.cursor = "pointer"; // 🔥 ahora es clickeable

  box.innerHTML = `
    <span>Licencia vencida: ${id}</span>
    <button style="
      background:none;
      border:none;
      color:white;
      font-weight:bold;
      cursor:pointer;
      font-size:14px;
    ">✖</button>
  `;

  const btn = box.querySelector("button");

  // 🔥 BOTÓN CERRAR (NO BUSCAR)
  btn.onclick = (e) => {
    e.stopPropagation(); // 👈 evita que active el click del box
    alertasActivas.delete(id);
    box.remove();
  };

  // 🔥 CLICK EN ALERTA = BUSCAR MÁQUINA
  box.addEventListener("click", () => {

    setTimeout(() => {

      if (window.buscarMaquinaPorID) {
        window.buscarMaquinaPorID(id);
      }

    }, 50);

    alertasActivas.delete(id);
    box.remove();

  });

  container.appendChild(box);
}

export function crearAlertaAzul(texto) {
  window.crearAlertaAzul = crearAlertaAzul;

  const container = document.getElementById("alert-container");

  const box = document.createElement("div");
  box.style.background = "#1565c0";
  box.style.color = "white";
  box.style.padding = "8px 12px";
  box.style.borderRadius = "6px";
  box.style.display = "flex";
  box.style.justifyContent = "space-between";
  box.style.alignItems = "center";
  box.style.minWidth = "220px";

  box.innerHTML = `
    <span>${texto}</span>
    <button style="
      background:none;
      border:none;
      color:white;
      font-weight:bold;
      cursor:pointer;
      font-size:14px;
    ">✖</button>
  `;

  const btn = box.querySelector("button");

  btn.onclick = () => box.remove();

  container.appendChild(box);
}

