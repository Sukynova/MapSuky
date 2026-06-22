export function initMovementLock() {

  window.modoEditor = false;

  const div = document.createElement("div");

  div.id = "movement-lock";

  div.innerHTML = `
    <label class="switch">
      <input
        id="movement-lock-checkbox"
        type="checkbox"
        checked
      />
      <span>
        <em></em>
        <strong></strong>
      </span>
    </label>
  `;

  document.body.appendChild(div);

  const checkbox =
    document.getElementById(
      "movement-lock-checkbox"
    );

  checkbox.addEventListener(
    "change",
    () => {

      window.modoEditor =
        !checkbox.checked;

      console.log(
        "Modo editor:",
        window.modoEditor
      );

    }
  );

}