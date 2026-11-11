// Datos compartidos por el configurador y el resumen (única fuente de precios)
const EQUIPOS = {
    'rog-g16':      { nombre: 'ASUS ROG Strix G16',          precio: 2399 },
    'tuf-a18':      { nombre: 'ASUS TUF Gaming A18',         precio: 1250 },
    'legion-5':     { nombre: 'Lenovo Legion 5',             precio: 1599 },
    'legion-tower': { nombre: 'Lenovo Legion Tower 5i (PC)', precio: 1450 },
    'aero-x16':     { nombre: 'Gigabyte AERO X16',           precio: 2199 }
};
const RAMS = { '16': 0, '32': 400, '64': 800 };   // GB -> costo de la mejora
const PRECIO_SSD = 250;
const CLAVE = 'cotizacionTechStore';

function dinero(valor) {
    return '$' + valor.toFixed(2);
}

// Calcula todos los montos de una cotización
function calcular(idEquipo, ram, conSsd, cantidad) {
    const base = EQUIPOS[idEquipo].precio;
    const extras = RAMS[ram] + (conSsd ? PRECIO_SSD : 0);
    const unitario = base + extras;
    return { base: base, extras: extras, unitario: unitario, total: unitario * cantidad };
}
