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
