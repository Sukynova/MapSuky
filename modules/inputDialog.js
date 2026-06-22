export function mostrarInputDialog({
  titulo = "Ingresar valor",
  valorInicial = "",
  placeholder = ""
} = {}) {

  return new Promise(resolve => {

    const overlay = document.createElement("div");

    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.55);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
    `;

    const modal = document.createElement("div");

    modal.style.cssText = `
      width: 340px;
      background: #1f2430;
      border-radius: 12px;
      padding: 18px;
      color: white;
      box-shadow: 0 10px 25px rgba(0,0,0,.45);
      font-family: sans-serif;
    `;

    modal.innerHTML = `
      <div style="
        font-size:18px;
        margin-bottom:14px;
        font-weight:600;
      ">
        ${titulo}
      </div>

      <input
        id="dialogInput"
        type="text"
        value="${valorInicial}"
        placeholder="${placeholder}"
        style="
          width:100%;
          box-sizing:border-box;
          padding:10px;
          border-radius:8px;
          border:none;
          outline:none;
          background:#2d3446;
          color:white;
          margin-bottom:16px;
        "
      >

      <div style="
        display:flex;
        justify-content:flex-end;
        gap:8px;
      ">
        <button id="dialogCancel">
          Cancelar
        </button>

        <button id="dialogAccept">
          Aceptar
        </button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const input = modal.querySelector("#dialogInput");

    input.focus();
    input.select();

    modal.querySelector("#dialogCancel")
      .onclick = () => {

      overlay.remove();
      resolve(null);

    };

    modal.querySelector("#dialogAccept")
      .onclick = () => {

      const valor = input.value;

      overlay.remove();
      resolve(valor);

    };

    input.addEventListener("keydown", e => {

      if (e.key === "Enter") {

        const valor = input.value;

        overlay.remove();
        resolve(valor);
      }

      if (e.key === "Escape") {

        overlay.remove();
        resolve(null);
      }

    });

  });

}