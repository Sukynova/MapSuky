let dragging = null;

let dragStart = { x: 0, y: 0 };

let machineStart = [];

import { machinesLayer } from "../core/renderer.js";
import { setPanning } from "../core/camera.js";
import { bindMachineClick } from "./machines/machineEvents.js";
import { bindMachineDrag, initGlobalDrag } from "./machines/machineDrag.js";

const svgNS = "http://www.w3.org/2000/svg";

function crearMaquina(m) {

  if (document.querySelector(`[data-id="${m.id}"]`)) {
    return;
  }

  const proto = document.getElementById("MACHINE");
  if (!proto) {
    console.error("❌ No existe <g id='MACHINE'> en mapa.svg");
    return;
  }

  // 👉 CONTENEDOR LIMPIO
  const g = document.createElementNS(svgNS, "g");
  g.dataset.id = m.id;

  // SOLO translate aquí
  g.setAttribute(
    "transform",
    `translate(${m.layout.x}, ${m.layout.y})`
  );

  // Grupo interno que sí rota
  const gRotable = document.createElementNS(svgNS, "g");
  gRotable.classList.add("rotable");
  if (m.layout.rot) {
  gRotable.setAttribute(
    "transform",
    `rotate(${m.layout.rot}, 11, 15)`
  );
}

  g.appendChild(gRotable);

g.addEventListener("contextmenu", e => {

  e.preventDefault();

  window.seleccionarMaquina(g);

  const menu = document.getElementById("machine-menu");

  if (!menu) return;

  menu.style.display = "block";

  menu.style.left = e.clientX + "px";
  menu.style.top = e.clientY + "px";

  window.menuMachine = m;
  window.menuAbierto = true;

});
  // 🔥 HITBOX INVISIBLE
  const hitbox = document.createElementNS(svgNS, "rect");
  
  hitbox.setAttribute("x", 1);
  hitbox.setAttribute("y", 0);
  hitbox.setAttribute("width", 23);
  hitbox.setAttribute("height", 30);

  hitbox.setAttribute("fill", "transparent");
  hitbox.classList.add("machine-hitbox");

  hitbox.setAttribute("stroke-width", "1");
  hitbox.setAttribute("pointer-events", "all");
  
  // 👉 POSICIÓN SOLO AQUÍ
  
  // 👉 CLON PURO (sin moverlo)
  const gMachine = document.createElementNS(svgNS, "g");
  const clone = proto.cloneNode(true);
  clone.removeAttribute("id");
  gMachine.appendChild(clone);
  

  // evitar problemas de zoom
  clone.querySelectorAll("*").forEach(el => {
    el.setAttribute("vector-effect", "non-scaling-stroke");
  });

  clone.style.display = "inline";
  clone.style.visibility = "visible";
  
  // ciruclo del M y E de rol 
  // ===== BADGE MASTER / ESCLAVA =====
  const badgeGroup = document.createElementNS(svgNS, "g");
  badgeGroup.classList.add("role-badge");

  // círculo
  const badgeCircle = document.createElementNS(svgNS, "circle");
  badgeCircle.setAttribute("cx", 11);
  badgeCircle.setAttribute("cy", 10); // 👈 ajusta altura aquí
  badgeCircle.setAttribute("r", 4);
  badgeCircle.setAttribute("fill", "transparent");

  // letra
  const badgeText = document.createElementNS(svgNS, "text");
  badgeText.classList.add("role-label");
  badgeText.setAttribute("x", 11);
  badgeText.setAttribute("y", 10);
  badgeText.setAttribute("text-anchor", "middle");
  badgeText.setAttribute("dominant-baseline", "middle");
  badgeText.setAttribute("font-size", "6");
  badgeText.setAttribute("fill", "white");

  badgeGroup.appendChild(badgeCircle);
  badgeGroup.appendChild(badgeText);
  g.appendChild(badgeGroup);

  // 👉 ID VISIBLE
  const label = document.createElementNS(svgNS, "text");
  label.textContent = m.id;
  label.classList.add("machine-id");

  // centro exacto de la hitbox
  label.setAttribute("x", 11);
  label.setAttribute("y", 15);

  label.setAttribute("text-anchor", "middle");
  label.setAttribute("dominant-baseline", "middle");
  label.setAttribute("font-size", "8");
  label.setAttribute("fill", "#000");
  
  // 👉 EVENTOS
  bindMachineClick(g, m);

window.addEventListener("mouseup", () => {
  dragging = null;
});

  bindMachineDrag(g, m, getSVGPoint);

  g.addEventListener("mouseenter", e => {
    window.mostrarTooltip(m, e);
  });

  g.addEventListener("mousemove", e => {
    window.moverTooltip(e);
  });

  g.addEventListener("mouseleave", () => {
    window.ocultarTooltip();
  });

  // 👉 JERARQUÍA CORRECTA
  machinesLayer.appendChild(g);
  g.appendChild(label);
  setTimeout(() => {
    const centro = getCentroReal(g);
    m.layout.area = window.detectarArea(centro.x, centro.y, g);
  }, 0);
  gRotable.appendChild(hitbox);
  gRotable.appendChild(clone);
  gRotable.appendChild(gMachine);
  window.actualizarIndicadoresMaster();
}

export { crearMaquina }

export function actualizarTransformacion(m) {

  const g = document.querySelector(
    `[data-id="${m.id}"]`
  );

  if (!g) return;

  const cx = 11.5;
  const cy = 15;

  g.setAttribute(
    "transform",
    `translate(${m.layout.x}, ${m.layout.y})`
  );

  const gRotable =
    g.querySelector(".rotable");

  if (gRotable) {

    gRotable.setAttribute(
      "transform",
      `rotate(${m.layout.rot}, ${cx}, ${cy})`
    );

  }

}

function getSVGPoint(evt) {

  const svg = window.svg;

  const pt = svg.createSVGPoint();

  pt.x = evt.clientX;
  pt.y = evt.clientY;

  return pt.matrixTransform(
    svg.getScreenCTM().inverse()
  );

}

function getCentroReal(g) {
  const bbox = g.getBBox();
  const ctm = g.getCTM();

  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y + bbox.height / 2;

  return {
    x: ctm.a * cx + ctm.e,
    y: ctm.d * cy + ctm.f
  };
} 

initGlobalDrag(getSVGPoint, actualizarTransformacion);