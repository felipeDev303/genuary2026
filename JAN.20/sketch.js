// Unknown Pleasures - Versión Slow & Smooth
let inc = 0.05;
let sidesValue = 100;
let marginX = 100;
let marginY = 100;

let currentY;
let zOffset = 0;
let direction = 1;

// CONTROL DE VELOCIDAD
let speed = 0.8; // Menos de 1 es más lento (puedes probar con 0.2)
let morphSpeed = 0.2; // Qué tan rápido cambia la forma de la montaña

function setup() {
  createCanvas(400, 500);
  background(0);
  currentY = marginY;
  strokeWeight(1);
  noFill();

  // Opcional: bajar los FPS para un look más cinematográfico
  frameRate(30);
}

function draw() {
  // Ajustamos la persistencia de la estela
  // 5 es una estela muy larga, 20 es más corta
  background(0, 30);

  stroke(255, 180);

  beginShape();
  let xOffset = 0;
  for (let x = marginX; x < width - marginX; x++) {
    let distanceFromCenter = abs(x - width / 2);
    let r = width / 2 - sidesValue - distanceFromCenter;
    let radius = r > 0 ? r / 2 : 0;

    // Calculamos el ruido
    let n = noise(xOffset, zOffset);
    let y = currentY + n * radius * -1;

    vertex(x, y);
    xOffset += inc;
  }
  endShape();

  // 1. MOVIMIENTO LENTO
  currentY += speed * direction;

  // 2. MUTACIÓN LENTA
  zOffset += morphSpeed;

  // 3. REBOTE SUAVE
  if (currentY >= height - marginY || currentY <= marginY) {
    direction *= -1;
  }
}
