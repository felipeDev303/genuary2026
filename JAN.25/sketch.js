let cells = [];
let maxCells = 32;
let step = 10; // Resolución del halftone

function setup() {
  createCanvas(1080, 1350);
  // Comenzamos con una sola célula en el centro
  cells.push(new Cell(width / 2, height / 2, 60));
}

function draw() {
  background(0);

  // 1. Actualizar y dividir células automáticamente
  for (let i = cells.length - 1; i >= 0; i--) {
    cells[i].update();

    // Si la célula está lista y no hemos llegado a 32, se divide
    if (cells[i].readyToDivide() && cells.length < maxCells) {
      cells.push(cells[i].divide());
    }
  }

  // 2. Renderizado Halftone (Metaballs masivas)
  fill(255, 0, 0);
  noStroke();

  for (let x = 0; x <= width; x += step) {
    for (let y = 0; y <= height; y += step) {
      let totalInfluence = 0;

      // Sumamos la influencia de TODAS las células existentes
      for (let c of cells) {
        let d = dist(x, y, c.pos.x, c.pos.y);
        totalInfluence += pow(c.r / d, 2.5);
      }

      let diameter = totalInfluence * step;
      diameter = constrain(diameter, 0, step * 1.5);

      if (diameter > 1.2) {
        let n = noise(x * 0.05, y * 0.05, frameCount * 0.05);
        ellipse(x, y, diameter * n, diameter * n);
      }
    }
  }

  // Contador en pantalla
  fill(255);
}

class Cell {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(0.5); // Movimiento orgánico
    this.r = r;
    this.timer = 0;
    this.divisionInterval = floor(random(100, 200)); // Tiempo aleatorio para dividir
  }

  update() {
    this.pos.add(this.vel);
    this.timer++;

    // Rebote sutil en los bordes
    if (this.pos.x < 100 || this.pos.x > width - 100) this.vel.x *= -1;
    if (this.pos.y < 100 || this.pos.y > height - 100) this.vel.y *= -1;

    // Separación entre células (fuerza de repulsión)
    for (let other of cells) {
      if (other !== this) {
        let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
        if (d < this.r * 1.5) {
          let repulse = p5.Vector.sub(this.pos, other.pos);
          repulse.setMag(0.1);
          this.vel.add(repulse);
        }
      }
    }
    this.vel.limit(1.5);
  }

  readyToDivide() {
    return this.timer > this.divisionInterval;
  }

  divide() {
    this.timer = 0;
    this.r *= 0.85; // Se hacen un poco más pequeñas al dividirse
    // Retorna una nueva célula en la misma posición
    return new Cell(this.pos.x, this.pos.y, this.r);
  }
}
