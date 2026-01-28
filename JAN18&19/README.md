<div align="center">

# 🐜 LANGTON ANT 303

### Secuenciador Musical Generativo inspirado en TB-303

![p5.js](https://img.shields.io/badge/p5.js-ED225D?style=for-the-badge&logo=p5.js&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Genuary](https://img.shields.io/badge/Genuary_2026-18%2F19-F2D705?style=for-the-badge)

*Secuenciador de 16 pasos que genera melodías acid bass usando el autómata de la Hormiga de Langton*

</div>

---

## 📖 Descripción

**LANGTON ANT 303** es un secuenciador generativo que combina:

- 🐜 **Autómata de la Hormiga de Langton** - Genera patrones emergentes
- 🎹 **Síntesis Acid Bass** - Estilo TB-303 con sawtooth + filtro resonante
- 🎛️ **Interfaz VST Vintage** - Diseño inspirado en el Behringer TD-3-MO

La hormiga se mueve por una grilla 16×16 siguiendo reglas simples. Su posición determina qué nota suena en el secuenciador de 16 pasos.

---

## 🎹 Características

| Componente | Descripción |
|:-----------|:------------|
| **Grid 16×16** | Autómata con wrap-around (torus) |
| **Secuenciador 16 pasos** | Visualizado en la parte inferior |
| **Acid Synth** | Sawtooth + Square con filtro LowPass resonante |
| **Reglas personalizables** | LR, LRRL, RRLL, y más |
| **BPM ajustable** | 30-300 BPM |

---

## 🔊 Mapeo Sonoro

| Posición Hormiga | Efecto Musical |
|:-----------------|:---------------|
| **Fila Y** | Nota de la escala (A menor pentatónica) |
| **Estado celda** | Accent (filtro más abierto) |
| **Dirección E/O** | Slide al siguiente step |

---

## 🚀 Uso

1. Abrir `index.html` en el navegador
2. **Clic en el canvas** para activar el audio
3. Presionar **PLAY** para iniciar
4. Experimentar con diferentes reglas:
   - `LR` - Clásica
   - `LRRL` - Más caótica
   - `RRLL` - Simétrica

> [!TIP]
> **Atajos de teclado**: `Espacio` = Play/Pause, `R` = Reset

---

## 🗂️ Archivos

```
JAN18&19/
├── index.html   # Interfaz VST con estilos
├── sketch.js    # Lógica p5.js + p5.sound
├── img/         # Recursos visuales
└── README.md    # Este archivo
```

---

## 🎨 Diseño

<table>
<tr>
<td width="50%">

### Paleta de Colores
- **Amarillo TD-3**: `#F2D705`
- **Dorado oscuro**: `#aa9500`
- **Fondo**: `#1a1812`

</td>
<td width="50%">

### Tipografías
- **Logo**: Orbitron
- **Displays**: VT323

</td>
</tr>
</table>

---

## 📚 Teoría

La **Hormiga de Langton** es un autómata celular con reglas simples:

1. En celda blanca → girar 90° derecha, pintar negro, avanzar
2. En celda negra → girar 90° izquierda, pintar blanco, avanzar

Con reglas extendidas como `LRRL`, cada color tiene su propia regla de giro, creando patrones complejos emergentes.

### ¿Por qué es musical?

| Patrón | Equivalente Musical |
|:-------|:--------------------|
| Periodicidad | Loops y motivos |
| Simetría | Inversiones |
| Colisiones | Polirritmias |

---

## 🛠️ Tecnologías

- [p5.js](https://p5js.org/) - Visualización y canvas
- [p5.sound](https://p5js.org/reference/#/libraries/p5.sound) - Síntesis de audio

---

## 📝 Créditos

Creado para **Genuary 2026** - Días 18 & 19

Inspirado en:
- [crashingbooth/turing-explorer](https://github.com/crashingbooth/turing-explorer)
- Behringer TD-3-MO

---

<div align="center">

*🐜 "Del caos emerge la música" 🎵*

</div>