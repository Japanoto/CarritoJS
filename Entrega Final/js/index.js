// Declaración de descuentos, variables y constantes
let carrito = [];

// Función para mostrar el catálogo
function mostrarCatalogo(productos) {
    let catalogoString = 'CATÁLOGO DE PRODUCTOS:\n\n';
    let main = document.getElementById('main');

    for (let seccion in productos) {
        catalogoString += seccion.toUpperCase() + ':\n';

        if (Array.isArray(productos[seccion])) {
            productos[seccion].forEach((producto, index) => {
                let nuevoProductoDiv = document.createElement("div");
                nuevoProductoDiv.className = "col-12 col-md-6 col-lg-4 my-2 list-group";
                nuevoProductoDiv.innerHTML = `
                    <div class="card m-3" style="width: 18rem;">
                        <div class="card-img-top" style="height: 200px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                            <img src="./imgs/${producto.img}" alt="${producto.nombre}" class="img-fluid" style="max-height: 100%; max-width: 100%;">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <h5 class="card-title">$ ${producto.precio}.-</h5>
                            <button class="btn btn-primary agregar-al-carrito" 
                                    data-nombre="${producto.nombre}" 
                                    data-precio="${producto.precio}"
                                    data-img="${producto.img}">Agregar al carrito</button>
                        </div>
                    </div>`;
                main.appendChild(nuevoProductoDiv);
            });
        } else {
            for (let subseccion in productos[seccion]) {
                catalogoString += `${subseccion}:\n`;
                productos[seccion][subseccion].forEach((producto, index) => {
                    let nuevoProductoDiv = document.createElement("div");
                    nuevoProductoDiv.className = "col-12 col-md-6 col-lg-4 my-2 list-group";
                    nuevoProductoDiv.innerHTML = `
                        <div class="card m-3" style="width: 18rem;">
                            <div class="card-img-top" style="height: 200px; background-color: #f8f9fa; display: flex; align-items: center; justify-content: center;">
                                <img src="./imgs/${producto.img}" alt="${producto.nombre}" class="img-fluid" style="max-height: 100%; max-width: 100%;">
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${producto.nombre}</h5>
                                <h5 class="card-title">$ ${producto.precio}.-</h5>
                                <button class="btn btn-primary agregar-al-carrito" 
                                        data-nombre="${producto.nombre}" 
                                        data-precio="${producto.precio}"
                                        data-img="${producto.img}">Agregar al carrito</button>
                            </div>
                        </div>`;
                    main.appendChild(nuevoProductoDiv);
                });
            }
        }
        catalogoString += '\n';
    }

    // Evento de clic para agregar un producto al carrito
    main.addEventListener('click', function(event) {
        if (event.target.classList.contains('agregar-al-carrito')) {
            const producto = {
                nombre: event.target.dataset.nombre,
                precio: parseFloat(event.target.dataset.precio),
                img: event.target.dataset.img
            };
            agregarAlCarrito(producto);
        }
    });
}

// Llamar a la función para mostrar el catálogo
fetch('./js/catalogo.json')
    .then(response => response.json())
    .then(data => {
        const productos = data.productos;
        mostrarCatalogo(productos);
    })
    .catch(error => console.error('Error al cargar el catálogo:', error));

// Función para agregar un producto al carrito
function agregarAlCarrito(producto) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.push(producto);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}
