export function bindEditEvents(m) {

  const btnEdit = document.getElementById("btn-edit");
  const btnSave = document.getElementById("btn-save");

  if (btnEdit) {
    btnEdit.onclick = () => {

      document.querySelectorAll("#tab-info input")
        .forEach(input => {

          const label = input.previousElementSibling?.textContent;

          if (label === "Rol") return;
          if (label === "AREA") return;

          input.disabled = false;

        });

      btnEdit.style.display = "none";
      btnSave.style.display = "block";
    };
  }

  if (btnSave) {
    btnSave.onclick = () => {

      const inputs = document.querySelectorAll("#tab-info input");

      inputs.forEach(input => {

        const label = input.previousElementSibling?.textContent;
        if (!label) return;

        if (label === "ID") {

          const nuevoId = input.value.trim();

          if (nuevoId !== m.id) {

            if (window.maquinas[nuevoId]) {
              alert("Ese ID ya existe.");
              input.value = m.id;
              return;
            }

            const oldId = m.id;

            window.maquinas[nuevoId] = m;
            delete window.maquinas[oldId];

            m.id = nuevoId;

            const g = document.querySelector(`[data-id="${oldId}"]`);

            if (g) {
              g.dataset.id = nuevoId;
              g.querySelector(".machine-id").textContent = nuevoId;
            }
          }

        } else if (label !== "Rol") {

          if (label.toUpperCase() === "ESTADO") {
            m.info[label] = window.normalizarEstado(input.value);
          } else {
            m.info[label] = input.value;
          }

        }

      });

      document.querySelectorAll("#tab-info input")
        .forEach(input => input.disabled = true);

      btnEdit.style.display = "block";
      btnSave.style.display = "none";

      window.showToast("✔ Cambios guardados", "#2196f3");

      if (window.actualizarFiltroEstados) window.actualizarFiltroEstados();
      if (window.aplicarFiltros) window.aplicarFiltros();
    };
  }

}