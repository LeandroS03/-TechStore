document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('form-cotizacion');
    const campos = {
        nombre: document.getElementById('nombre'),
        correo: document.getElementById('correo'),
        equipo: document.getElementById('equipo-base'),
        cantidad: document.getElementById('cantidad')
    };
    const ssd = document.getElementById('ssd-1tb');
    const totalParcial = document.getElementById('total-parcial');
    const resumenErrores = document.getElementById('resumen-errores');

    // Preselecciona el equipo si llega desde el catálogo (?equipo=...)
    const idUrl = new URLSearchParams(window.location.search).get('equipo');
    if (idUrl && EQUIPOS[idUrl]) { campos.equipo.value = idUrl; }

    function ramSeleccionada() {
        return form.querySelector('input[name="ram"]:checked').value;
    }

    // Reglas de validación: devuelven el mensaje de error o '' si es válido
    const reglas = {
        nombre: function (v) {
            v = v.trim();
            if (v === '') return 'Escribe tu nombre completo.';
            if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
            if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü ]+$/.test(v)) return 'El nombre solo puede contener letras y espacios.';
            return '';
        },
        correo: function (v) {
            v = v.trim();
            if (v === '') return 'Escribe tu correo electrónico.';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Escribe un correo válido, por ejemplo: nombre@dominio.com.';
            return '';
        },
        equipo: function (v) {
            if (v === '') return 'Selecciona un equipo base.';
            if (!EQUIPOS[v]) return 'El equipo seleccionado no existe.';
            return '';
        },
        cantidad: function (v) {
            const n = Number(v);
            if (v.trim() === '') return 'Indica la cantidad de equipos.';
            if (!Number.isInteger(n)) return 'La cantidad debe ser un número entero.';
            if (n < 1 || n > 10) return 'La cantidad debe estar entre 1 y 10.';
            return '';
        }
    };

    function validarCampo(nombre) {
        const campo = campos[nombre];
        const mensaje = reglas[nombre](campo.value);
        const caja = document.getElementById('error-' + nombre);
        caja.textContent = mensaje;                       // modifica el DOM
        campo.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
        return mensaje === '';
    }

    // Vista previa del total en tiempo real (evento change/input)
    function actualizarParcial() {
        const n = Number(campos.cantidad.value);
        if (EQUIPOS[campos.equipo.value] && Number.isInteger(n) && n >= 1 && n <= 10) {
            const c = calcular(campos.equipo.value, ramSeleccionada(), ssd.checked, n);
            totalParcial.textContent = dinero(c.total);
        } else {
            totalParcial.textContent = '$0.00';
        }
    }

    form.addEventListener('change', actualizarParcial);
    form.addEventListener('input', actualizarParcial);
    Object.keys(campos).forEach(function (k) {
        campos[k].addEventListener('blur', function () { validarCampo(k); });
    });

    form.addEventListener('submit', function (evento) {
        evento.preventDefault();                          // evita el envío por defecto
        const invalidos = Object.keys(campos).filter(function (k) { return !validarCampo(k); });
        if (invalidos.length > 0) {
            resumenErrores.textContent = 'Hay ' + invalidos.length + ' campo(s) con errores. Corrígelos para continuar.';
            campos[invalidos[0]].focus();                 // lleva el foco al primer error
            return;
        }
        resumenErrores.textContent = '';
        const datos = {
            nombre: campos.nombre.value.trim(),
            correo: campos.correo.value.trim(),
            equipo: campos.equipo.value,
            ram: ramSeleccionada(),
            ssd: ssd.checked,
            cantidad: Number(campos.cantidad.value)
        };
        try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) { /* sin almacenamiento */ }
        window.location.href = 'resumen.html';
    });

    actualizarParcial();
});
