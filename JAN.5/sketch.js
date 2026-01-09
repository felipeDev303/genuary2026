let word = "GENUARY";
let pg; 
let lines = 28; 

function setup() {
  createCanvas(600, 600);
  pixelDensity(1); 
  
  pg = createGraphics(width, height);
  pg.pixelDensity(1);
  
  pg.textAlign(CENTER, CENTER);
  pg.textSize(400); // Letra grande
  pg.textStyle(BOLD);
  pg.fill(255); 
  pg.noStroke();
}

function draw() {
  background(255); 
  stroke(0); 
  strokeCap(ROUND); 
  noFill();
  
  // --- CONTROL DE TIEMPO ---
  let timePerLetter = 120; 
  let totalFrames = word.length * timePerLetter;
  let frame = frameCount % totalFrames;
  let index = floor(frame / timePerLetter);
  
  // Animación suave de entrada y salida
  let localFrame = frame % timePerLetter;
  let progress = map(localFrame, 0, timePerLetter, 0, PI);
  let opacity = sin(progress); 
  
  // --- BUFFER DE TEXTO ---
  pg.background(0);
  pg.push();
  pg.translate(width/2, height/2);
  pg.fill(255 * opacity); 
  pg.text(word[index], 0, -20); 
  pg.pop();
  
  // Blur un poco más bajo para mantener definición pero suave
  pg.filter(BLUR, 8); 
  pg.loadPixels();

  // --- PARAMETROS DE DIBUJO ---
  let margin = 50;
  let drawingHeight = height - (margin * 2);
  let stepY = drawingHeight / lines; 

  // Configuración de sutileza
  let maxWeight = 7.0;  // Grosor máximo
  let maxCurve = 12.0;  // Desplazamiento máximo (Reducido para evitar choques)

  for (let i = 0; i <= lines; i++) {
    let yBase = margin + i * stepY;
    
    // Calculamos qué tan lejos está la línea del centro vertical (-1 a 1)
    let normY = map(yBase, margin, height - margin, -1, 1);
    
    // Suavizamos el factor de dirección:
    // Las líneas muy al centro apenas se mueven verticalmente, solo se ensanchan.
    // Las de los extremos se curvan más.
    let directionFactor = sign(normY) * pow(abs(normY), 1.5);

    // Loop horizontal para dibujar segmentos
    for (let x = 0; x < width; x += 5) {
      let nextX = x + 5;
      
      // -- Muestreo Pixel Actual --
      let idx = (floor(x) + floor(yBase) * width) * 4;
      let val = pg.pixels[idx]; 
      let amount = val / 255.0; // 0 a 1
      
      // -- Muestreo Pixel Siguiente --
      let nextIdx = (floor(nextX) + floor(yBase) * width) * 4;
      let nextVal = pg.pixels[nextIdx];
      let nextAmount = nextVal / 255.0;

      // -- CÁLCULOS --
      
      // 1. Curvatura (Desplazamiento Y)
      // Multiplicamos por amount para que solo se curve donde hay letra.
      let yOffset = directionFactor * amount * maxCurve;
      let nextYOffset = directionFactor * nextAmount * maxCurve;
      
      // 2. Grosor
      // Usamos una curva suave (sine) para el grosor
      let w = map(amount, 0, 1, 1.5, maxWeight);
      
      strokeWeight(w);
      line(x, yBase + yOffset, nextX, yBase + nextYOffset);
    }
  }
}

// Función auxiliar para obtener el signo (-1, 0, 1)
function sign(n) {
  if (n > 0) return 1;
  if (n < 0) return -1;
  return 0;
}