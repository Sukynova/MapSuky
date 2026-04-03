export function iniciarAppLoop(){
    setInterval(() => {

    if (window.actualizarTimebombs) {
        window.actualizarTimebombs();
    }
    
    // 🔥 actualizar sidebar si hay selección
    if (window.seleccionada) {
        const id = window.seleccionada.dataset.id;
        const m = window.maquinas[id];

        if (m && window.actualizarVistaLicencia) {
        window.actualizarVistaLicencia(m);
        }
    }

    }, 1000);
}