/*
  ISLAMIC STAR PATTERNS - Patrones Verdaderamente Conectados
  Las líneas se extienden desde cada vértice hacia los vecinos
  
  Genuary 2026 - Day 17
*/

var time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(10, 15, 25);
  
  time += 0.4;
  
  // Parámetro d animado
  var d = 3 + sin(time) * 1;
  
  translate(width / 2, height / 2);
  
  drawConnectedPattern(d);
}

function drawConnectedPattern(d) {
  var r = 140;
  var spacing = r * 1.73; // Para grid hexagonal: sqrt(3)
  
  var cols = ceil(width / spacing) + 3;
  var rows = ceil(height / (spacing * 0.866)) + 3;
  
  // Almacenar todas las posiciones de centros
  var centers = [];
  
  for (var j = -rows; j <= rows; j++) {
    for (var i = -cols; i <= cols; i++) {
      var x = i * spacing;
      var y = j * spacing * 0.866;
      
      if (abs(j) % 2 === 1) {
        x += spacing / 2;
      }
      
      centers.push({x: x, y: y});
    }
  }
  
  stroke(0, 220, 220);
  strokeWeight(1.5);
  noFill();
  
  // Para cada centro, dibujar estrella y conectar con vecinos
  for (var c = 0; c < centers.length; c++) {
    var cx = centers[c].x;
    var cy = centers[c].y;
    
    // Puntos de la estrella de 12 puntas
    var n = 12;
    var points = [];
    for (var i = 0; i < n; i++) {
      var angle = (360 * i / n) - 90;
      points.push({
        x: cx + r * cos(angle),
        y: cy + r * sin(angle)
      });
    }
    
    // Dibujar líneas de estrella internas
    var dInt = round(d);
    for (var i = 0; i < n; i++) {
      var p1 = points[i];
      var p2 = points[(i + dInt) % n];
      line(p1.x, p1.y, p2.x, p2.y);
    }
    
    // Extender cada punta hacia el vecino más cercano
    for (var i = 0; i < n; i++) {
      var angle = (360 * i / n) - 90;
      var tipX = cx + r * cos(angle);
      var tipY = cy + r * sin(angle);
      
      // Extender en la misma dirección
      var extendDist = spacing - r;
      var endX = tipX + extendDist * cos(angle);
      var endY = tipY + extendDist * sin(angle);
      
      stroke(0, 200, 200);
      line(tipX, tipY, endX, endY);
    }
    
    // Roseta central
    stroke(60, 180, 200);
    strokeWeight(1);
    var innerR = r * 0.2;
    beginShape();
    for (var i = 0; i < n * 2; i++) {
      var angle = (360 * i / (n * 2)) - 90;
      var rad = (i % 2 === 0) ? innerR : innerR * 0.3;
      vertex(cx + rad * cos(angle), cy + rad * sin(angle));
    }
    endShape(CLOSE);
    
    stroke(0, 220, 220);
    strokeWeight(1.5);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}