# Guía del código de VoltLab

## Archivos principales

- `index.html`: estructura de la tienda. Los comentarios HTML identifican navegación, portada, catálogo, carrito y reproductor.
- `styles.css`: apariencia, animaciones y adaptación a pantallas pequeñas. Las variables de color están al principio; las reglas `@media` ajustan la interfaz a móvil.
- `app.js`: comportamiento interactivo. Sus comentarios `DATOS`, `CATÁLOGO`, `CARRITO`, `VIDEO`, `EVENTOS` e `INICIO` marcan cada parte.
- `assets/logo/volt-lab.svg`: logo vectorial de VoltLab.
- `videos/`: demostración animada y videos de los proyectos.

## Dónde cambiar cosas

- Cambia nombres, precios, categorías y nombres de video al principio de `app.js`, dentro de la lista `kits`.
- Cambia textos y secciones en `index.html`.
- Ajusta colores en las variables CSS declaradas en `:root` al principio de `styles.css`.
- Reemplaza el logo conservando `assets/logo/volt-lab.svg` como ruta y nombre.
- Consulta `videos/README.md` para poner tus propios videos.

## Cómo funciona el pedido

El carrito permite agregar kits, modificar cantidades, quitar artículos y vaciar la selección. Se guarda en el almacenamiento local del navegador. El botón de confirmar prepara y copia un resumen; para recibir pedidos o cobrar se debe conectar un canal de contacto o una plataforma de pago.
