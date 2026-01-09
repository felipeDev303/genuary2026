# Las Obras son Puertas: Exploración Booleana inspirada en Matilde Pérez

> _"El ojo percibe una estructura estática, pero el cerebro la transforma en movimiento."_

Este proyecto es una exploración de arte generativo desarrollada en **p5.js**, que busca reinterpretar la obra de la artista chilena **Matilde Pérez** (pionera del Arte Cinético y Op Art) a través de los principios de la **Lógica Booleana** para GENUARY 2026.

## Concepto

La obra se basa en la frase de la artista: **"Las obras son puertas"**.
En la programación, una puerta lógica (_logic gate_) decide si un camino está abierto (`TRUE`) o cerrado (`FALSE`). Este proyecto utiliza esa premisa binaria para controlar la geometría, el color y la revelación de la imagen, creando un puente entre la rigurosidad matemática y la experiencia estética.

El sketch funciona como un **carrusel interactivo de 4 escenas**, cada una explorando una faceta distinta del algoritmo visual.

## Estructura del Proyecto

### Escena 1: Vibración (El Umbral)

- **Referencia:** Obras tempranas de rectángulos y color naranja.
- **Lógica:** Utiliza una operación `AND` entre un patrón base y la posición del mouse.
- **Efecto:** Los rectángulos vibran usando una función sinusoidal (`sin()`). Al acercar el mouse, la condición booleana cambia y la figura se "abre", revelando una luz interior blanca, simulando una puerta física.

### Escena 2: Diamante Óptico (Desplazamiento de Fase)

- **Referencia:** Composición "Rombo Azul" y estudios de interferencia.
- **Lógica:** Se calcula la "Distancia Manhattan" (`abs(x) + abs(y)`) para definir matemáticamente una zona en forma de rombo.
- **Efecto:** Si un píxel cae dentro de la ecuación del rombo, su valor de color se invierte (negación lógica) o su posición se desplaza, creando una ilusión de profundidad y movimiento sobre un patrón de rayas verticales estáticas.

### Escena 3: Lógica Pura (Contraste Binario)

- **Referencia:** El rigor del blanco y negro en el Op Art clásico.
- **Lógica:** Patrón de tablero de ajedrez generado mediante `XOR` (O exclusivo). La celda es negra si `(columna par) != (fila par)`.
- **Interacción:** El mouse actúa como una compuerta `NOT` (inversor), invirtiendo el color de las celdas cercanas y alterando la lógica estricta del tablero.

### Escena 4: Homenaje (La Puerta)

- **Referencia:** Esculturas de metal y efecto _Moiré_.
- **Técnica:** Efecto de persiana cinética (_Slit-scan_). Una fotografía de la artista está oculta tras barras negras.
- **Interacción:** La proximidad del cursor controla la variable de apertura de las franjas. La imagen nunca se ve completa; el espectador debe reconstruirla mentalmente a través de las rendijas abiertas, completando la metáfora de que "la obra es una puerta".

## Instrucciones de Uso

### Requisitos

- Navegador web moderno.
- Conexión a internet (para cargar la librería p5.js).

### Controles

- **Mouse (Mover):** Interactúa con la geometría, invierte colores y abre las persianas.
- **Clic Izquierdo:** Avanza a la siguiente escena del carrusel.

## Fragmento de Código Destacado

La lógica central de la Escena 1, que convierte la posición en una decisión de apertura:

```javascript
// La "Puerta" Lógica
// 1. Patrón Base (Geometría de paridad)
let basePattern = isEvenCol === isEvenRow;

// 2. Interacción (Proximidad del usuario)
let isNearMouse = distancia < umbral;

// 3. Resultado (Arte)
// La celda se "cierra" si cumple el patrón Y NO está cerca del mouse
let isOpen = basePattern && !isNearMouse;
```

## Créditos y Referencias

- **Lenguaje:** JavaScript / p5.js
- **Inspiración:** Matilde Pérez (1916–2014)
- **Fecha:** 2026

---

_Este proyecto fue creado con fines educativos para explorar la intersección entre la computación lógica y el arte cinético latinoamericano._
