export let viewBox = { x: -600, y: -1000, w: 2000, h: 2000 };

let svg = null;

export let panning = false;

export function setPanning(value) {
  panning = value;
}

let panStart = { x: 0, y: 0 };

export function initCamera(targetSvg) {

  svg = targetSvg;

  if (!svg) {
    console.error("Camera sin svg");
    return;
  }

  updateViewBox();

  svg.addEventListener("wheel", onWheel);
  svg.addEventListener("mousedown", onMouseDown);
  svg.addEventListener("mousemove", onMouseMove);
  svg.addEventListener("mouseup", onMouseUp);
  svg.addEventListener("mouseleave", onMouseUp);

}

function updateViewBox() {

  svg.setAttribute(
    "viewBox",
    `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`
  );

}

export function centrarMapaInicial() {

  if (!svg) return;

  try {

    // 🔥 usar TODO el contenido del SVG
    const bbox = svg.getBBox();

    if (!bbox.width || !bbox.height) {
      console.warn("bbox vacío");
      return;
    }

    const padding = 200;

    viewBox.x = bbox.x - padding;
    viewBox.y = bbox.y - padding;
    viewBox.w = bbox.width + padding * 2;
    viewBox.h = bbox.height + padding * 2;

    updateViewBox();

  } catch (err) {
    console.warn("Error centrando mapa:", err);
  }
}

function onWheel(e) {

  e.preventDefault();

  const zoom = e.deltaY > 0 ? 1.1 : 0.9;

  const rect = svg.getBoundingClientRect();

  const mx = (e.clientX - rect.left) / rect.width;
  const my = (e.clientY - rect.top) / rect.height;

  viewBox.x += viewBox.w * mx * (1 - zoom);
  viewBox.y += viewBox.h * my * (1 - zoom);

  viewBox.w *= zoom;
  viewBox.h *= zoom;

  updateViewBox();

}

function onMouseDown(e) {

  panning = true;

  panStart.x = e.clientX;
  panStart.y = e.clientY;

}

function onMouseMove(e) {

  if (!panning) return;

  const dx =
    (e.clientX - panStart.x) *
    (viewBox.w / svg.clientWidth);

  const dy =
    (e.clientY - panStart.y) *
    (viewBox.h / svg.clientHeight);

  viewBox.x -= dx;
  viewBox.y -= dy;

  panStart.x = e.clientX;
  panStart.y = e.clientY;

  updateViewBox();

}

function onMouseUp() {

  panning = false;

}


  window.updateViewBox = updateViewBox;
  window.centrarMapaInicial = centrarMapaInicial;