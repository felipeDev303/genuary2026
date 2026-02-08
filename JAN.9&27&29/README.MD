# 🧬 Digital Life & Emergence: De Autómatas Celulares a Vida Artificial

Este repositorio documenta la exploración de sistemas complejos emergentes, específicamente **Autómatas Celulares Neuronales (NCA)** y **Autómatas Celulares Continuos (Lenia)**. El objetivo es estudiar cómo reglas locales simples pueden dar lugar a comportamientos biológicos complejos como la mitosis, la formación de colonias, el movimiento de gusanos y la optimización de rutas tipo moho mucilaginoso (_Physarum_).

> _"Un idiota admira la complejidad. Un genio admira la simplicidad."_ — Terry Davis
>
> _"Si deseas hacer un pastel de manzana desde cero, primero debes inventar el universo."_ — Carl Sagan

## 📚 Marco Teórico

### 1. La Filosofía de la Emergencia

El universo funciona como un set de Lego infinito. La **emergencia** ocurre cuando el colectivo exhibe propiedades que las partes individuales no poseen.

- **El Estadio:** Un píxel (o persona) solo sabe cuándo levantar una tarjeta basándose en sus vecinos. Desde lejos, esto crea olas complejas.
- **Irreductibilidad Computacional:** No hay atajos para predecir el futuro de estos sistemas (Stephen Wolfram). La única forma de saber qué pasará es ejecutar la simulación paso a paso.
- **Diseño por Emergencia:** No diseñamos el resultado final (el gusano); diseñamos las restricciones y las reglas locales (la física), y dejamos que la forma emerja.

### 2. Clasificación de Wolfram

Stephen Wolfram clasifica todos los autómatas celulares en 4 clases. Nuestro objetivo en este proyecto fue encontrar y mantenernos en la **Clase 4**:

1.  **Clase 1 (Muerte):** El sistema se apaga. Homogeneidad.
2.  **Clase 2 (Cristales):** Estructuras estáticas o repetitivas simples.
3.  **Clase 3 (Caos):** Ruido aleatorio, estática de TV (Gas).
4.  **Clase 4 (Vida/Complejidad):** El borde del caos. Estructuras que se mueven, interactúan y procesan información (Líquido/Vida).

---

## 🛠️ Arquitectura Técnica

### Del Juego de la Vida a Lenia

Transicionamos de sistemas discretos (0 o 1, vivo o muerto) a sistemas continuos (valores flotantes entre 0.0 y 1.0).

#### La Ecuación del Movimiento

En lugar de una red neuronal "caja negra", utilizamos una formulación matemática explícita basada en **Lenia** (Continuous Cellular Automata).

$$ \text{Estado}\_{t+1} = \text{Estado}\_t + dt \cdot (2 \cdot \text{Activación} - 1) $$

Donde la **Activación** es una función Gaussiana (Campana) aplicada a la percepción de los vecinos:

$$ \text{Activación} = e^{-\frac{(\text{Vecinos} - \mu)^2}{2\sigma^2}} $$

- **Percepción (Convolución):** Usamos un Kernel (filtro) en forma de anillo o donut para que la célula "huela" la densidad de sus vecinos.
- **$\mu$ (Mu - El Objetivo):** La densidad de vecinos ideal que la célula desea.
- **$\sigma$ (Sigma - La Tolerancia):** Qué tan estricta es la célula respecto a ese objetivo.

---

## 🧪 Evolución de los Experimentos

A través de iteración y ajuste fino ("Fine-Tuning"), logramos transitar por diferentes fases biológicas digitales:

### Fase 1: La Sopa Primordial (Caos)

- **Configuración:** Pesos aleatorios o parámetros laxos.
- **Resultado:** Ruido estático o extinción inmediata.
- **Lección:** Sin un equilibrio estricto entre nacimiento y muerte, la entropía gana.

### Fase 2: El Laberinto (Patrones de Turing)

- **Configuración:** $\mu \approx 0.15$, $\sigma \approx 0.025$.
- **Fenómeno:** Las células llenan el espacio formando texturas de "cerebro" o huellas dactilares.
- **Problema:** Estabilidad estática. Las colonias se fusionan y dejan de moverse.

### Fase 3: El Gusano "Orbium" (Vida)

- **Configuración Ganadora:** $\mu = 0.150$, $\sigma = 0.017$.
- **Descubrimiento:** Al estrechar la tolerancia ($\sigma$), obligamos a que las estructuras grandes sean insostenibles. El centro de la colonia muere por hacinamiento, dejando solo los bordes vivos.
- **Resultado:** Solitones (ondas solitarias) que viajan por el espacio como gusanos o partículas subatómicas.

### Fase 4: El Acuario (Ecosistema)

- **Estrategia:** Semillas de baja densidad (ruido disperso) en lugar de bloques sólidos para evitar el "shock térmico" inicial.
- **Resultado Final:** Un entorno donde criaturas individuales nacen, se mueven, interactúan y mueren sin saturar la pantalla.

---

## 🔍 Conceptos Clave para Investigación (Google Scholar)

Para profundizar, busca estos términos:

### Biología Teórica & Biofísica

- **Morphogenesis (Turing Patterns):** Cómo surgen las manchas del leopardo.
- **Reaction-Diffusion Systems:** La química detrás de los patrones biológicos.
- **Autopoiesis:** Sistemas capaces de reproducirse y mantenerse a sí mismos.
- **Stigmergy:** Comunicación indirecta mediante modificación del entorno (rastro de hormigas/moho).
- **Physarum polycephalum Algorithm:** Algoritmos de optimización inspirados en el moho.

### Matemáticas & Computación

- **Continuous Cellular Automata (Lenia / SmoothLife):** La versión "suave" del Juego de la Vida.
- **Differential Programming:** Programación diferenciable (la base de los NCAs modernos).
- **Self-Organizing Systems:** Sistemas que ordenan el caos sin un líder central.
- **Spatial Co-evolution:** Evolución donde la ubicación espacial importa.
- **Combinatorial Explosion:** Por qué reglas simples generan infinitas variaciones.

---

## 📖 Bibliografía y Personajes

### Personajes Clave

1.  **Stephen Wolfram:** Autor de _A New Kind of Science_. Padre del concepto de irreductibilidad computacional y las 4 clases.
2.  **John Conway:** Creador del _Game of Life_.
3.  **Bert Wang-Chak Chan:** Creador de _Lenia_ (los gusanos continuos que replicamos).
4.  **Alexander Mordvintsev:** Investigador de Google, autor de _Growing Neural Cellular Automata_ (Distill.pub).
5.  **Alan Turing:** Padre de la morfogénesis química.

### Libros Recomendados

- _"A New Kind of Science"_ - Stephen Wolfram.
- _"Complexity: A Guided Tour"_ - Melanie Mitchell.
- _"Sync: How Order Emerges from Chaos in the Universe, Nature, and Daily Life"_ - Steven Strogatz.

---

## ⚠️ Nota de Seguridad (Epilepsia)

Estos patrones generan luces parpadeantes de alta frecuencia y alto contraste. Precaución al visualizar las simulaciones a alta velocidad.

---

> _Este proyecto demuestra que no necesitas una supercomputadora para crear vida. Solo necesitas las reglas correctas y la paciencia para encontrar el borde del caos._
