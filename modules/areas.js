
export function getCentroReal(g) {

  const bbox = g.getBBox();
  const ctm = g.getCTM();

  const cx = bbox.x + bbox.width / 2;
  const cy = bbox.y + bbox.height / 2;

  return {
    x: ctm.a * cx + ctm.e,
    y: ctm.d * cy + ctm.f
  };

}

export function detectarArea(x, y, gMaquina = null) {

  const areaGroups =
    window.areasLayer.querySelectorAll("g[id^='AREA_']");

  const puntos = [{ x, y }];

  if (gMaquina) {

    const box = gMaquina.getBBox();
    const ctm = gMaquina.getCTM();

    const esquinas = [
      { x: box.x, y: box.y },
      { x: box.x + box.width, y: box.y },
      { x: box.x, y: box.y + box.height },
      { x: box.x + box.width, y: box.y + box.height }
    ];

    esquinas.forEach(p => {

      puntos.push({
        x: ctm.a * p.x + ctm.e,
        y: ctm.d * p.y + ctm.f
      });

    });

  }

  for (const g of areaGroups) {

    const shape =
      g.querySelector("path, polygon, rect");

    if (!shape) continue;

    const ctm = shape.getScreenCTM();
    if (!ctm) continue;

    const inv = ctm.inverse();

    for (const p of puntos) {

      const pt = window.svg.createSVGPoint();

      pt.x = p.x;
      pt.y = p.y;

      const local =
        pt.matrixTransform(inv);

      if (shape.isPointInFill(local)) {

        return g.id.replace(
          "AREA_",
          ""
        );

      }

    }

  }

  return "SIN_AREA";

}


