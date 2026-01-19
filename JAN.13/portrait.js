let video; // Variable para la cámara
let lcd;   // Buffer para la pantalla pequeña (84x48)
let scaleFactor = 10;

// AJUSTES DE COLORES NOKIA (Valores RGB para manipulación de píxeles)
// Color Claro (Fondo): #c7f0d8 -> R:199, G:240, B:216
const NOKIA_LIGHT_R = 199;
const NOKIA_LIGHT_G = 240;
const NOKIA_LIGHT_B = 216;

// Color Oscuro (Píxel activo): #43523d -> R:67, G:82, B:61
const NOKIA_DARK_R = 67;
const NOKIA_DARK_G = 82;
const NOKIA_DARK_B = 61;

// Sensibilidad del umbral (0 a 255). Ajusta esto si la imagen es muy oscura o clara.
let THRESHOLD_LEVEL = 110; 

function setup() {
  // 840x480 canvas principal
  createCanvas(84 * scaleFactor, 48 * scaleFactor);
  
  // IMPORTANTE: Mantiene los bordes duros al escalar
  noSmooth(); 
  
  // 1. Inicializar la cámara
  video = createCapture(VIDEO);
  video.size(640, 480); // Resolución de captura estándar
  video.hide(); // Ocultar el elemento de video HTML por defecto
  
  // 2. Creamos el "canvas virtual" diminuto
  lcd = createGraphics(84, 48);
  lcd.noSmooth(); // Aseguramos que el buffer tampoco suavice
}

function draw() {
  background(0);

  // --- PASO 1: DIBUJAR Y REDUCIR ---
  // Dibujamos el video gigante dentro del buffer diminuto.
  // Esto fuerza la imagen a tener 84x48 píxeles.
  lcd.image(video, 0, 0, 84, 48);

  // --- PASO 2: UMBRALIZACIÓN (LA MAGIA NOKIA) ---
  // Aquí convertimos la imagen a solo 2 colores estrictos.
  
  lcd.loadPixels(); // Preparamos el array de píxeles para editarlo

  // Recorremos cada píxel del buffer diminuto
  // El array 'pixels' tiene 4 valores por píxel: Rojo, Verde, Azul, Alpha
  for (let i = 0; i < lcd.pixels.length; i += 4) {
    // Obtenemos los valores RGB actuales del píxel
    let r = lcd.pixels[i];
    let g = lcd.pixels[i + 1];
    let b = lcd.pixels[i + 2];

    // Calculamos el brillo promedio simple
    let brightness = (r + g + b) / 3;

    // Decidimos el color final basado en el umbral
    if (brightness > THRESHOLD_LEVEL) {
      // Si es brillante, usar el color Claro Nokia
      lcd.pixels[i]     = NOKIA_LIGHT_R;
      lcd.pixels[i + 1] = NOKIA_LIGHT_G;
      lcd.pixels[i + 2] = NOKIA_LIGHT_B;
    } else {
      // Si es oscuro, usar el color Oscuro Nokia
      lcd.pixels[i]     = NOKIA_DARK_R;
      lcd.pixels[i + 1] = NOKIA_DARK_G;
      lcd.pixels[i + 2] = NOKIA_DARK_B;
    }
    // El valor Alpha (i+3) lo dejamos al máximo (255)
    lcd.pixels[i+3] = 255;
  }
  
  lcd.updatePixels(); // Aplicamos los cambios al buffer

  // --- PASO 3: RENDERIZAR AL MUNDO REAL (Grande) ---
  // Dibujamos el buffer pequeño estirado a todo el canvas grande
  image(lcd, 0, 0, width, height);
  
  // --- PASO 4: EFECTO DE REJILLA FÍSICA ---
  drawGrid();
}

// Función para dibujar la separación entre píxeles
function drawGrid() {
  stroke(67, 82, 61, 50); // Color oscuro semi-transparente
  strokeWeight(1);
  
  // Líneas Verticales
  for (let x = 0; x <= width; x += scaleFactor) {
    line(x, 0, x, height);
  }
  
  // Líneas Horizontales
  for (let y = 0; y <= height; y += scaleFactor) {
    line(0, y, width, y);
  }
}