document.addEventListener('DOMContentLoaded', function () {
    const vacio = document.getElementById('sin-cotizacion');
    const contenido = document.getElementById('con-cotizacion');
    let datos = null;
    try { datos = JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { datos = null; }

    // Valida que los datos guardados sean coherentes antes de mostrarlos
    const valido = datos && EQUIPOS[datos.equipo] && (datos.ram in RAMS) &&
        Number.isInteger(datos.cantidad) && datos.cantidad >= 1 && datos.cantidad <= 10;
    if (!valido) {
        vacio.hidden = false;
        contenido.hidden = true;
        return;
    }

    const c = calcular(datos.equipo, datos.ram, datos.ssd, datos.cantidad);
    const poner = function (id, texto) { document.getElementById(id).textContent = texto; };
    poner('r-cliente', datos.nombre);
    poner('r-correo', datos.correo);
    poner('r-equipo', EQUIPOS[datos.equipo].nombre);
    poner('r-base', dinero(c.base));
    poner('r-ram', datos.ram + ' GB (' + (RAMS[datos.ram] === 0 ? 'de fábrica' : '+' + dinero(RAMS[datos.ram])) + ')');
    poner('r-ssd', datos.ssd ? 'Sí (+' + dinero(PRECIO_SSD) + ')' : 'No');
    poner('r-extras', dinero(c.extras));
    poner('r-unitario', dinero(c.unitario));
    poner('r-cantidad', String(datos.cantidad));
    poner('r-total', dinero(c.total));

    document.getElementById('btn-borrar').addEventListener('click', function () {
        try { localStorage.removeItem(CLAVE); } catch (e) { /* nada */ }
        window.location.href = 'configurador.html';
    });
});
