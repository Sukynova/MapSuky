export function initTopbar() {
  const sidebar =
    document.getElementById("sidebar");
  const toggleSidebar =
    document.getElementById("toggle-sidebar");
  if (toggleSidebar) {
    toggleSidebar.onclick = () => {
      sidebar.classList.toggle("hidden");
    };
  }

  const btnSelect =
    document.getElementById("btn-select");
  if (btnSelect) {
    btnSelect.onclick = () => {
    window.seleccionMultiple = !window.seleccionMultiple;
    btnSelect.style.background =
      window.seleccionMultiple ? "#2196f3" : "";
    // 🔥 SI SE DESACTIVA → LIMPIAR VISUAL
    if (!window.seleccionMultiple) {
      window.seleccionadas.clear();
      document.querySelectorAll(".multi-selected")
        .forEach(el => el.classList.remove("multi-selected"));
      if (window.limpiarSidebar) {
        window.limpiarSidebar();
      }
    }
  };
  }


  const btnAdd =
    document.getElementById("btn-add");
  if (btnAdd) {
    btnAdd.onclick = () => {
      if (window.agregarMaquinaNueva)
        window.agregarMaquinaNueva();
    };
  }

  let areasVisibles = false;

  const btnAreas =
    document.getElementById("toggle-areas");
  if (btnAreas) {
    btnAreas.onclick = () => {
      areasVisibles = !areasVisibles;
      if (window.areasLayer) {
        window.areasLayer.style.display =
        areasVisibles ? "block" : "none";
      }
    };
  }

  btnAreas.oncontextmenu = (e) => {
    e.preventDefault();

    const activo =
      window.hitboxVisible =
      !window.hitboxVisible;

    document.querySelectorAll(".machine-hitbox")
      .forEach(h => {
        h.setAttribute(
          "fill",
          activo ? "rgba(245, 2, 34, 0.49)" : "transparent"
        );
      });
  };
}