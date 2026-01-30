// Bauhaus Vinyl Poster - Genuary 2026 Day 21
// Colores Bauhaus
const BAUHAUS_CREAM = '#F5F0E1';
const BAUHAUS_YELLOW = '#F4C542';
const BAUHAUS_RED = '#E94B3C';
const BAUHAUS_BLUE = '#2D5DA1';
const BAUHAUS_BLACK = '#1A1A1A';

// Configuración vinilos
let vinyls = [];
const vinylCount = 4;

// Dimensiones del póster
let posterWidth, posterHeight;
let marginTop, marginBottom;

// Fuente Bauhaus
let bauhausFont;

function preload() {
  bauhausFont = loadFont('Bauhaus 93 400.ttf');
}

function setup() {
  // Formato vertical para redes sociales (9:16 - Stories/Reels/TikTok)
  posterHeight = min(windowHeight * 0.95, 1080);
  posterWidth = posterHeight * (9/16); // Ratio 9:16 vertical
  
  createCanvas(posterWidth, posterHeight);
  angleMode(DEGREES);
  
  // Márgenes para las letras
  marginTop = posterHeight * 0.15;
  marginBottom = posterHeight * 0.10;
  
  // Tamaño grande para superposición, pero respetando texto
  let vinylSize = posterWidth * 0.65;
  
  // Crear 4 vinilos - disposición como imagen referencia
  const labelColors = [BAUHAUS_BLUE, BAUHAUS_YELLOW, BAUHAUS_RED, BAUHAUS_BLACK];
  
  // Área segura para centros de vinilos
  let safeTop = marginTop + vinylSize * 0.4;
  let safeBottom = posterHeight - marginBottom - vinylSize * 0.4;
  let areaHeight = safeBottom - safeTop;
  
  // Posiciones: mayormente visibles, cortados por los LADOS
  const positions = [
    { x: vinylSize * 0.35, y: safeTop + areaHeight * 0.12 },      // Izq arriba
    { x: posterWidth - vinylSize * 0.35, y: safeTop + areaHeight * 0.38 },  // Der arriba  
    { x: vinylSize * 0.38, y: safeTop + areaHeight * 0.65 },      // Izq abajo
    { x: posterWidth - vinylSize * 0.32, y: safeTop + areaHeight * 0.88 }   // Der abajo
  ];
  
  for (let i = 0; i < vinylCount; i++) {
    vinyls.push({
      xAbs: positions[i].x,
      yAbs: positions[i].y,
      labelColor: labelColors[i],
      angle: random(360),
      speed: random(0.4, 0.7) * (i % 2 === 0 ? 1 : -1),
      size: vinylSize
    });
  }
}

function draw() {
  // Ocultar cursor
  noCursor();
  
  // Fondo crema estilo papel viejo
  background(BAUHAUS_CREAM);
  
  // Añadir textura de papel viejo
  drawPaperTexture();
  
  // Dibujar vinilos con posiciones absolutas
  // Efecto mouse: controla la velocidad de rotación como en el original
  let mouseEffect = map(mouseX, 0, width, -1, 1);
  
  for (let vinyl of vinyls) {
    drawVinyl(
      vinyl.xAbs,
      vinyl.yAbs,
      vinyl.size,
      vinyl.labelColor,
      vinyl.angle
    );
    vinyl.angle += vinyl.speed * (1 + mouseEffect);
  }
  
  // Título BAUHAUS superior
  drawBauhausTitle();
  
  // Subtítulo inferior
  drawSubtitle();
}

function drawPaperTexture() {
  // Textura sutil de papel viejo
  noStroke();
  for (let i = 0; i < 100; i++) {
    fill(0, 0, 0, random(3, 8));
    let x = random(width);
    let y = random(height);
    circle(x, y, random(1, 3));
  }
  
  // Manchas sutiles
  for (let i = 0; i < 15; i++) {
    fill(139, 119, 101, random(5, 12));
    let x = random(width);
    let y = random(height);
    ellipse(x, y, random(15, 50), random(15, 50));
  }
}

function drawVinyl(x, y, size, labelColor, angle) {
  push();
  translate(x, y);
  rotate(angle);
  
  // Disco negro con surcos - efecto de giro dinámico
  let grooveCount = 35;
  noFill();
  strokeWeight(1);
  stroke(BAUHAUS_BLACK);
  
  for (let i = 0; i < grooveCount; i++) {
    let ratio = map(i, 0, grooveCount, 0.35, 1);
    let grooveSize = size * ratio;
    
    // Arcos dinámicos que crean el efecto de giro
    arc(0, 0, grooveSize, grooveSize, angle * i * 0.1, 360 - angle * 0.5);
  }
  
  // Círculo exterior del vinilo
  noFill();
  stroke(BAUHAUS_BLACK);
  strokeWeight(2);
  circle(0, 0, size);
  
  // Etiqueta central con color Bauhaus
  noStroke();
  fill(labelColor);
  circle(0, 0, size * 0.32);
  
  // Círculo interior de la etiqueta (decorativo)
  stroke(0, 0, 0, 50);
  strokeWeight(1);
  noFill();
  circle(0, 0, size * 0.25);
  circle(0, 0, size * 0.18);
  
  // Agujero central - mismo color que el fondo
  fill(BAUHAUS_CREAM);
  noStroke();
  circle(0, 0, size * 0.05);
  
  pop();
}

function drawBauhausTitle() {
  push();
  
  // Título principal con fuente Bauhaus
  fill(BAUHAUS_BLACK);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(width * 0.14);
  textStyle(BOLD);
  textFont(bauhausFont);
  
  text('BAUHAUS', width / 2, height * 0.025);
  
  pop();
}

function drawSubtitle() {
  push();
  
  // Línea decorativa Bauhaus
  let lineY = height - marginBottom * 0.65;
  let lineWidth = width * 0.5;
  
  // Líneas de colores Bauhaus
  strokeWeight(3);
  
  stroke(BAUHAUS_BLUE);
  line(width / 2 - lineWidth / 2, lineY, width / 2 - lineWidth / 6, lineY);
  
  stroke(BAUHAUS_RED);
  line(width / 2 - lineWidth / 6, lineY, width / 2 + lineWidth / 6, lineY);
  
  stroke(BAUHAUS_YELLOW);
  line(width / 2 + lineWidth / 6, lineY, width / 2 + lineWidth / 2, lineY);
  
  // Año estilo póster
  fill(BAUHAUS_BLACK);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(width * 0.045);
  textStyle(BOLD);
  textFont(bauhausFont);
  text('GENUARY 2026 — DAY 21', width / 2, height - marginBottom * 0.3);
  
  pop();
}

function windowResized() {
  posterHeight = min(windowHeight * 0.95, 1080);
  posterWidth = posterHeight * (9/16);
  resizeCanvas(posterWidth, posterHeight);
  
  // Recalcular márgenes
  marginTop = posterHeight * 0.12;
  marginBottom = posterHeight * 0.10;
  
  // Actualizar tamaño y posiciones de vinilos
  let vinylSize = posterWidth * 0.65;
  let safeTop = marginTop + vinylSize * 0.35;
  let safeBottom = posterHeight - marginBottom - vinylSize * 0.35;
  let areaHeight = safeBottom - safeTop;
  
  const positions = [
    { x: vinylSize * 0.35, y: safeTop + areaHeight * 0.12 },
    { x: posterWidth - vinylSize * 0.35, y: safeTop + areaHeight * 0.38 },
    { x: vinylSize * 0.38, y: safeTop + areaHeight * 0.65 },
    { x: posterWidth - vinylSize * 0.32, y: safeTop + areaHeight * 0.88 }
  ];
  
  for (let i = 0; i < vinyls.length; i++) {
    vinyls[i].size = vinylSize;
    vinyls[i].xAbs = positions[i].x;
    vinyls[i].yAbs = positions[i].y;
  }
}