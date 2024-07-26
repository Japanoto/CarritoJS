document.addEventListener('DOMContentLoaded', function() {
    // Declaración de variables y constantes
    const descuentoPorEfectivo = 0.15;
    const impuestos = 0.21;
    let usuarioEligePagoEnEfectivo = false;

    // Obtener los productos del carrito desde el almacenamiento local
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const carritoContainer = document.getElementById('carrito-container');

    // Función para mostrar los productos en el carrito
    function mostrarCarrito() {
        carritoContainer.innerHTML = '';

        if (carrito.length === 0) {
            carritoContainer.innerHTML = '<p>El carrito está vacío.</p>';
            return;
        }

        carrito.forEach((producto, index) => {
            const card = `
                <div class="col-12 col-md-6 col-lg-4 my-2 list-group">
                    <div class="card m-3" style="width: 18rem;">
                        <img src="./imgs/${producto.img}" class="card-img-top-carrito" alt="${producto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text">Precio: $${producto.precio}</p>
                            <button class="btn btn-danger eliminar-del-carrito" data-index="${index}">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
            carritoContainer.innerHTML += card;
        });
    }

    // Evento de clic para eliminar un producto del carrito
    carritoContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('eliminar-del-carrito')) {
            const index = event.target.dataset.index;
            eliminarDelCarrito(index);
        }
    });

    // Función para eliminar un producto del carrito
    function eliminarDelCarrito(index) {
        carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(carrito));
        mostrarCarrito();
        calcularPrecioFinal();
    }

    // Función para vaciar el carrito
    function vaciarCarrito() {
        localStorage.removeItem('carrito');
        location.reload();
    }

    // Función para calcular el precio total del carrito
    function calcularPrecioTotal() {
        let total = 0;
        carrito.forEach(producto => {
            total += producto.precio;
        });

        const precioConImpuestos = total * (1 + impuestos);
        if (usuarioEligePagoEnEfectivo) {
            return precioConImpuestos * (1 - descuentoPorEfectivo);
        }
        return precioConImpuestos;
    }

    // Función para calcular y mostrar el precio final del carrito
    function calcularPrecioFinal() {
        const precioFinal = calcularPrecioTotal();
        const precioFinalContainer = document.getElementById('precioFinal');
        if (precioFinalContainer) {
            precioFinalContainer.innerText = `Precio final: $${precioFinal.toFixed(2)}`;
        }
    }

    // Evento de clic para pagar en efectivo
    document.getElementById('pagarEfectivo').addEventListener('click', function() {
        usuarioEligePagoEnEfectivo = true;
        const precioFinal = calcularPrecioTotal();
        const descuento = (precioFinal / (1 - descuentoPorEfectivo)) * descuentoPorEfectivo;
        const iva = precioFinal * impuestos;
        const totalConDescuentoYIVA = precioFinal - descuento + iva;

        Swal.fire({
            icon: 'success',
            title: '¡Pago realizado con éxito!',
            html: `Precio final: $${(precioFinal / (1 + impuestos)).toFixed(2)}<br>
                   Descuento aplicado: $${descuento.toFixed(2)}<br>
                   IVA agregado: $${iva.toFixed(2)}<br>
                   Total a pagar: $${totalConDescuentoYIVA.toFixed(2)}`,
        });
    });

    // Evento de clic para pagar con tarjeta
    document.getElementById('pagarTarjeta').addEventListener('click', function() {
        usuarioEligePagoEnEfectivo = false;
        const precioFinal = calcularPrecioTotal();
        const iva = precioFinal * impuestos;

        Swal.fire({
            icon: 'success',
            title: '¡Pago realizado con éxito!',
            html: `Precio final: $${(precioFinal / (1 + impuestos)).toFixed(2)}<br>
                   IVA agregado: $${iva.toFixed(2)}`,
        });
    });

    // Evento de clic para vaciar el carrito
    document.getElementById('vaciarCarrito').addEventListener('click', vaciarCarrito);

    // Mostrar el carrito al cargar la página
    mostrarCarrito();
    calcularPrecioFinal();
});
