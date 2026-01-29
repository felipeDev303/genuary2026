# Turing Explorer - Secuenciador Musical de la Hormiga de Langton

Aplicación TypeScript/p5.js que transforma el autómata celular de la Hormiga de Langton en composiciones musicales mediante salida MIDI.

## Descripción General

Este proyecto explora el potencial sonoro de la Hormiga de Langton, una máquina de Turing 2D que exhibe comportamiento complejo emergente a partir de reglas simples. Los patrones que emergen—autopistas, simetrías, rotaciones y colisiones—se traducen naturalmente en estructuras musicales.

## ¿Por Qué la Hormiga de Langton es Musical?

| Característica del Patrón     | Equivalente Musical                           |
| ----------------------------- | --------------------------------------------- |
| **Periodicidad de autopista** | Motivos repetitivos y loops                   |
| **Simetría/Inversión**        | Articulación de tema y retrógrado             |
| **Rotaciones**                | Transposiciones a diferentes grados de escala |
| **Colisiones**                | Polirritmias y ritmos cruzados                |

## Estrategias de Mapeo Sonoro

### 1. Estado de Celda → Altura

Cada estado de celda se mapea a una nota. Cuando una celda cambia de estado, suena su altura correspondiente.

### 2. Dirección Absoluta → Altura

La dirección que enfrenta la hormiga (N/E/S/O) dispara notas específicas—funciona como transposición modal.

### 3. Aplicación de Regla → Percusión

Los giros Izquierda/Derecha se mapean a samples de batería, capturando el patrón rítmico de la regla.

## Técnicas Rítmicas

- **Disparar solo en cambio**: Omitir valores repetidos para ritmo natural
- **Estado inicial silencioso**: Mapear estado 0 a silencio, creando espacio para respirar

## Geometrías de Grilla

| Tipo                  | Direcciones   | Caso de Uso                     |
| --------------------- | ------------- | ------------------------------- |
| **Cuadrado (4 vías)** | N/E/S/O       | Hormiga de Langton clásica      |
| **Cuadrado (8 vías)** | +Diagonales   | Patrones de autopista más ricos |
| **Triangular**        | 6 direcciones | Simetrías inusuales             |
| **Hexagonal**         | 6 direcciones | Bellos patrones rotacionales    |

## Estructura del Proyecto

```
src/
├── Machine.ts      # Lógica del autómata (Grid, Machine, Rules)
├── sound.ts        # Mapeo de sonido MIDI (SoundPlayer)
├── drawing.ts      # Visualización p5.js
├── presets.ts      # Sistemas de reglas preconfigurados
├── colorSchemes.ts # Paletas visuales
├── ui.ts           # Controlador de interfaz de usuario
└── index.ts        # Punto de entrada
```

## Inicio Rápido

```bash
npm install
npm start    # Abre navegador con visualización + salida MIDI
```

> **Requiere**: Un destino MIDI (hardware o virtual como loopMIDI)

## Creando Presets

```typescript
const miPreset: Preset = {
  systemConfig: {
    numDirs: 4,
    numCols: 64,
    numRows: 64,
    numStates: 4,
    sides: Sides.Four,
    rule: langtonsAntFactory([-1, 1, 1, -1]), // LRRL
  },
  bpm: 120,
  statePlayer: {
    channel: 1,
    mapping: [0, 2, 4, 7], // Intervalos pentatónicos
    ignoreZero: true,
    rootNote: 60,
  },
};
```

---

# Plan de Implementación

## Estado Actual

El proyecto tiene:

- **Lógica central** en `Machine.ts` - autómata de Langton completamente funcional
- **Sistema de sonido** en `sound.ts` - salida WebMIDI funcionando
- **Visualización** en `drawing.ts` - renderizado p5.js para grillas cuadradas/hex/triangulares
- **Presets** en `presets.ts` - sistemas de reglas preconfigurados

**Objetivo**: Conectar la UI HTML con el código TypeScript para control interactivo.

## Cambios Propuestos

### Controlador UI

#### `ui.ts` [NUEVO]

- Parsear strings de reglas ("LR" → `[-1, 1]`, "LRRL" → `[-1, 1, 1, -1]`)
- Mapear dropdown de tipo de grilla al enum `Sides`
- Manejar estado play/pause
- Actualizar display del contador de pasos
- Disparar animaciones del indicador de sonido

### Refactor Punto de Entrada

#### `index.ts` [MODIFICAR]

- Agregar `AppState` global con flags `isPlaying`, `isPaused`
- Montar canvas en `#canvas-container` en lugar de `document.body`
- Agregar event listeners para todos los controles UI

---

# Lista de Tareas

## Fase 1: Conectar UI con Funcionalidad Central

- [x] Crear módulo controlador UI para conectar controles HTML con TypeScript
- [x] Implementar controles de transporte Play/Pause/Reset
- [x] Conectar slider BPM a función `bpmToFrameRate()`
- [x] Conectar input de Regla (parsear "LR", "LRRL" etc) a `langtonsAntFactory()`
- [x] Conectar selector de Tipo de Grilla para cambiar entre `Sides.Four`, `Sides.Six`, `Sides.Eight`

## Fase 2: Refactorizar Punto de Entrada

- [x] Refactorizar `index.ts` para usar estado global de la app
- [x] Agregar event listeners para todos los controles UI
- [x] Implementar actualización del display del contador de pasos
- [x] Agregar montaje del contenedor del canvas

## Fase 3: Integración del Indicador de Sonido

- [x] Conectar visualización de dots de sonido con triggers de notas MIDI reales
- [x] Agregar feedback visual cuando se tocan notas

## Fase 4: Testing y Verificación

- [ ] Ejecutar tests existentes (`npm test`)
- [ ] Testing manual en navegador de todos los controles
- [ ] Verificación de salida MIDI

---

## Referencias

- [Hormiga de Langton - Wikipedia](https://es.wikipedia.org/wiki/Hormiga_de_Langton)
- [Hexagonal Langton's Ant por brmtr](https://github.com/brmtr/hexagonal-langtons-ant)

---

_Construido con p5.js, TypeScript y WebMIDI_

## Teoría Hormiga de Langton y Música

img/seq.webp

Variaciones de las Hormigas de Langton
¿Qué es la Hormiga de Langton?
La Hormiga de Langton es un autómata celular creado por Chris Langton en 1986. Explora la idea de una vida, es decir, la vida artificial o la vida tal como 'podría ser'. Lo veo como un experimento mental que demuestra que los comportamientos complejos en el universo no siempre son el resultado de sistemas complejos; A veces, sistemas, reglas o comportamientos increíblemente simples, cuando se escalan, pueden crear comportamientos emergentes fascinantemente complejos. Piensa en copos de nieve, aves en bandada, el crecimiento de las plantas y, por supuesto, las hormigas.

¿Cómo funciona?
El modelo original de Langton funciona algo así: empezamos con una cuadrícula de celdas y un agente o cursor llamado 'la hormiga'. Cada celda puede tener uno de dos estados posibles, llamémoslos 'blanco' y 'negro'. La hormiga mira hacia una de las cuatro direcciones cardinales. El modelo avanza por etapas. Esto es lo que ocurre en cada paso:

Si la celda en la que está la hormiga es blanca, la hormiga da un cuarto de vuelta a la derecha; Si la celda es negra, la hormiga da un cuarto de vuelta a la izquierda
La célula cambia de estado; es decir, si la celda es blanca, se vuelve negra y si es negra se vuelve blanca
La hormiga avanza en la dirección en la que mira hacia una celda adyacente

img/ant.gif
Fase 1: Animación de los primeros 200 pasos (de Wikipedia)

¿Qué pasa?
Aquí es donde se pone interesante. A lo largo de iteraciones repetidas de la regla, la hormiga avanza por tres etapas:

Etapa 1: al principio se comporta de forma algo sistemática, haciendo cambios de forma aparentemente simétrica. Esto continúa durante unos cientos de pasos
Etapa 2: entonces 'se rompe', por falta de una mejor forma de decirlo. Se comporta de forma caótica, cambiando celdas de un estado a otro en una fasión pseudoaleatoria durante aproximadamente las siguientes ~10.000 iteraciones
Etapa 3: luego viene 'la autopista': crea la condición para un ciclo periódico (104 pasos) que se autorreplica y continuará hasta el infinito

img/ant2.gif
Etapa 3: Hormiga de Langton alrededor del paso 10.300, justo después de que empiece su autopista

Ampliando el modelo parte 1: instrucciones y estados
El modelo de Langton hace que la hormiga gire a la izquierda o a la derecha. Hay cuatro direcciones cardinales, así que realmente la hormiga podría girar a la izquierda, derecha, mantener la dirección a la que mira o girar 180 grados. Me referiré a estas indicaciones como L, R, N (de 'no change') y B (de 'back'). No creo que haya una forma estandarizada de referirse a estas instrucciones.

Además, el modelo de Langton solo tenía dos estados para las celdas, pero no hay razón para limitarlo a dos. Las celdas de un sistema podrían tener, en teoría, un número arbitrario de estados y podemos asignar un color arbitrario a cada estado. Cada estado tiene una 'regla', es decir, una rotación relativa que debe aplicarse a la hormiga, y cuando la hormiga entra en esa celda, aplicamos la regla.

Necesitamos avanzar el estado de una célula cuando la hormiga entra. Supongamos que cada estado está designado por un valor entero. Si tenemos tres estados, avanzará de 0 → 1 → 2 → 0 → 1 y así sucesivamente: el orden es fijo, pero siempre volverá al inicio después del último estado.

Podríamos hacer una regla con 3 estados: R, L B. El primer estado (blanco) hace que una celda gire 90° a la derecha, el segundo (naranja) gire a la izquierda 90°, y el tercero (marino) 180° alrededor, y se vería así:

img/ant3.gif
Los primeros cincuenta y pico pasos para la regla RLB [1,-1,2]

El espacio de reglas es infinitamente grande, y la mayoría de las reglas simplemente se comportan de forma caótica, pero hay comportamientos realmente fascinantes para algunas reglas cuando se les da tiempo y espacio suficientes para iterar. Estos dos interesantes:

img/ant4.webp
Regla LRRRRRLLR en ~80.000 pasos: crea la casilla a su alrededor y forma autopistas dentro de la casilla. Cada vez que llega a la superficie, recorre el perímetro exterior 4 veces ampliando el área del cuadrado
Pulsa enter o haz clic para ver la imagen en tamaño completo

img/ant5.webp
Regla RRLLLLLLRRRRR a ~60k pasos: crea una forma triangular que crece y se llena

Ampliación del modelo parte 2: teselado hexagonal y triangular, y movimiento diagonal
Naturalmente pensamos en cuadrículas cuadradas simples para autómatas celulares, pero si cambiamos la geometría obtenemos resultados diferentes. Cuando empecé a explorar la hormiga de Langton, encontré este sitio que mostraba cómo podían aplicarse en una cuadrícula hexagonal, lo que realmente inspiró mi reflexión sobre el tema.

Necesitamos ajustar un poco la notación, pero solo un poco. Una hormiga en una cuadrícula cuadrada tenía cuatro direcciones posibles, y en una cuadrícula hexagonal, tenía seis. Podemos movernos a la izquierda o a la derecha 60° o 120°, así que anotemos esto por ±1 (o R1/L1) y ±2 (R2/L2) respectivamente. Sin cambios sigue siendo 0 (N), y 180° será ±3 (B).

img/ant6.gif
Los primeros ~100 pasos de la Regla Hexagonal RL [1,-1]
Algunas reglas de cuadrícula hexagonal a veces pueden proporcionar buenos ejemplos o comportamientos rotacionales a gran escala como este:

img/ant7.webp
Regla hexagonal L1 L2 N U L2 L1 R2, ~80k pasos, el movimiento principal es una pequeña espiral pero en conjunto forma una carretera en espiral en constante crecimiento

img/ant8.webp
Regla hexagonal L2 N N L1 L2 L1, tras ~

También es posible el mosaico con triángulos. Con los triángulos, como con los hexágonos, hay 6 direcciones posibles — pero solo hay tres disponibles para cada orientación (ten en cuenta que los triángulos siempre apuntarán en una de dos direcciones). Dado que los tres triángulos adyacentes a un triángulo orientado a la izquierda están orientados a la derecha y viceversa, siempre son posibles giros de 60°, al igual que 180° — pero para las otras direcciones no hay celdas adyacentes.

img/ant9.gif
Los primeros ~100 pasos de la regla triangular RL [1,-1]
Si miras los dos gifs anteriores de RL de regla hexagonal y RL de regla triangular, notarás que en realidad forman el mismo patrón. Los patrones formados por esas tres direcciones disponibles para los triángulos (60°, -60° y 180°) son idénticos a las mismas reglas generadas por hexágonos usando esas mismas direcciones (los hexágonos también tienen reglas de 120°, -120° y 0°, mientras que los triángulos no). Los hexágonos que solo giran 60°, -60° y 180° en realidad se comportan como si estuvieran en una cuadrícula triangular. Formarán un 'panal' donde ciertos espacios son inaccesibles:
img/ant10.webp
Un patrón en forma de panal se creó a partir de la Regla Hexagonal [R,L] tras unos 100 pasos

Si divides esos espacios vacíos en el panal en 6 pequeños triángulos y los adjuntas a sus hexágonos adyacentes, puedes imaginar dónde estarían los triángulos (crédito a The Math Hatter por esa información):

img/ant11.webp
Cuadrícula cuadrada con reglas diagonales
También podrías usar la cuadrícula cuadrada pero permitir reglas con movimiento diagonal. Las hormigas pueden moverse en ángulos de 45° además de los ángulos rectos. Estos sistemas tienden a no tener muchas reglas simples que generen patrones simétricos, pero varios de estos sistemas generan rápidamente tanto autopistas simples como altamente complejas.

img/ant12.gif
La cuadrícula cuadrada con diagonales rige LR (donde R y L aquí son giros de 45°): comienza con un patrón simétrico de cuatro direcciones en forma de flor, pero luego se vuelve pseudo-aleatorio y no forma una autopista en un lapso de tiempo razonable

Ampliando el modelo: múltiples hormigas
¿Por qué limitar el sistema a un solo agente? Podría haber tantas hormigas como quieras, cada una interactuando con la otra. Las cosas se complican muy rápido cuando una hormiga crea estados para otra.

img/ant13.gif
Dos hormigas, ambas con la regla de 8 vías: R3 L2 U R2 L3 R1, formando carreteras simples y luego interactuando con esas autopistas

Patronado musical
¿Qué es 'musical' en Ant Family Cellular Automata de Langton
Hay algunas características en los patrones que emergen con el CA tipo de hormiga de Langton que los hacen candidatos interesantes para la sonificación musical:

Las autopistas suelen mostrar periodicidad, y esto se traduce bien en motivos y patrones repetidos
Si una hormiga se encuentra con una autopista existente (ya sea porque la cuadrícula es un toro al estilo Pac-Man, o porque hay varias hormigas), a veces tejerá repetidamente nuevos patrones con diferentes periodicidades en los existentes, luego tejerá nuevos patrones en su siguiente encuentro, y así sucesivamente. Los patrones que emergen de los patrones tejidos son a la vez nuevos pero familiares
La simetría y la simetría inversa emergen con algunos sistemas de reglas y esto es interesante musicalmente: se articula un patrón, luego el patrón se 'deshace', es decir, se repite al revés.
Las rotaciones ocurren para algunas reglas, especialmente para la cuadrícula hexagonal. De alguna manera, una rotación es una transposición, como empezar un tema en un grado de escala diferente
Cuando empecé a interesarme por Ant de Langton en 2016, era un programador autodidacta novato y desarrollé una app gratuita para iOS que permitía a los usuarios experimentar con diferentes sistemas de reglas, y también permitía mapear la dirección de la hormiga a una escala musical (interpretada por una fuente de sonido MIDI) o a un puñado de samples de percusión. El verano pasado me contactó un compositor llamado Andrew Byrne, que usó la app para generar una serie de piezas durante el COVID. Sus resultados son interesantes, pero escucharlos me hizo reflexionar sobre por qué usé la 'dirección' de la hormiga como único parámetro dentro de las opciones disponibles para mapear al sonido. La respuesta honesta es que en ese momento me resultaba más fácil hacer que los componentes de la interfaz mapearan la dirección al sonido que los otros parámetros que se me ocurrieron. En retrospectiva, estaba dejando fuera posibilidades importantes. Tal y como lo veo ahora, en realidad hay tres grandes candidatos para 'captar patrones' y mapear al sonido.

Estrategias para mapear patrones al sonido
Mapear el estado de la celda — cada vez que una celda cambia de estado, podemos reproducir una nota o una muestra que corresponda a ese estado. El número de estados determinaría el número de alturas, lo que significa que esto estará limitado cuando solo hay dos estados en nuestro sistema (como, por ejemplo, el modelo original de Hormigas de Langton). Pero siempre podemos repetir una secuencia de reglas, por ejemplo, si la regla LR se desarrolla de forma interesante, entonces también lo harán LRLR, LRLRR, etc., lo que puede dar una paleta sonora más rica con la que trabajar, manteniendo el carácter fundamental del patrón que emerge. El avance de los estados celulares es donde se forman los patrones más interesantes e insistentes. Además, es perceptualmente relevante: crea la correlación más fuerte entre lo que vemos y lo que escuchamos: cada color tiene su propio sonido. Un mapeo de pitch uno a uno para 8 estados podría ser así:

img/ant14.webp

Mapeando la dirección absoluta de la hormiga — cada dirección posible de la hormiga se asigna a un tono o muestra. Para la hormiga cuadrada tradicional, tenemos cuatro direcciones, y cada vez que la hormiga se mueve en esa dirección absoluta, se activa algún tono o muestra. El número de mapeos disponibles aquí corresponde a la forma de la cuadrícula. Las rotaciones, que ocurren con algunas reglas, pueden funcionar como transposiciones cuando mapeamos la dirección: el mismo patrón pero empezando en un grado de escala superior. Pero la única forma práctica de manejar direcciones es usando aritmética modular para que la analogía se deshaga un poco (es decir, no hay forma de distinguir entre 360° y 0° — por lo que cuando podríamos esperar que un tono suba a la siguiente 'octava', vuelve a la raíz).

img/ant15.webp
Un ejemplo de cómo mapear 4 direcciones a 4 alturas

Mapeando la aplicación de la regla (el cambio de dirección) — una vez más mapeamos un tono o muestra a cada dirección posible de nuestra cuadrícula, pero analizamos el cambio de dirección dado por la regla, no la dirección absoluta de la hormiga. Por ejemplo, en la hormiga de Langton canónica con la regla LR, cada vez que la hormiga gira a la izquierda producimos un sonido, y cada vez que gira a la derecha producimos otro, independientemente de la dirección en la que mire la hormiga. A diferencia de la Dirección Absoluta de la Hormiga, que tendrá cuatro valores (para N,E,S,W) — todos probablemente se usarán por igual — solo se aplican dos valores por la regla (L y R). Es una paleta más pequeña (pocas reglas interesantes usan todas sus direcciones), así que este enfoque funciona mejor con samples que con tonos. Cada estado tiene una aplicación de regla, por lo que estas dos aplicaciones estarán estrechamente vinculadas (aunque una aplicación de una sola regla puede usarse para varios estados).
Una de las razones por las que estos sistemas son tan ricos en patrones sonoros es que no tenemos que elegir entre las diferentes estrategias. Cada enfoque captura un aspecto importante del patrón emergente general. La relación entre la dirección absoluta y el estado de la celda o la aplicación de la regla puede ser bastante compleja. Son patrones entrelazados — generalmente entran y salen de la periodicidad juntos, pero con comportamientos diferentes en cada nivel. Además, están causalmente relacionados en ambas direcciones: el estado celular y la aplicación de las reglas influyen en la dirección, mientras que la dirección afecta a la célula que cambia de estado. El MGIC entra escuchándolos todos juntos.

Otros candidatos para cartografía:
'Masa total del sistema' — Imagina la suma del valor numérico de los estados de las celdas en un sistema como la 'masa': un sistema vacío donde todas las celdas están en estado 0 tendría una masa de 0. Si hubiera tres celdas en el estado 1 y una celda en el estado 2, tendría una masa total de 5. Los sistemas de reglas suelen aumentar su 'masa total' a medida que aumenta la entropía, y muchos sistemas crecen indefinidamente si se les da suficiente espacio. He probado a usar la 'masa total' como parámetro tímbrico con filtros y otros efectos.
Posición absoluta de la hormiga — las coordenadas x e y de una hormiga también podrían asignarse a algún tipo de parámetro sonoro. Supongo que uno (¿o ambos?) de estos podrían ser la altura, ya que la coordenada y es en este gran ejemplo. Mapear cualquiera de estos ejes a algún parámetro tímbrico, por ejemplo, un filtro, también tendría sentido: a medida que la hormiga se mueve hacia la derecha, podría abrir un filtro pasa-bajos y cerrarlo al moverse hacia la izquierda.
Aproximando el ritmo
Los autómatas celulares suelen generar un evento o eventos en cada iteración, y traducir cada paso en un evento auditivo supondrá un flujo incesante de notas que llegan en un intervalo de tiempo fijo. Independientemente de los patrones interesantes que contenga, el resultado probablemente resultará agotador y monótono. Extraer patrones que permitan más variación rítmica — o mejor aún, resaltar patrones existentes mediante variaciones rítmicas — realmente hace que las sonificaciones sean más agradables de escuchar. Aquí tienes dos estrategias que me gustan:

Solo desencadenar eventos cuando algo cambia: En lugar de desencadenar eventos auditivos en cada paso, solo podemos activarlos cuando el evento sea diferente al anterior. Esta es una técnica que he usado a menudo con otros autómatas celulares, pero aquí funciona especialmente bien. No siempre lo uso con dirección, pero casi siempre lo uso con estado.
Pulsa enter o haz clic para ver la imagen en tamaño completo

img/ant16.webp
La frase inicial de la regla Square LRRL (primer vídeo enlazado más abajo), generada a partir del estado
Dejando un hueco en el mapeo: esto fue algo que escuché en una de las piezas de Andrew Byrne y pensé que añadía una buena variación rítmica. En mi opinión, la elección más natural y no arbitraria para este mapeo vacío es el estado inicial en el enfoque de mapeo de estados celda que describí antes. En el paso de tiempo inicial, todas las celdas están en su estado inicial, para lo cual normalmente se elige un color cercano al negro o al blanco. Por supuesto, esto es arbitrario, pero este es efectivamente el color de fondo. A medida que la hormiga empieza a moverse, las células pasarán de este estado predeterminado a su segundo estado, y el primer sonido que escucharás será el segundo sonido mapeado — si ese mapeo es, por ejemplo, una escala mayor, primero oirás primero el segundo grado de la escala, y no llegarás a oír la nota raíz hasta que alguna célula haya pasado por todos sus estados. En ese caso, en realidad estamos escuchando el modo dórico. Mapeando el estado inicial a un reposo, y el primer grado de escala al segundo estado, podemos evitar eso. Como los silencios coexisten con el color de fondo, también contribuye a la conexión perceptiva entre las correspondencias visual y auditiva. Un mapeo de estados que ignorara el estado inicial podría verse así:
Pulsa enter o haz clic para ver la imagen en tamaño completo

img/ant17.webp

Mis mejores resultados
Simetrías simples en una cuadrícula cartesiana
Estos dos sistemas se realizan en una simple cuadrícula de 4 vías y ambos generan una simetría hermosa. Los dos patrones usan la misma configuración de audio — lo único que hice fue cambiar la regla y los colores.

La primera tiene los cuatro estados asignados a cuatro muestras de gamelán afinadas aproximadamente en D: negro, F: amarillo, La: marrón y C: gris, y hay cuatro muestras de percusión asignadas a las cuatro direcciones. Cuando empieza, pasa por sus estados creando una pequeña frase musical adorable.

img/ant18.webp

Luego la hormiga se embarca en una aventura de cierta duración por el lado izquierdo, a veces corta, pero otras veces de unos minutos. En algún momento cruza hacia la derecha haciendo todas las mismas modificaciones, pero en orden exactamente inverso, y finalmente vuelve al centro y vuelve a ser simétrico. En ese momento, vuelve a la pequeña frase musical. Los dos primeros compases son más o menos iguales cada vez, pero los eventos posteriores golpean celdas que ya están en diferentes configuraciones de estados, así que diverge, aunque el mismo patrón rítmico suele repetirse. La percusión, que suena en la dirección de la hormiga, tiende a agruparse en bloques de 4, lo que refleja el hecho de que la hormiga está redibujando un cuadrado en el centro de la cuadrícula (mientras que los patrones que emergen del estado suelen estar en grupos de 5 cuando se reinicia).

https://www.youtube.com/watch?v=c8IfCod9xac
Regla de hormiga de Langton de 4 vías LRRL
La 'dirección' de la hormiga se asigna a cuatro muestras de percusión, y los cuatro estados se asignan cada uno a una muestra de gamelán (los tres colores evidentes y el fondo), pero la muestra solo suena cuando el estado en el que se encuentra la hormiga es diferente al anterior.

(el código webMIDI que usé para enviarlo a Ableton Live está ahí, pero actualmente está configurado para reproducir muestras locales)
En el código, LRRL sería: estados = [-1,1,1-1]

https://www.youtube.com/watch?v=DqpTAxTjUi0
Regla de hormigas de Langton a cuatro vías RRLL
La 'dirección' de la hormiga se asigna a cuatro muestras de percusión, y los cuatro estados se asignan cada uno a una muestra de gamelán (los tres colores evidentes y el fondo), pero la muestra solo suena cuando el estado en el que se encuentra la hormiga es diferente al anterior.

Simetría en una cuadrícula hexagonal
La regla LR (y sus múltiplos como LRLR) también creará el mismo tipo de simetría con la cuadrícula hexagonal, pero la regla LLRR hace algo realmente especial. Como en los ejemplos anteriores, tiene algo parecido a un 'tema de apertura': un patrón que crea cuando el centro vuelve al estado inicial.

Pulsa enter o haz clic para ver la imagen en tamaño completo

img/ant19.webp

Como en los ejemplos anteriores, también ocurre pequeñas o grandes aventuras, rompiendo la simetría, normalmente trazando un patrón en la mitad inferior y finalmente pasando por la mitad superior, trazando el mismo patrón pero en orden inverso. Pero tiene una característica extra: hay dos variantes de la pequeña aventura que asume. Se alterna entre el 4º y el 2º estado (blanco y morado oscuro, musicalmente B y Mi) durante un tiempo, y luego se alterna entre el tercer y el estado inicial (rosa y negro, musicalmente Sol y Do), después vuelve al 4º y 2º, y así sucesivamente. Mi oído rellena todos los detalles y escucha una alternancia repetida entre un acorde de mi menor y un acorde de do mayor. Cuanto más tiempo se mantiene en un solo acorde, más tensión se acumula. No fue intencionado (esperaba un Cmaj7 amorfo), fue un descubrimiento, pero me gusta el efecto.

https://www.youtube.com/watch?v=Z1uIPUO5KnY
Regla de hormigas hexagonales de Langton LLRR
La 'dirección' de la hormiga está asignada a seis muestras de percusión, y los estados de cuatro (los tres colores evidentes y el fondo) se asignan a 4 alturas (Do, Mi, Si, Re), pero las notas solo suenan cuando el estado en el que está la hormiga es diferente al anterior.

En el código, LLRR sería: estados = [-1,-1,1,1], donde -1 es un giro de 60° a la izquierda y 1 es un giro de 60° a la derecha.

Colisiones
Para este sistema utilicé una cuadrícula hexagonal con la regla L2 L2 L2 R R R. El patrón que esto crea es realmente maravilloso, pero se convierte en una autopista tras unos cientos de pasos. Es una autopista interesante, pero en teoría simplemente seguiría indefinidamente con el mismo patrón periódico. De hecho, puede hacer mucho más cuando interactúa consigo mismo. Así que usé dos hormigas con direcciones de inicio diferentes y las coloqué para que sus autopistas chocaran. Hasta ~3:00 las dos hormigas están completamente al unísono, pero tras la colisión interactúan de forma independiente, creando nuevos patrones, volviendo para crear nuevas autopistas, solo para chocar de nuevo, crear más patrones nuevos, más autopistas y así sucesivamente.

https://www.youtube.com/watch?v=0kx7Eff3j3k
Regla de las hormigas de Langton hexagonal L2L2L2RRR
En esta variante hexagonal, L2 es un giro de 120° a la izquierda y R es un giro a la derecha de 60°.

Hay dos hormigas que siguen la misma regla, pero sonificadas por separado.

Hay seis estados (los cinco colores evidentes y el fondo), pero el fondo se ignora en cuanto a la sonificación (musicalmente, es un descanso); los otros cinco estados son afinados Do, Mib, Sol, Si bemol, Do
Las notas solo suenan cuando el estado en el que está la hormiga es diferente al anterior.

Esta siguiente es posiblemente mi favorita, aunque tiene muchas menos visualizaciones que las demás. Utiliza un sistema de 8 vías (una cuadrícula cartesiana, pero puede moverse en diagonal; aquí R1 significa 45° y R2 90°). La regla básica es R2 L2 R1 L1, pero repetida dos veces, para poder acceder a más notas duplicando el número de estados disponibles (R2 L2 R1 L1 R2 L2 R1 L1). Comienza desde el principio formando una autopista con un periodo de 13 puntos. Como en el ejemplo anterior, también interactúa de forma maravillosa al chocar consigo misma, generando todo tipo de patrones periódicos interesantes que crean ritmos cruzados con los patrones generados por la hormiga compañera. No quiero antropomorfizar el comportamiento del sistema (ni "mirmecomorfizar" en este caso — gracias ChatGPT), pero parece que quiere desesperadamente crear patrones

https://www.youtube.com/watch?v=NyJojIXyvL0
Regla de hormiga de Langton de 8 posiciones R2L2R1L1x2
Esta es una variante de la hormiga de Langton que puede moverse en diagonal. L1 y R1 son esencialmente giros de 45° a izquierda y derecha, L2 y R2 a 90°, y así sucesivamente. Técnicamente hay 8 estados aquí, pero en realidad es una secuencia de 4 estados repetidos dos veces (esto me da más notas para la sonificación).

Hay dos hormigas que siguen la misma regla, pero sonificadas por separado.

La 'dirección' de cada hormiga se asigna a ocho muestras de percusión (conjuntos diferentes para las dos hormigas), y los siete de los ocho estados (los siete colores evidentes y el fondo) se asignan a 7 notas (C, Eb, G, Bb en su primera octava y C, D, G, en la segunda), con una hormiga una octava más baja que la otra. Las notas solo suenan cuando el estado en el que está la hormiga es diferente al anterior.

Referencias
Langton's Ant Family Cellular Automata — esta es la aplicación gratuita para iOS que creé en 2016. No lo he actualizado en años, ni lo haré, pero sigue siendo divertido de usar. Puedes introducir reglas para cuadrícula (incluyendo ocho direcciones) y cuadrícula hexagonal, y también asignar la dirección de las hormigas a algunas escalas o muestras de percusión. Ya no se permite que los nombres de las apps sean tan largos; Tendría que cambiarlo si actualizara. https://github.com/crashingbooth/LangtonsAnt https://apps.apple.com/us/app/langtons-ant-family-cellular-automata/id1142104651

La hormiga de Langton en Wikipedia — no es un artículo enorme, pero algunas de las reglas que incluye son fantásticas, y no sé dónde más las habría encontrado. https://en.wikipedia.org/wiki/Langton%27s_ant

Hexagonal Langton's Ant de brmtr — Este recurso fue enormemente útil para mí cuando descubrí por primera vez las geometrías hexagonales. También tiene algunas reglas hexagonales interesantes como ejemplos que no he visto en otros sitios. https://brtmr.de/2015/10/05/hexadecimal-langtons-ant-2.html

Andrew Byrne's Ants — una serie de piezas musicales (grabaciones, vídeos y partituras) que utilizan el enfoque de mapeo direccional de mi app https://www.andrewbyrne.net/cellular-automata

El Langtons Tants Sequenciador Teensy Controlado de Expensive Note con Launchpads, Volca FM, Volca Bass y NTS-1 — si entiendo bien, la posición y de la hormiga mapea la nota principal, mientras que el estado del sistema en cada posición x se 'muestrea' secuencialmente. Míralo — es un verdadero placer https://www.youtube.com/watch?v=6fnpbbUVeQE&ab_channel=ExpensiveNotes

El boceto caótico de Procesamiento Abierto que usé en la mayoría de los vídeos — simplemente evolucionó y es más o menos ilegible https://openprocessing.org/sketch/2055257

Enlace de Github con la versión actualmente mantenida del código para los vídeos, reescrito en TypeScript https://github.com/crashingbooth/turing-explorer
