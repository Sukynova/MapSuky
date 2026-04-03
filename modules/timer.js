import { maquinas } from "../core/dataStore.js";

export function iniciarTimerLicencia() {

  setInterval(() => {

    Object.values(maquinas)
      .forEach(m => {

        if (
          m.info.ESTADO ===
          "FUERA_DE_SALA"
        ) {

          m.licencia.activa = false;
          m.licencia.inicio = null;
          m.licencia.restante = null;

          return;

        }

        if (!m.licencia.activa)
          return;


        const trans =
          (Date.now() -
            m.licencia.inicio)
          / 60000;


        m.licencia.restante =
          Math.max(
            m.licencia.totalMin -
            trans,
            0
          );


        const g =
          document.querySelector(
            `[data-id="${m.id}"]`
          );


        if (g)
          window.actualizarColorLicencia(
            g,
            m
          );


        if (
          m.licencia.restante <= 0
        ) {

          window.crearAlertaVencida(
            m.id
          );

        }

      });


    if (window.seleccionada) {

      const id =
        window.seleccionada
          .dataset.id;

      if (maquinas[id]) {

        window.actualizarVistaLicencia(
          maquinas[id]
        );

      }

    }

  }, 1000);

}