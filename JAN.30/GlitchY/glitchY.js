function setup() {
  createCanvas(400, 400); // Crea un lienzo de 400x400 píxeles donde se dibuja.
  background(20); // Pinta el fondo con un gris muy oscuro (valor 0-255).
  fill(0, 255, 150); // Define el color de relleno para formas y texto (verde-azulado).
  noStroke(); // Desactiva el contorno (borde) de las formas y del texto.
  textSize(80); // Ajusta el tamaño del texto a 80 píxeles.
  textAlign(CENTER, CENTER); // Centra el texto horizontal y verticalmente respecto a la coordenada dada.
  textStyle(BOLD); // Pone el texto en estilo **negrita**.
  text("GLITCH", width / 2, height / 2); // Dibuja la palabra "GLITCH" en el centro del canvas.
  frameRate(5); // Limita la velocidad de dibujo a 5 cuadros por segundo.
}

function draw() {
  // Origen: columna vertical aleatoria
  let y = 0; // empieza en la parte superior
  let x = int(random(width)); // Elige una fila vertical aleatoria (entera) dentro del alto del canvas.
  let h = height; // Alto del área a copiar: todo el alto del canvas.
  let w = int(random(5, 50)); // Ancho del fragmento a copiar: aleatorio entre 5 y 50 píxeles (entero).

  // 2. El desplazamiento también debe ser entero
  let desplazamientoY = int(random(-30, 30)); // Mueve arriba/abajo el fragmento entre -30 y 30 píxeles (entero).

  // 3. Ahora copy() recibe solo enteros
  copy(x, y, w, h, x, y + desplazamientoY, w, h);
  // Copia la columna y la pega desplazada verticalmente
  // copy(sx, sy, sw, sh, dx, dy, dw, dh)
}
