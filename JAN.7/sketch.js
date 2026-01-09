/* 
  HOMENAJE A MATILDE PÉREZ: "LAS OBRAS SON PUERTAS"
  Suite Final:
  
  1. Vibración (Naranja)
  2. Diamante Óptico (Azul)
  3. Lógica Pura (Ajedrez B&W) - REINTEGRADO
  4. Homenaje (Foto)
  
  Haz CLIC para cambiar de escena.
*/

let escena = 0;
let totalEscenas = 4;

// Variables Generales
let cols = 40; // Alta resolución para el diamante
let rows = 40;
let cellSize;
let t = 0; // Tiempo

// Variables para imágenes
let imgMatilde;

function preload() {
  try {
    imgMatilde = loadImage("matilde.jpg");
  } catch (e) {
    console.log("Falta imagen");
  }
}

function setup() {
  createCanvas(600, 600);
  cellSize = width / cols;
  textAlign(CENTER, CENTER);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  // Incremento de tiempo global
  t += 0.04;

  // --- MÁQUINA DE ESTADOS ---
  if (escena === 0) {
    escenaVibracion();
    dibujarInstruccion("1. Vibración: El Umbral");
  } else if (escena === 1) {
    escenaDiamanteAzul();
    dibujarInstruccion("2. Diamante Óptico: Desplazamiento de Fase");
  } else if (escena === 2) {
    escenaAjedrez(); // <--- AQUÍ ESTÁ EL CAMBIO
    dibujarInstruccion("3. Lógica Pura: Contraste Binario");
  } else if (escena === 3) {
    escenaHomenaje();
    dibujarInstruccion("4. Homenaje: Las obras son puertas");
  }
}

function mousePressed() {
  escena++;
  if (escena >= totalEscenas) escena = 0;
}

// ----------------------------------------------------
// ESCENA 1: VIBRACIÓN (Naranja)
// ----------------------------------------------------
function escenaVibracion() {
  let cFondo = color(20, 20, 25);
  let cFigura = color(230, 80, 20);
  let cLuz = color(240, 240, 235);

  background(cFondo);

  // Usamos una rejilla local más grande (menos celdas) para esta obra
  let localCols = 20;
  let localCellSize = width / localCols;

  for (let i = 0; i < localCols; i++) {
    for (let j = 0; j < localCols; j++) {
      let x = i * localCellSize + localCellSize / 2;
      let y = j * localCellSize + localCellSize / 2;

      let isEvenCol = i % 2 === 0;
      let isEvenRow = j % 2 === 0;
      let basePattern = isEvenCol === isEvenRow;

      let d = dist(mouseX, mouseY, x, y);
      let isNearMouse = d < 150;
      let isOpen = basePattern && !isNearMouse;

      if (mouseIsPressed) isOpen = !isOpen;

      push();
      translate(x, y);

      if (isOpen) {
        fill(cFigura);
        let vibration = map(sin(t * 2 + i), -1, 1, 0.8, 1);
        rect(0, 0, localCellSize * vibration, localCellSize * 0.6);
      } else {
        fill(cLuz);
        let gap = map(sin(t * 2 + x * 0.1 + y * 0.1), -1, 1, 2, 10);
        rect(-gap, 0, localCellSize * 0.2, localCellSize * 0.8);
        rect(gap, 0, localCellSize * 0.2, localCellSize * 0.8);
      }
      pop();
    }
  }
}

// ----------------------------------------------------
// ESCENA 2: DIAMANTE AZUL (Rombo)
// ----------------------------------------------------
function escenaDiamanteAzul() {
  background(0);

  let numStripes = 50;
  let stripeW = width / numStripes;
  let cBlue = color(30, 60, 200);

  for (let i = 0; i < numStripes; i++) {
    let x = i * stripeW;
    let isBlue = i % 2 === 0;

    fill(isBlue ? cBlue : 0);
    rectMode(CORNER);
    rect(x, 0, stripeW, height);

    let segHeight = 10;
    for (let y = 0; y < height; y += segHeight) {
      let dx = abs(x + stripeW / 2 - width / 2);
      let dy = abs(y + segHeight / 2 - height / 2);
      let diamondSize = 220 + sin(t) * 20;

      if (dx + dy < diamondSize) {
        let innerDiamond = dx + dy < diamondSize * 0.5;

        if (!innerDiamond) {
          fill(!isBlue ? cBlue : 0);
          rect(x, y, stripeW, segHeight);
        } else {
          let shift = map(sin(t * 2 + y * 0.1), -1, 1, -5, 5);
          fill(isBlue ? cBlue : 0);
          rect(x + shift, y, stripeW * 0.8, segHeight);
        }
      }
    }
  }
}

// ----------------------------------------------------
// ESCENA 3: AJEDREZ (Lógica Pura - Reemplaza a Geometría Estelar)
// ----------------------------------------------------
function escenaAjedrez() {
  background(255); // Fondo Blanco
  fill(0); // Figuras Negras

  // Usamos una rejilla local de 20x20 para que se vea bien (no muy pequeña)
  let chessCols = 20;
  let chessCellSize = width / chessCols;

  for (let i = 0; i < chessCols; i++) {
    for (let j = 0; j < chessCols; j++) {
      let x = i * chessCellSize + chessCellSize / 2;
      let y = j * chessCellSize + chessCellSize / 2;

      // Lógica XOR estricta: (x es par) != (y es par)
      let logic = (i % 2 == 0) != (j % 2 == 0);

      // El mouse invierte la lógica localmente (Compuerta NOT)
      if (dist(mouseX, mouseY, x, y) < 120) {
        logic = !logic;
      }

      if (logic) {
        // Dibujamos cuadrado negro
        // Pequeño truco cinético: el tamaño pulsa muy levemente con el tiempo
        let pulso = map(sin(t * 0.5 + i + j), -1, 1, 0.9, 1.0);
        rectMode(CENTER);
        rect(x, y, chessCellSize * pulso, chessCellSize * pulso);
      }
    }
  }
}

// ----------------------------------------------------
// ESCENA 4: HOMENAJE (FOTO)
// ----------------------------------------------------
function escenaHomenaje() {
  background(0);
  let numTiras = 40;
  let anchoTira = width / numTiras;

  for (let i = 0; i < numTiras; i++) {
    let x = i * anchoTira;
    let distMouse = abs(mouseX - x);

    let apertura = map(distMouse, 0, width, 1.0, 0.0);
    apertura = constrain(apertura, 0.05, 0.9);

    let anchoVisible = anchoTira * apertura;

    if (imgMatilde) {
      let imgX = map(x, 0, width, 0, imgMatilde.width);
      image(
        imgMatilde,
        x,
        0,
        anchoVisible,
        height,
        imgX,
        0,
        imgMatilde.width / numTiras,
        imgMatilde.height
      );
    } else {
      fill(100);
      rectMode(CORNER);
      rect(x, 0, anchoVisible, height);
      rectMode(CENTER);
    }
  }
}

function dibujarInstruccion(texto) {
  push();
  rectMode(CORNER);
  fill(0);
  rect(0, height - 30, width, 30);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(14);
  text(texto + " (Clic para siguiente)", width / 2, height - 15);
  pop();
}
