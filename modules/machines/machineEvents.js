export function bindMachineClick(g, m) {

  g.addEventListener("click", e => {

    e.stopPropagation();

    if (window.seleccionMultiple) {

      if (window.seleccionadas.has(m.id)) {
        window.seleccionadas.delete(m.id);
        g.classList.remove("multi-selected");
      } else {
        window.seleccionadas.add(m.id);
        g.classList.add("multi-selected");
      }

      if (window.seleccionadas.size > 0){
        window.mostrarPanelMultiple();
      }

    } else {

      window.seleccionadas.clear();
      window.seleccionarMaquina(g);

      // tabs
      document.querySelectorAll("#tabs button")
        .forEach(b => b.classList.remove("active"));

      document.querySelector('[data-tab="info"]').classList.add("active");

      document.querySelectorAll(".tab")
        .forEach(t => t.classList.remove("active"));

      document.getElementById("tab-info").classList.add("active");

    }

  });

}