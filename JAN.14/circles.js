let circles = [];
let totalCircles = 240;
let containerRadius;

// Variables de Audio
let mic;
let fft;
let audioSourceSelect; // El menú desplegable

// Estados
let activeCount = 0;
let isResetting = false;
let resetTimer = 0;
let resetWaveRadius = 0;

// Configuración Física
const VISUAL_R = 4.5;
const DAMPING = 0.94;
const ELASTICITY = 0.012;

// Escala Global Dinámica
let currentGlobalScale = 1.0;

function setup() {
  createCanvas(600, 600);
  containerRadius = width / 2;

  // --- CONFIGURACIÓN DE AUDIO AVANZADA ---
  mic = new p5.AudioIn();
  mic.start();

  fft = new p5.FFT(0.8, 1024);
  fft.setInput(mic);

  // 1. Obtener lista de dispositivos (Voicemeeter, Mic, etc.)
  mic.getSources(function (deviceList) {
    // Crear menú desplegable fuera del canvas
    audioSourceSelect = createSelect();
    audioSourceSelect.position(10, 610); // Abajo del canvas

    // Llenar el menú con las opciones disponibles
    for (let i = 0; i < deviceList.length; i++) {
      // Solo nos interesan las entradas de audio (audioinput)
      if (deviceList[i].kind === "audioinput") {
        audioSourceSelect.option(deviceList[i].label, deviceList[i].deviceId);
      }
    }

    // Cuando el usuario cambie la opción...
    audioSourceSelect.changed(changeAudioInput);
  });

  generatePhyllotaxis();
}

// Función para cambiar la entrada cuando seleccionas en el menú
function changeAudioInput() {
  let id = audioSourceSelect.value(); // Obtener ID del dispositivo seleccionado
  mic.setSource(id); // Decirle al micro que escuche de ese ID

  // Reiniciar el motor de audio para aplicar el cambio
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}

function generatePhyllotaxis() {
  circles = [];
  let c = 16;
  for (let i = 0; i < totalCircles; i++) {
    let angle = i * 137.508;
    let r = c * sqrt(i);
    let x = width / 2 + r * cos(radians(angle));
    let y = height / 2 + r * sin(radians(angle));
    circles.push(new Circle(x, y));
  }
}

function draw() {
  background(0);

  // --- ANÁLISIS DE AUDIO ---
  let spectrum = fft.analyze();
  let bassEnergy = fft.getEnergy("bass");
  let lowMidEnergy = fft.getEnergy("lowMid");

  // Respiración visual
  let targetMusicScale = map(bassEnergy, 0, 255, 1.0, 2.8);
  currentGlobalScale = lerp(currentGlobalScale, targetMusicScale, 0.1);

  // --- DETECCIÓN DE GOLPES (BEATS) ---
  // Umbral ajustado: Al usar Voicemeeter la señal es más limpia y fuerte.
  // Quizás necesites subir esto a 210 o 220 si se activa demasiado.
  let beatThreshold = 200;

  if (!isResetting && activeCount < circles.length) {
    if (bassEnergy > beatThreshold && frameCount % 2 === 0) {
      let options = circles.filter((c) => !c.active);
      if (options.length > 0) {
        let chosen = random(options);
        chosen.activate();
        activeCount++;

        let shockStrength = map(bassEnergy, 200, 255, 50, 150);
        triggerGlobalShockwave(chosen, shockStrength);
      }
    }
  }

  // --- RESETEO ---
  if (activeCount >= circles.length && !isResetting) {
    resetTimer++;
    if (resetTimer > 100) {
      isResetting = true;
      resetWaveRadius = 0;
    }
  }

  if (isResetting) {
    resetWaveRadius += 4;
    let allReset = true;
    for (let c of circles) {
      let d = dist(c.pos.x, c.pos.y, width / 2, height / 2);
      if (d < resetWaveRadius) c.deactivate();
      if (!c.isFullyReset()) allReset = false;
    }
    if (allReset && resetWaveRadius > width) {
      isResetting = false;
      activeCount = 0;
      resetTimer = 0;
    }
  }

  // --- FÍSICA ---
  for (let i = 0; i < 2; i++) applyIntegratedPhysics(lowMidEnergy);

  // --- DIBUJAR ---
  for (let c of circles) {
    c.update();
    c.show();
  }
}

function triggerGlobalShockwave(origin, strength) {
  for (let other of circles) {
    if (other !== origin) {
      let dx = other.pos.x - origin.pos.x;
      let dy = other.pos.y - origin.pos.y;
      let distSq = dx * dx + dy * dy;
      let d = sqrt(distSq);

      let forceMagnitude = (strength * currentGlobalScale) / (d + 10);

      let angle = atan2(dy, dx);
      other.acc.x += cos(angle) * forceMagnitude;
      other.acc.y += sin(angle) * forceMagnitude;
    }
  }
}

function applyIntegratedPhysics(energyLevel) {
  let noiseSpeed = frameCount * 0.01;
  let vibration = map(energyLevel, 0, 255, 0.01, 0.08);

  for (let i = 0; i < circles.length; i++) {
    let c = circles[i];

    // ANCLAJE
    let hx = c.homePos.x - c.pos.x;
    let hy = c.homePos.y - c.pos.y;
    c.acc.x += hx * ELASTICITY;
    c.acc.y += hy * ELASTICITY;

    // VIDA MUSICAL
    c.acc.x += map(
      noise(c.pos.x * 0.01, noiseSpeed),
      0,
      1,
      -vibration,
      vibration,
    );
    c.acc.y += map(
      noise(c.pos.y * 0.01, noiseSpeed + 100),
      0,
      1,
      -vibration,
      vibration,
    );

    // INTERACCIÓN
    for (let j = i + 1; j < circles.length; j++) {
      let other = circles[j];
      let dx = other.pos.x - c.pos.x;
      let dy = other.pos.y - c.pos.y;
      let distSq = dx * dx + dy * dy;

      let sizeA = c.active ? currentGlobalScale : 1.0;
      let sizeB = other.active ? currentGlobalScale : 1.0;
      let senseR = 18 * sizeA + 18 * sizeB;

      if (distSq < senseR * senseR) {
        let d = sqrt(distSq);
        if (d < 1) d = 1;

        let forcePct = (senseR - d) / senseR;
        let force = forcePct * 0.4;

        let fx = (dx / d) * force;
        let fy = (dy / d) * force;

        other.acc.x += fx;
        other.acc.y += fy;
        c.acc.x -= fx;
        c.acc.y -= fy;
      }
    }

    c.vel.x += c.acc.x;
    c.vel.y += c.acc.y;
    c.vel.x *= DAMPING;
    c.vel.y *= DAMPING;
    c.pos.x += c.vel.x;
    c.pos.y += c.vel.y;
    c.acc.set(0, 0);
  }
}

class Circle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.homePos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.active = false;
    this.alpha = 0;
    this.scale = 1.0;
  }

  activate() {
    this.active = true;
    this.scale = 1.5;
  }

  deactivate() {
    this.active = false;
  }

  isFullyReset() {
    return !this.active && this.alpha < 1;
  }

  update() {
    let targetScale = this.active ? currentGlobalScale : 1.0;
    this.scale = lerp(this.scale, targetScale, 0.1);

    if (this.active) {
      this.alpha = lerp(this.alpha, 255, 0.2);
    } else {
      this.alpha = lerp(this.alpha, 0, 0.05);
    }
  }

  show() {
    stroke(255);
    strokeWeight(1.5);
    fill(255, this.alpha);
    let r = VISUAL_R * this.scale;
    ellipse(this.pos.x, this.pos.y, r * 2);
  }
}

// Activador de audio necesario para navegadores
function touchStarted() {
  if (getAudioContext().state !== "running") {
    getAudioContext().resume();
  }
}
