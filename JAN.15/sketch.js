/**
 * JAN.15 - La Cueva del Arquitecto
 * "Create an invisible object where only the shadows can be seen"
 * 
 * El agujero negro es invisible - solo lo vemos porque bloquea
 * la radiación del flame fractal detrás de él.
 * La sombra revela al objeto invisible.
 */

let hitCount;
let maxHits = 0;
let transforms = [];
let numTransforms = 5;

// El agujero negro invisible - fijo en el centro
let blackHole = {
  x: 0,
  y: 0,
  radius: 80
};

// Puntos del flame
let flamePoint;

// Buffer para el fractal
let fractalBuffer;

function setup() {
  createCanvas(800, 800);
  pixelDensity(1);
  
  // Buffer para acumular el flame fractal
  fractalBuffer = createGraphics(width, height);
  fractalBuffer.background(0);
  fractalBuffer.stroke(255, 3);
  
  // Inicializar
  hitCount = new Float32Array(width * height);
  generateTransforms();
  flamePoint = createVector(random(-1, 1), random(-1, 1));
  
  // Posición fija del agujero negro en el centro
  blackHole.x = width / 2;
  blackHole.y = height / 2;
  
  background(0);
}

function generateTransforms() {
  transforms = [];
  
  for (let i = 0; i < numTransforms; i++) {
    let t = {
      a: random(-1.2, 1.2),
      b: random(-1.2, 1.2),
      c: random(-1.2, 1.2),
      d: random(-1.2, 1.2),
      e: random(-0.5, 0.5),
      f: random(-0.5, 0.5),
      weight: random(0.1, 1),
      variation: floor(random(12))
    };
    transforms.push(t);
  }
  
  // Normalizar pesos
  let totalWeight = transforms.reduce((sum, t) => sum + t.weight, 0);
  transforms.forEach(t => t.weight /= totalWeight);
}

// Variaciones no lineales del algoritmo Flame
function applyVariation(x, y, type) {
  let r2 = x * x + y * y + 0.0001;
  let r = sqrt(r2);
  let theta = atan2(y, x);
  
  switch(type) {
    case 0: // Linear
      return { x: x, y: y };
    case 1: // Sinusoidal
      return { x: sin(x), y: sin(y) };
    case 2: // Spherical
      return { x: x / r2, y: y / r2 };
    case 3: // Swirl
      return { 
        x: x * sin(r2) - y * cos(r2), 
        y: x * cos(r2) + y * sin(r2) 
      };
    case 4: // Horseshoe
      return { 
        x: (x - y) * (x + y) / r, 
        y: 2 * x * y / r 
      };
    case 5: // Polar
      return { x: theta / PI, y: r - 1 };
    case 6: // Handkerchief
      return { 
        x: r * sin(theta + r), 
        y: r * cos(theta - r) 
      };
    case 7: // Heart
      return { 
        x: r * sin(theta * r), 
        y: -r * cos(theta * r) 
      };
    case 8: // Disc
      return {
        x: theta / PI * sin(PI * r),
        y: theta / PI * cos(PI * r)
      };
    case 9: // Spiral
      return {
        x: (cos(theta) + sin(r)) / r,
        y: (sin(theta) - cos(r)) / r
      };
    case 10: // Hyperbolic
      return {
        x: sin(theta) / r,
        y: r * cos(theta)
      };
    case 11: // Diamond
      return {
        x: sin(theta) * cos(r),
        y: cos(theta) * sin(r)
      };
    default:
      return { x: x, y: y };
  }
}

function iterate(p) {
  // Seleccionar transformación basada en peso
  let r = random();
  let cumWeight = 0;
  let selectedTransform = transforms[0];
  
  for (let t of transforms) {
    cumWeight += t.weight;
    if (r <= cumWeight) {
      selectedTransform = t;
      break;
    }
  }
  
  let t = selectedTransform;
  
  // Aplicar transformación afín
  let newX = t.a * p.x + t.b * p.y + t.e;
  let newY = t.c * p.x + t.d * p.y + t.f;
  
  // Aplicar variación no lineal
  let varied = applyVariation(newX, newY, t.variation);
  
  p.x = varied.x;
  p.y = varied.y;
}

function draw() {
  // El agujero negro permanece fijo en el centro
  
  // Iterar el flame fractal en el buffer
  let iterationsPerFrame = 30000;
  
  for (let i = 0; i < iterationsPerFrame; i++) {
    iterate(flamePoint);
    
    // Mapear a coordenadas de pantalla
    let screenX = map(flamePoint.x, -2, 2, 0, width);
    let screenY = map(flamePoint.y, -2, 2, 0, height);
    
    // Solo dibujar si está dentro de la pantalla
    if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
      // Dibujar en el buffer del fractal (blanco con alpha muy bajo)
      fractalBuffer.point(screenX, screenY);
    }
  }
  
  // Dibujar el buffer del fractal
  image(fractalBuffer, 0, 0);
  
  // Dibujar el agujero negro encima (el objeto invisible)
  // Solo vemos su silueta porque bloquea el fractal
  drawBlackHole(blackHole.x, blackHole.y, blackHole.radius);
}

function drawBlackHole(x, y, radius) {
  // El agujero negro: completamente negro, sin bordes
  // Es "invisible" pero lo vemos porque bloquea la luz detrás
  // Se integra perfectamente con el fondo negro
  
  noStroke();
  fill(0);
  ellipse(x, y, radius * 2, radius * 2);
}

function mousePressed() {
  // Click para regenerar el flame fractal
  fractalBuffer.background(0);
  hitCount = new Float32Array(width * height);
  maxHits = 0;
  generateTransforms();
  flamePoint = createVector(random(-1, 1), random(-1, 1));
}

function mouseMoved() {
  // El agujero negro sigue al mouse suavemente
  blackHole.targetX = mouseX;
  blackHole.targetY = mouseY;
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('architect_cave_' + Date.now(), 'png');
  }
  
  if (key === 'r' || key === 'R') {
    mousePressed();
  }
  
  if (key === '+' || key === '=') {
    blackHole.radius = min(blackHole.radius + 10, 200);
  }
  
  if (key === '-' || key === '_') {
    blackHole.radius = max(blackHole.radius - 10, 30);
  }
}
