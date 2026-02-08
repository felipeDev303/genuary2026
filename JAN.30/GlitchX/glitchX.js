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
  // 1. Usamos int() para forzar números enteros
  let x = 0; // Coordenada x de origen para copy; aquí empieza en el borde izquierdo.
  let y = int(random(height)); // Elige una fila vertical aleatoria (entera) dentro del alto del canvas.
  let w = width; // Ancho del área a copiar: todo el ancho del canvas.
  let h = int(random(5, 50)); // Alto del fragmento a copiar: aleatorio entre 5 y 50 píxeles (entero).

  // 2. El desplazamiento también debe ser entero
  let desplazamiento = int(random(-10, 10)); // Mueve horizontalmente el fragmento entre -10 y 9 píxeles (entero).

  // 3. Ahora copy() recibe solo enteros
  copy(x, y, w, h, x + desplazamiento, y, w, h);
  // Copia un rectángulo desde (x,y) de tamaño (w,h) y lo pega en (x+desplazamiento, y) con el mismo tamaño.
  // Esto crea el efecto "glitch" desplazando horizontalmente tiras aleatorias del lienzo.
}
