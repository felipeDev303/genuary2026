let fondo;
let gradientBuffer; // Buffer para el gradiente

// Cubo isométrico
let cubeCenter;
let cubeSize;
let cubeRotation = 0;
let cubeVelocity; // Velocidad de movimiento

// Refracción por cara
let refractionStrength = 20;

function preload() {
  fondo = loadImage("fondo.jpg");
}

function setup() {
  let reelWidth = min(windowWidth, 1080);
  let reelHeight = reelWidth * (16/9);
  if (reelHeight > windowHeight) {
    reelHeight = windowHeight;
    reelWidth = reelHeight * (9/16);
  }
  createCanvas(reelWidth, reelHeight);
  cubeSize = min(width, height) * 0.3;
  noStroke();
  
  // Inicializar posición y velocidad
  cubeCenter = createVector(width/2, height/2);
  cubeVelocity = p5.Vector.random2D().mult(1.5); 
  // Evitar movimiento puramente vertical (si X es muy pequeño)
  if (abs(cubeVelocity.x) < 0.5) cubeVelocity.x = 0.8 * (random() > 0.5 ? 1 : -1);
  
  // Crear buffer con el gradiente
  createGradientBuffer();
}

function createGradientBuffer() {
  gradientBuffer = createGraphics(width, height);
  
  // Gradiente celeste-azul
  let c1 = color(5, 10, 30);      // Azul muy oscuro
  let c2 = color(60, 120, 210);   // Celeste azulado
  
  gradientBuffer.noFill();
  gradientBuffer.strokeWeight(1);
  
  for(let y=0; y<height; y++){
    let n = map(y, 0, height, 0, 1);
    let newc = lerpColor(c1, c2, n);
    gradientBuffer.stroke(newc);
    gradientBuffer.line(0, y, width, y);
  }
}

function draw() {
  // 1. Fondo principal: Imagen
  image(fondo, 0, 0, width, height);
  
  // Movimiento con colisiones
  cubeCenter.add(cubeVelocity);
  
  // Rebotar en los bordes
  let boundary = cubeSize * 0.55; // Margen reducido para acercarse más
  let bottomLimit = height * (2/3); // Límite inferior (2/3 de la pantalla)
  
  // Rebote Horizontal
  if (cubeCenter.x < boundary) {
    cubeVelocity.x = abs(cubeVelocity.x); // Asegurar dirección derecha
    cubeCenter.x = boundary;
  } else if (cubeCenter.x > width - boundary) {
    cubeVelocity.x = -abs(cubeVelocity.x); // Asegurar dirección izquierda
    cubeCenter.x = width - boundary;
  }
  
  // Rebote Vertical
  if (cubeCenter.y < boundary) {
    cubeVelocity.y = abs(cubeVelocity.y); // Asegurar dirección abajo
    cubeCenter.y = boundary;
  } else if (cubeCenter.y > bottomLimit - boundary) {
    cubeVelocity.y = -abs(cubeVelocity.y); // Asegurar dirección arriba
    cubeCenter.y = bottomLimit - boundary;
  }
  
  // Rotación horizontal continua
  cubeRotation += 0.01;
  
  // Calcular vértices del cubo 3D proyectado
  let s = cubeSize;
  let cx = cubeCenter.x;
  let cy = cubeCenter.y;
  
  // Cubo inclinado - perspectiva isométrica con rotación horizontal
  let tilt = 0.5; // Inclinación vertical
  
  // 8 vértices del cubo 3D
  let cubeVerts3D = [
    [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // Cara trasera
    [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]      // Cara frontal
  ];
  
  // Proyectar a 2D (Isométrico Real)
  let projected = cubeVerts3D.map(v => {
    // 1. Rotación en eje Y (horizontal)
    let ang = cubeRotation;
    let xr = v[0] * cos(ang) - v[2] * sin(ang);
    let zr = v[0] * sin(ang) + v[2] * cos(ang);
    let yr = v[1]; // Y no cambia en rotación Y
    
    // 2. Inclinación fija (Tilt) para vista desde arriba
    let tilt = PI / 5; // ~36 grados
    let yr2 = yr * cos(tilt) - zr * sin(tilt);
    let zr2 = yr * sin(tilt) + zr * cos(tilt); // Profundidad
    
    // 3. Proyección a pantalla
    return createVector(
      cx + xr * s * 0.5, 
      cy + yr2 * s * 0.5
    );
  });
  
  // Definir las 6 caras con offsets de refracción
  let allFaces = [
    { verts: [4, 5, 6, 7], normal: [0, 0, 1], offset: [0, refractionStrength] },      // Frontal
    { verts: [0, 3, 2, 1], normal: [0, 0, -1], offset: [0, -refractionStrength] },    // Trasera
    { verts: [0, 1, 5, 4], normal: [0, -1, 0], offset: [0, -refractionStrength] },    // Superior
    { verts: [3, 7, 6, 2], normal: [0, 1, 0], offset: [0, refractionStrength] },      // Inferior
    { verts: [0, 4, 7, 3], normal: [-1, 0, 0], offset: [-refractionStrength, 0] },    // Izquierda
    { verts: [1, 2, 6, 5], normal: [1, 0, 0], offset: [refractionStrength, 0] },      // Derecha
  ];
  
  // Filtrar caras visibles usando el mismo cálculo de rotación
  let visibleFaces = allFaces.filter(face => {
    // 1. Rotar normal en Y
    let ang = cubeRotation;
    let nxr = face.normal[0] * cos(ang) - face.normal[2] * sin(ang);
    let nzr = face.normal[0] * sin(ang) + face.normal[2] * cos(ang);
    let nyr = face.normal[1];
    
    // 2. Rotar normal en X (mismo tilt que la proyección)
    let tilt = PI / 5;
    let nz2 = nyr * sin(tilt) + nzr * cos(tilt); // Componente Z final (hacia cámara)
    
    // Si la componente Z es positiva, la cara mira hacia nosotros
    return nz2 > 0;
  });
  
  // Centro del cubo
  let center = createVector(cx, cy);
  
  // Dibujar las caras visibles
  for (let face of visibleFaces) {
    let verts = [
      projected[face.verts[0]],
      projected[face.verts[1]],
      projected[face.verts[2]],
      projected[face.verts[3]]
    ];
    drawFace(verts, face.offset[0], face.offset[1]);
  }
  
  // === ARISTAS HYPERSPACE SUTIL (MÁS TENUE) ===
  // 1. Resplandor suave (Flow)
  drawingContext.save();
  drawingContext.shadowBlur = 8;
  drawingContext.shadowColor = 'rgba(100, 200, 255, 0.4)'; // Glow más suave
  
  // 2. Línea núcleo (Fina y sutil)
  stroke(255, 255, 255, 100); // Mucho más transparente (antes 180)
  strokeWeight(1); // Vuelta a fino
  strokeJoin(ROUND);
  noFill();
  
  // Dibujar contorno de las caras visibles
  for (let face of visibleFaces) {
    beginShape();
    for (let vIdx of face.verts) {
      let v = projected[vIdx];
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
  
  drawingContext.restore();
  noStroke();
}

function drawFace(vertices, offsetX, offsetY) {
  push();
  
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i++) {
    drawingContext.lineTo(vertices[i].x, vertices[i].y);
  }
  drawingContext.closePath();
  drawingContext.clip();
  
  // 2. Usar la misma IMAGEN DE FONDO para el interior (Refracción real)
  noTint();
  image(fondo, offsetX, offsetY, width, height);
  
  drawingContext.restore();
  
  pop();
}

function windowResized() {
  let reelWidth = min(windowWidth, 1080);
  let reelHeight = reelWidth * (16/9);
  if (reelHeight > windowHeight) {
    reelHeight = windowHeight;
    reelWidth = reelHeight * (9/16);
  }
  resizeCanvas(reelWidth, reelHeight);
  cubeSize = min(width, height) * 0.3;
  createGradientBuffer(); // Recrear gradiente al cambiar tamaño
}

function keyPressed() {
  if (key === '+') {
    refractionStrength += 5;
  } else if (key === '-') {
    refractionStrength = max(0, refractionStrength - 5);
  } else if (key === 's') {
    cubeSize += 20;
  } else if (key === 'a') {
    cubeSize = max(50, cubeSize - 20);
  }
}
