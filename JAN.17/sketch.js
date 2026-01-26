let tileSize = 100;

function setup() {
  createCanvas(800, 800);
}

function draw() {
  background(255);

  // 1. DIBUJAR EL CIELO (Teselación Wallpaper Group p4m)
  // El cielo ocupa la mitad superior
  let skyHeight = height / 2;
  let wallpaperSize = 80;

  for (let x = 0; x < width; x += wallpaperSize) {
    for (let y = 0; y < skyHeight; y += wallpaperSize) {
      drawOpArtUnit(x, y, wallpaperSize);
    }
  }

  // 2. DIBUJAR EL PISO AJEDREZADO (Perspectiva 3D simple)
  drawCheckeredFloor(skyHeight);
}

// Función para el cielo estilo Op Art (Grupo p4m)
function drawOpArtUnit(x, y, size) {
  push();
  translate(x + size / 2, y + size / 2);

  for (let i = 0; i < 4; i++) {
    push();
    rotate(HALF_PI * i);

    // Región fundamental: Triángulos de alto contraste
    noStroke();
    fill(0); // Negro
    triangle(0, 0, size / 2, 0, size / 2, size / 2);

    fill(255, 0, 255); // Magenta neón para vibración Op Art
    triangle(0, 0, 0, size / 2, size / 2, size / 2);

    // Efecto de líneas internas para mayor ilusión óptica
    stroke(0, 255, 255); // Cian
    strokeWeight(1);
    for (let j = 0; j < size / 2; j += 5) {
      line(j, 0, size / 2, j);
    }

    pop();
  }
  pop();
}

// Función para el piso con perspectiva
function drawCheckeredFloor(horizonY) {
  let rows = 20;
  let cols = 40;
  let floorHeight = height - horizonY;

  for (let r = 0; r < rows; r++) {
    // Normalizamos el progreso de la fila (0 a 1)
    let yNorm = r / rows;

    // Usamos una función no lineal para la perspectiva (más juntas cerca del horizonte)
    let y1 = horizonY + pow(yNorm, 2) * floorHeight;
    let y2 = horizonY + pow((r + 1) / rows, 2) * floorHeight;

    for (let c = 0; c < cols; c++) {
      // Alternar colores blanco y negro
      if ((r + c) % 2 == 0) fill(0);
      else fill(255);

      noStroke();

      // Cálculo de los 4 puntos del trapecio (perspectiva)
      let xWidth1 = map(y1, horizonY, height, 20, width * 2);
      let xStep1 = xWidth1 / cols;
      let startX1 = width / 2 - xWidth1 / 2;

      let xWidth2 = map(y2, horizonY, height, 20, width * 2);
      let xStep2 = xWidth2 / cols;
      let startX2 = width / 2 - xWidth2 / 2;

      beginShape();
      vertex(startX1 + c * xStep1, y1);
      vertex(startX1 + (c + 1) * xStep1, y1);
      vertex(startX2 + (c + 1) * xStep2, y2);
      vertex(startX2 + c * xStep2, y2);
      endShape(CLOSE);
    }
  }
}
