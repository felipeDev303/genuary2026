/**
 * Flujo Turbulento - Vórtices de Von Kármán
 * Con recirculación visible en la estela
 * Genuary 2026 - JAN.16
 */

let particles = [];
let numParticles = 2500;
let sphereX, sphereY;
let sphereRadius = 55;

function setup() {
  createCanvas(windowWidth, windowHeight);
  sphereX = width / 2;
  sphereY = height * 0.35;
  
  for (let i = 0; i < numParticles; i++) {
    let startY = map(i, 0, numParticles, -height * 2.5, height);
    particles.push(createParticle(random(width), startY));
  }
  
  background(0);
}

function createParticle(x, y) {
  return {
    x: x !== undefined ? x : random(width),
    y: y !== undefined ? y : random(-height, 0),
    vx: 0,
    vy: random(2, 2.5),
    life: random(0.6, 1)
  };
}

function updateParticle(p) {
  let dx = p.x - sphereX;
  let dy = p.y - sphereY;
  let dist = sqrt(dx * dx + dy * dy);
  let angle = atan2(dy, dx);
  
  let R = sphereRadius; // Radio de la esfera
  let effectiveR = R * 1.05;
  
  // Reducir velocidad horizontal
  p.vx *= 0.93;
  
  // ========== FLUJO POTENCIAL (SOLUCIÓN ANALÍTICA) ==========
  // Basado en flujo potencial real alrededor de un cilindro
  
  if (dist > effectiveR && dist < R * 6) {
    // Componentes de velocidad del flujo potencial
    // U∞ = velocidad del flujo libre (hacia abajo = +Y)
    let U = 2.5;
    
    // Factor de deformación del flujo
    let factor = (R * R) / (dist * dist);
    
    // Velocidad radial y tangencial en coordenadas polares
    // Para flujo alrededor de cilindro: Vr = U*cos(θ)*(1 - R²/r²)
    // Vθ = -U*sin(θ)*(1 + R²/r²)
    
    let cosA = dy / dist; // cos del ángulo respecto a Y
    let sinA = dx / dist; // sin del ángulo respecto a Y
    
    // Convertir a cartesianas
    let vxFlow = -U * factor * 2 * sinA * cosA;
    let vyFlow = U * (1 - factor * (cosA * cosA - sinA * sinA));
    
    // Aplicar solo la desviación (diferencia con flujo libre)
    let influence = pow(R / dist, 1.5);
    p.vx += vxFlow * influence * 0.3;
    p.vy = lerp(p.vy, vyFlow, influence * 0.1);
  }
  
  // Colisión con la esfera
  if (dist < effectiveR) {
    let pushForce = (effectiveR - dist) / effectiveR;
    p.vx += cos(angle) * pushForce * 4;
    p.vy += sin(angle) * pushForce * 2;
  }
  
  // ========== ESTELA CON VÓRTICES ==========
  if (p.y > sphereY + R * 0.3) {
    let distFromCenter = p.x - sphereX; // Con signo
    let distBehind = p.y - sphereY;
    let absDistFromCenter = abs(distFromCenter);
    
    // Ancho de la estela (más estrecha cerca, se expande lejos)
    let wakeWidth = R * 0.5 + distBehind * 0.08;
    wakeWidth = min(wakeWidth, R * 2);
    
    if (absDistFromCenter < wakeWidth) {
      let inWake = 1 - (absDistFromCenter / wakeWidth);
      inWake = pow(inWake, 0.7);
      
      // ===== NEAR WAKE: Vórtices de recirculación =====
      if (distBehind < R * 1.2) {
        let nearWakeStrength = 1 - (distBehind / (R * 1.2));
        nearWakeStrength = pow(nearWakeStrength, 0.5);
        
        // Dos vórtices contra-rotatorios
        let vortexCenterY = sphereY + R * 0.6;
        let vortexCenterXL = sphereX - R * 0.25;
        let vortexCenterXR = sphereX + R * 0.25;
        
        // Distancia a cada centro de vórtice
        let dxL = p.x - vortexCenterXL;
        let dyL = p.y - vortexCenterY;
        let distL = sqrt(dxL * dxL + dyL * dyL);
        
        let dxR = p.x - vortexCenterXR;
        let dyR = p.y - vortexCenterY;
        let distR = sqrt(dxR * dxR + dyR * dyR);
        
        let vortexRadius = R * 0.5;
        
        // Vórtice izquierdo (gira horario = hacia arriba en el centro)
        if (distL < vortexRadius && distL > 5) {
          let strength = (1 - distL / vortexRadius) * nearWakeStrength * 2;
          let angleL = atan2(dyL, dxL);
          // Rotación horaria: perpendicular en sentido horario
          p.vx += cos(angleL + HALF_PI) * strength;
          p.vy += sin(angleL + HALF_PI) * strength;
        }
        
        // Vórtice derecho (gira antihorario)
        if (distR < vortexRadius && distR > 5) {
          let strength = (1 - distR / vortexRadius) * nearWakeStrength * 2;
          let angleR = atan2(dyR, dxR);
          // Rotación antihoraria: perpendicular en sentido antihorario
          p.vx += cos(angleR - HALF_PI) * strength;
          p.vy += sin(angleR - HALF_PI) * strength;
        }
        
        // Flujo hacia arriba en el centro (recirculación)
        if (absDistFromCenter < R * 0.2 && distBehind < R * 0.8) {
          p.vy -= nearWakeStrength * inWake * 1.0;
        }
      }
      
      // ===== INTERMEDIATE WAKE: Turbulencia decayendo =====
      else if (distBehind < R * 2) {
        let turbDecay = 1 - ((distBehind - R * 1.2) / (R * 0.8));
        turbDecay = max(turbDecay, 0.1);
        
        // Turbulencia suave
        let n = noise(p.x * 0.02, p.y * 0.015, frameCount * 0.008);
        p.vx += (n - 0.5) * inWake * turbDecay * 1.2;
        
        // Convergencia más fuerte hacia el centro
        p.vx -= distFromCenter * 0.015 * turbDecay;
      }
      
      // ===== FAR WAKE: Reconexión del flujo =====
      else {
        // Las líneas convergen rápidamente y vuelven a ser paralelas
        p.vx -= distFromCenter * 0.025;
        p.vy = lerp(p.vy, 2.5, 0.12);
      }
    }
  }
  
  // Velocidad base fuera de la zona de influencia
  if (p.y < sphereY - R * 2) {
    p.vy = lerp(p.vy, 2.5, 0.1);
  }
  
  // Límites
  p.vx = constrain(p.vx, -5, 5);
  p.vy = constrain(p.vy, -3, 6);
  
  // Mover
  p.x += p.vx;
  p.y += p.vy;
  
  // Reciclar
  if (p.y > height + 50 || p.y < -height * 0.8 || p.x < -150 || p.x > width + 150) {
    p.x = random(width);
    p.y = random(-180, -30);
    p.vx = 0;
    p.vy = random(2, 2.5);
  }
}

function draw() {
  fill(0, 35);
  noStroke();
  rect(0, 0, width, height);
  
  for (let p of particles) {
    updateParticle(p);
    
    let alpha = 210 * p.life;
    stroke(0, 255, 65, alpha);
    strokeWeight(1.2);
    point(p.x, p.y);
  }
  
  drawSphere();
}

function drawSphere() {
  let r = sphereRadius;
  noStroke();
  
  for (let i = 15; i > 0; i--) {
    fill(0, 0, 0, 5);
    ellipse(sphereX + 4, sphereY + r + 10 + i * 0.8, r * 1.8 - i, 15);
  }
  
  for (let i = r; i > 0; i--) {
    let t = 1 - (i / r);
    let baseGray = lerp(25, 70, pow(t, 1.2));
    fill(baseGray, baseGray + 2, baseGray + 8);
    ellipse(sphereX, sphereY, i * 2, i * 2);
  }
  
  for (let i = r * 0.8; i > 0; i--) {
    let t = 1 - (i / (r * 0.8));
    let alpha = lerp(0, 40, pow(t, 2));
    fill(180, 185, 195, alpha);
    ellipse(sphereX - r * 0.2, sphereY + r * 0.15, i * 1.2, i * 1.4);
  }
  
  for (let i = r * 0.4; i > 0; i--) {
    let t = 1 - (i / (r * 0.4));
    let alpha = lerp(0, 35, pow(t, 1.5));
    fill(200, 205, 215, alpha);
    ellipse(sphereX - r * 0.35, sphereY - r * 0.3, i * 2, i * 1.8);
  }
  
  noFill();
  stroke(100, 105, 115, 50);
  strokeWeight(2);
  arc(sphereX, sphereY, r * 1.95, r * 1.95, PI + 0.8, TWO_PI - 0.8);
}

function mousePressed() {
  for (let i = 0; i < particles.length; i++) {
    let startY = map(i, 0, numParticles, -height * 2.5, height);
    particles[i].x = random(width);
    particles[i].y = startY;
    particles[i].vx = 0;
    particles[i].vy = random(2, 2.5);
  }
  background(0);
}

function keyPressed() {
  if (key === 's' || key === 'S') saveCanvas('flujo_vortices', 'png');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sphereX = width / 2;
  sphereY = height * 0.35;
  background(0);
}