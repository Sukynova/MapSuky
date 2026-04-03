import {
  eliminarMaquina,
  rotarMaquina,
  duplicarMaquina,
  aplicarRamClearAction
} from "./machines/machineActions.js";

export function initContextMenu() {

  window.addEventListener("click", () => {
    const menu =
      document.getElementById("machine-menu");
    if (menu) menu.style.display = "none";
  });

  window.addEventListener("mousedown", e => {

    const menu =
      document.getElementById("machine-menu");

    if (!menu) return;

    if (!menu.contains(e.target)) {

      menu.style.display = "none";
      window.menuAbierto = false;

    }

  });


  document
    .querySelectorAll("#machine-menu div")
    .forEach(btn => {

      btn.onclick = () => {

        const m = window.menuMachine;
        const action = btn.dataset.action;
        const esMultiple = window.seleccionadas && window.seleccionadas.size > 1;

        if (esMultiple && action !== "rotar"){
          showToast("No disponible en seleccion multiple", "#ff9800")
          return;
        }


        if (!m) return;

        if (action === "rotar") {
          rotarMaquina(m);
        }

        if (action === "duplicar") {
          duplicarMaquina(m);
        }

        if (action === "eliminar") {
          eliminarMaquina(m);
        }

        if (action === "ramclear") {
          aplicarRamClearAction(m);
        }

        document.getElementById(
          "machine-menu"
        ).style.display = "none";

      };

    });

}