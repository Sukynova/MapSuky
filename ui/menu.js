export function initMenuDatos() {

  const btnDatos = document.getElementById("btn-datos");
  const menuDatos = document.getElementById("menu-datos");

  if (!btnDatos || !menuDatos) return;

  btnDatos.onclick = (e) => {

    e.stopPropagation();

    if (menuDatos.style.display === "flex") {
      menuDatos.style.display = "none";
    } else {
      menuDatos.style.display = "flex";
    }

  };

  document.addEventListener("click", () => {

    menuDatos.style.display = "none";

  });

  document.getElementById("menu-fuera").onclick = () => {

    menuDatos.style.display = "none";

    const btn =
      document.getElementById("btn-clear-history");

    if (!btn) return;

    btn.click();

    setTimeout(() => {

      const b =
        document.getElementById("admin-fuera");

      if (b) b.click();

    }, 50);

  };

  document.getElementById("menu-ramclear").onclick = () => {

    menuDatos.style.display = "none";

    const btn =
      document.getElementById("btn-clear-history");

    if (!btn) return;

    btn.click();

    setTimeout(() => {

      const b =
        document.getElementById("admin-historial");

      if (b) b.click();

    }, 50);

  };

  document.getElementById("menu-columnas").onclick = () => {

    menuDatos.style.display = "none";

    if (window.abrirEditorColumnas) {
      window.abrirEditorColumnas();
    }

  };

}