export function initTabs() {

  const buttons =
    document.querySelectorAll("#tabs button");

  if (!buttons.length) return;

  buttons.forEach(btn => {

    btn.onclick = () => {

      // botones

      document
        .querySelectorAll("#tabs button")
        .forEach(b =>
          b.classList.remove("active")
        );

      btn.classList.add("active");


      // contenido

      document
        .querySelectorAll(".tab")
        .forEach(t =>
          t.classList.remove("active")
        );

      const id =
        "tab-" + btn.dataset.tab;

      const tab =
        document.getElementById(id);

      if (tab)
        tab.classList.add("active");

    };

  });

}