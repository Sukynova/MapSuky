const tooltip = document.getElementById("tooltip");

export function mostrarTooltip(m, evt) {

  const tooltip = document.getElementById("tooltip");
  if (!tooltip) return;

  tooltip.innerHTML = `
    <strong>${m.id}</strong><br>
    Área: ${m.layout.area}<br>
    ESTADO: ${m.info.ESTADO}
  `;

  tooltip.style.display = "block";

  moverTooltip(evt);

}

export function ocultarTooltip() {
  const tooltip = document.getElementById("tooltip");
  if (!tooltip) return;
  tooltip.style.display = "none";

}

export function moverTooltip(evt) {
  const tooltip = document.getElementById("tooltip");
  if (!tooltip) return;

  tooltip.style.left =
    evt.clientX + 12 + "px";

  tooltip.style.top =
    evt.clientY + 12 + "px";

}
