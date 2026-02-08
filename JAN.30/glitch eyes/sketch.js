let tVertical = 0;
let tShake = 0; // Tiempo para el temblor rápido

function setup() {
  createCanvas(540, 960);
  pixelDensity(1);
  noSmooth();
  background(0);
}

function draw() {
  // 1. FONDO CON ESTELA (Un poco más oscura para más contraste)
  blendMode(BLEND);
  noStroke();
  fill(0, 40);
  rect(0, 0, width, height);

  // 2. MOTOR DE INTENSIDAD (Rango Aumentado)
  let n = noise(frameCount * 0.03); // Un poco más rápido
  tVertical += 0.05;
  tShake += 0.2; // Temblor muy rápido
  // SUBIMOS LA INTENSIDAD: Ahora va de 0.2 a 0.85 (antes era max 0.6)
  let intensidad = map(n, 0, 1, 0.2, 0.85);

  // 3. CONFIGURACIÓN DE POSICIÓN
  let eyeSize = 150;
  let baseY = height * 0.28;

  // --- NUEVO: INESTABILIDAD VERTICAL (JITTER) ---
  // Los ojos tiemblan verticalmente basado en el ruido rápido y la intensidad
  let shakeY = (noise(tShake) - 0.5) * 20 * intensidad;
  let eyeY = baseY + shakeY;

  let leftX = width * 0.3;
  let rightX = width * 0.7;

  // Cálculos de seguimiento (usando la nueva eyeY inestable)
  let angleL = atan2(mouseY - eyeY, mouseX - leftX);
  let angleR = atan2(mouseY - eyeY, mouseX - rightX);

  let maxPupilOffset = 25;
  let distL = min(dist(mouseX, mouseY, leftX, eyeY), maxPupilOffset);
  let distR = min(dist(mouseX, mouseY, rightX, eyeY), maxPupilOffset);

  let pupilLX = leftX + cos(angleL) * distL;
  let pupilLY = eyeY + sin(angleL) * distL;
  let pupilRX = rightX + cos(angleR) * distR;
  let pupilRY = eyeY + sin(angleR) * distR;

  // --- CAPA 1: GLOBO BLANCO CON RGB SHIFT (Más Agresivo) ---
  push();
  blendMode(ADD);
  // AUMENTAMOS EL DESPLAZAMIENTO RGB
  let shiftX = intensidad * 15; // Antes 8
  let shiftY = (noise(tVertical) - 0.5) * intensidad * 30; // Antes 15

  // R
  translate(shiftX, shiftY);
  dibujarOjo(leftX, eyeY, color(255, 0, 0), intensidad, eyeSize);
  dibujarOjo(rightX, eyeY, color(255, 0, 0), intensidad, eyeSize);
  // G
  translate(-shiftX * 2, -shiftY * 2);
  dibujarOjo(leftX, eyeY, color(0, 255, 0), intensidad, eyeSize);
  dibujarOjo(rightX, eyeY, color(0, 255, 0), intensidad, eyeSize);
  // B
  translate(shiftX, shiftY + 5);
  dibujarOjo(leftX, eyeY, color(0, 0, 255), intensidad, eyeSize);
  dibujarOjo(rightX, eyeY, color(0, 0, 255), intensidad, eyeSize);
  pop();

  // --- CAPA 2: PUPILAS NEGRAS ---
  push();
  blendMode(BLEND);
  fill(0);
  noStroke();
  let radioPupila =
    60 + sin(frameCount * 0.05) * 5 + noise(tShake) * 10 * intensidad; // Pupila también vibra
  ellipse(pupilLX, pupilLY, radioPupila, radioPupila);
  ellipse(pupilRX, pupilRY, radioPupila, radioPupila);
  fill(255);
  ellipse(pupilLX + 15, pupilLY - 15, 10, 10);
  ellipse(pupilRX + 15, pupilRY - 15, 10, 10);
  pop();

  // --- CAPA 3: EFECTOS GLITCH POST-PROCESADO ---

  // 3.1 Slit Scan Fino (Barrido horizontal existente)
  if (random(1) < 0.8) {
    // Más frecuente
    let numCortes = int(map(intensidad, 0, 1, 2, 8));
    for (let i = 0; i < numCortes; i++) {
      let h = random(2, 10);
      let y = random(height * 0.4); // Concentrados arriba
      let desvio = random(-1, 1) * intensidad * 50; // Más desvío
      let strip = get(0, y, width, h);
      push();
      blendMode(LIGHTEST);
      tint(random(200, 255), random(150, 220)); // Tinte blanco/gris brillante
      image(strip, desvio, y);
      pop();
    }
  }

  // 3.2 NUEVO: Data Mosh Pesado (Bloques Grandes)
  // Ocurre menos frecuentemente pero es más destructivo
  if (random(1) < 0.3 * intensidad) {
    let h = random(30, 80); // Bloques gruesos
    let y = random(height * 0.5); // Zona superior/media
    let desvio = random(-100, 100) * intensidad; // Desplazamiento grande
    let strip = get(0, y, width, h);
    push();
    // Usamos DIFFERENCE para invertir colores a veces, muy agresivo
    blendMode(random(1) > 0.7 ? DIFFERENCE : LIGHTEST);
    image(strip, desvio, y);
    pop();
  }

  // 3.3 NUEVO: Scanlines (Interferencia CRT)
  drawScanlines(intensidad);

  // 3.4 Pixelación y Ruido (Existentes)
  if (random(1) < intensidad * 0.4) drawPixelation(intensidad);
  drawNoise(intensidad);
}

// --- FUNCIONES AUXILIARES ---

function dibujarOjo(x, y, col, intens, size) {
  push();
  noStroke();
  fill(red(col), green(col), blue(col), 200);
  // Sombra más intensa
  drawingContext.shadowBlur = 25 * intens;
  drawingContext.shadowColor = col;
  ellipse(x, y, size, size);
  drawingContext.shadowBlur = 0;
  pop();
}

// NUEVA FUNCIÓN: Líneas de escaneo oscuras
function drawScanlines(intens) {
  push();
  blendMode(MULTIPLY); // Multiplicar oscurece la imagen
  noStroke();
  fill(0, map(intens, 0, 1, 50, 150)); // Opacidad variable
  // Dibujamos líneas negras cada 4 pixeles
  for (let i = 0; i < height; i += 4) {
    rect(0, i, width, 2);
  }
  pop();
}

function drawPixelation(intens) {
  push();
  blendMode(OVERLAY);
  noStroke();
  let pixelSize = random(10, 40);
  let numBlocks = int(random(5, 15)); // Más bloques
  for (let i = 0; i < numBlocks; i++) {
    let x = random(width);
    let y = random(height);
    // Bloques más oscuros para ensuciar
    fill(random(100), random(80, 150));
    rect(x, y, pixelSize, pixelSize);
  }
  pop();
}

function drawNoise(intens) {
  push();
  blendMode(SCREEN);
  strokeWeight(1.5);
  // Mucho más ruido
  let cantidadRuido = map(intens, 0, 1, 100, 400);
  for (let i = 0; i < cantidadRuido; i++) {
    stroke(random(150, 255), random(50, 120));
    point(random(width), random(height));
  }
  pop();
}
