export function mostrarInputDialog({
  titulo = "Entrada",
  mensaje = "",
  valor = "",
  placeholder = ""
}) {

  return new Promise(resolve => {

    const fondo =
      document.createElement("div");

    fondo.id = "input-dialog-overlay";

    fondo.innerHTML = `
      <div id="input-dialog">

        <h3>${titulo}</h3>

        <p>${mensaje}</p>

        <input
          id="input-dialog-input"
          type="text"
          value="${valor}"
          placeholder="${placeholder}"
        >

        <div class="input-dialog-buttons">

          <button id="dialog-cancel">
            Cancelar
          </button>

          <button id="dialog-ok">
            Aceptar
          </button>

        </div>

      </div>
    `;

    document.body.appendChild(fondo);

    const input =
      document.getElementById(
        "input-dialog-input"
      );

    input.focus();

    document
      .getElementById("dialog-ok")
      .onclick = () => {

        const valor =
          input.value;

        fondo.remove();

        resolve(valor);

      };

    document
      .getElementById("dialog-cancel")
      .onclick = () => {

        fondo.remove();

        resolve(null);

      };

  });

}