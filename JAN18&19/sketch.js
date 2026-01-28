// ==========================================
// Langton's Ant Musical Sequencer
// 16-Step Acid Sequencer - TB-303 Style
// ==========================================

// === CONFIGURACIÓN ===
const GRID_SIZE = 16;
const CELL_SIZE = 30;
const GRID_WIDTH = GRID_SIZE * CELL_SIZE;
const SEQ_HEIGHT = 60; // Altura del secuenciador
const CANVAS_WIDTH = GRID_WIDTH;
const CANVAS_HEIGHT = GRID_WIDTH + SEQ_HEIGHT;

// === ESTADO GLOBAL ===
let grid = [];
let ant = { x: 8, y: 8, dir: 0 };
let rule = [-1, 1];
let numStates = 2;
let stepCount = 0;
let isPlaying = false;
let bpm = 120;
let lastStepTime = 0;

// === 16-STEP SEQUENCER ===
let currentStep = 0;
let sequence = new Array(16).fill(0);
let accents = new Array(16).fill(false);
let slides = new Array(16).fill(false);
let stepHistory = new Array(16).fill(null); // Historial visual

// Escala A menor pentatónica
const SCALE = [55, 65, 73, 82, 98, 110, 131, 147, 165, 196, 220, 262];

// === ACID BASS SYNTH ===
let osc;
let osc2;
let filter;
let env;

// === COLORES (TD-3-MO Yellow) ===
const COLORS = [
  '#1a1812', // Estado 0 - fondo oscuro
  '#F2D705', // Estado 1 - amarillo TD-3
  '#ffffff', // Estado 2 - blanco
  '#aa9500', // Estado 3 - amarillo oscuro
  '#ffdd33', // Estado 4 - amarillo claro
  '#3a3520', // Estado 5 - oliva oscuro
  '#ccb800', // Estado 6 - dorado
  '#ff9500', // Estado 7 - naranja
];

const DIRS = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
];

// ==========================================
// SETUP
// ==========================================
function setup() {
  // Forzar pixel density 1 para evitar gaps
  pixelDensity(1);
  
  const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent('canvas-container');
  
  // Forzar tamaño exacto del canvas
  canvas.style('width', CANVAS_WIDTH + 'px');
  canvas.style('height', CANVAS_HEIGHT + 'px');
  
  // Oscillador Sawtooth
  osc = new p5.Oscillator('sawtooth');
  osc.start();
  osc.amp(0);
  
  // Segundo oscillador Square
  osc2 = new p5.Oscillator('square');
  osc2.start();
  osc2.amp(0);
  
  // Filtro resonante
  filter = new p5.LowPass();
  filter.freq(800);
  filter.res(15);
  
  // Envelope para notas discretas
  env = new p5.Envelope();
  env.setADSR(0.01, 0.1, 0.2, 0.15);
  env.setRange(0.5, 0);
  
  // Conectar
  osc.disconnect();
  osc.connect(filter);
  osc2.disconnect();
  osc2.connect(filter);
  
  initGrid();
  initSequence();
  setupControls();
  
  noStroke();
  noSmooth(); // Evitar anti-aliasing que puede causar gaps
}

// ==========================================
// INICIALIZAR
// ==========================================
function initSequence() {
  for (let i = 0; i < 16; i++) {
    sequence[i] = 0;
    accents[i] = false;
    slides[i] = false;
    stepHistory[i] = null;
  }
  currentStep = 0;
}

function initGrid() {
  grid = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    grid[y] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      grid[y][x] = 0;
    }
  }
  ant = { x: 8, y: 8, dir: 0 };
  stepCount = 0;
}

// ==========================================
// LOOP PRINCIPAL
// ==========================================
function draw() {
  background(10, 14, 20);
  
  // Dibujar grilla
  drawGrid();
  drawAnt();
  
  // Dibujar secuenciador debajo
  drawSequencer();
  
  // Ejecutar steps
  if (isPlaying) {
    const stepInterval = 60000 / bpm / 4; // 16th notes
    if (millis() - lastStepTime >= stepInterval) {
      triggerStep();
      lastStepTime = millis();
    }
  }
}

// ==========================================
// TRIGGER STEP (NOTA DISCRETA)
// ==========================================
function triggerStep() {
  // Avanzar hormiga primero
  stepAnt();
  
  // Avanzar secuenciador
  currentStep = (currentStep + 1) % 16;
  
  // La posición Y de la hormiga determina la nota
  const noteIndex = ant.y % SCALE.length;
  const note = SCALE[noteIndex];
  
  // Estado de la celda determina accent
  const cellState = grid[ant.y][ant.x];
  const hasAccent = cellState > 0;
  
  // Guardar en secuencia
  sequence[currentStep] = note;
  accents[currentStep] = hasAccent;
  slides[currentStep] = (ant.dir === 1 || ant.dir === 3);
  
  // Guardar historial visual
  stepHistory[currentStep] = {
    note: note,
    accent: hasAccent,
    time: millis()
  };
  
  // === TRIGGER NOTA DISCRETA ===
  // Frecuencia
  osc.freq(note);
  osc2.freq(note / 2);
  
  // Filtro según accent
  if (hasAccent) {
    filter.freq(2500);
    env.setRange(0.6, 0);
  } else {
    filter.freq(1200);
    env.setRange(0.4, 0);
  }
  
  // Trigger envelope (esto hace que el sonido sea discreto)
  env.play(osc);
  env.play(osc2);
  
  stepCount++;
  updateInfo();
}

// ==========================================
// LÓGICA DEL AUTÓMATA
// ==========================================
function stepAnt() {
  const currentState = grid[ant.y][ant.x];
  const turn = rule[currentState];
  ant.dir = (ant.dir + turn + 4) % 4;
  
  const newState = (currentState + 1) % numStates;
  grid[ant.y][ant.x] = newState;
  
  const move = DIRS[ant.dir];
  ant.x = (ant.x + move.dx + GRID_SIZE) % GRID_SIZE;
  ant.y = (ant.y + move.dy + GRID_SIZE) % GRID_SIZE;
}

// ==========================================
// VISUALIZACIÓN
// ==========================================
function drawGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const state = grid[y][x];
      fill(COLORS[state % COLORS.length]);
      rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
  
  // Líneas de grilla
  stroke(30, 50, 60);
  strokeWeight(1);
  for (let i = 0; i <= GRID_SIZE; i++) {
    line(i * CELL_SIZE, 0, i * CELL_SIZE, GRID_WIDTH);
    line(0, i * CELL_SIZE, GRID_WIDTH, i * CELL_SIZE);
  }
  noStroke();
}

function drawAnt() {
  const cx = ant.x * CELL_SIZE + CELL_SIZE / 2;
  const cy = ant.y * CELL_SIZE + CELL_SIZE / 2;
  
  push();
  translate(cx, cy);
  rotate(ant.dir * HALF_PI);
  
  // Glow
  if (isPlaying) {
    noStroke();
    fill(242, 215, 5, 60);
    ellipse(0, 0, CELL_SIZE * 1.5, CELL_SIZE * 1.5);
  }
  
  fill(242, 215, 5);
  ellipse(0, 0, CELL_SIZE * 0.4, CELL_SIZE * 0.6);
  
  fill(30, 25, 10);
  ellipse(0, -CELL_SIZE * 0.25, CELL_SIZE * 0.25, CELL_SIZE * 0.25);
  
  pop();
}

function drawSequencer() {
  const seqY = GRID_WIDTH + 5;
  const stepWidth = GRID_WIDTH / 16;
  const barHeight = SEQ_HEIGHT - 10;
  
  // Fondo del secuenciador
  fill(5, 8, 12);
  rect(0, seqY, GRID_WIDTH, SEQ_HEIGHT);
  
  // Borde superior
  stroke(170, 130, 0);
  strokeWeight(2);
  line(0, seqY, GRID_WIDTH, seqY);
  noStroke();
  
  // Dibujar cada step
  for (let i = 0; i < 16; i++) {
    const x = i * stepWidth;
    const w = stepWidth; // Sin restar 1
    const stepData = stepHistory[i];
    
    // Fondo del step
    if (i % 4 === 0) {
      fill(20, 30, 35);
    } else {
      fill(12, 18, 22);
    }
    rect(x, seqY + 2, w, barHeight);
    
    // Step activo (pulse actual)
    if (i === currentStep && isPlaying) {
      fill(242, 215, 5, 150);
      rect(x, seqY + 2, w, barHeight);
    }
    
    // Dibujar nota si existe
    if (stepData && stepData.note > 0) {
      const noteHeight = map(stepData.note, SCALE[0], SCALE[SCALE.length-1], 8, barHeight - 4);
      const age = millis() - stepData.time;
      const fadeAlpha = max(50, 255 - age * 0.02);
      
      if (stepData.accent) {
        fill(242, 215, 5, fadeAlpha);
      } else {
        fill(180, 140, 5, fadeAlpha);
      }
      
      rect(x + 2, seqY + barHeight - noteHeight + 2, w - 4, noteHeight);
    }
    
    // Líneas divisorias
    if (i > 0) {
      stroke(30, 45, 50);
      strokeWeight(1);
      line(x, seqY + 2, x, seqY + SEQ_HEIGHT);
      noStroke();
    }
  }
  
  // Números de beat (1, 2, 3, 4)
  fill(60, 80, 90);
  textSize(10);
  textAlign(CENTER);
  for (let i = 0; i < 4; i++) {
    text(i + 1, i * 4 * stepWidth + stepWidth * 2, seqY + SEQ_HEIGHT - 3);
  }
}

// ==========================================
// CONTROLES UI
// ==========================================
function setupControls() {
  document.getElementById('playBtn').addEventListener('click', () => {
    isPlaying = true;
    lastStepTime = millis();
    updateInfo();
  });
  
  document.getElementById('pauseBtn').addEventListener('click', () => {
    isPlaying = false;
    updateInfo();
  });
  
  document.getElementById('resetBtn').addEventListener('click', () => {
    isPlaying = false;
    initGrid();
    initSequence();
    updateInfo();
  });
  
  const bpmSlider = document.getElementById('bpmSlider');
  const bpmValue = document.getElementById('bpmValue');
  bpmSlider.addEventListener('input', () => {
    bpm = parseInt(bpmSlider.value);
    bpmValue.textContent = bpm;
  });
  
  const ruleInput = document.getElementById('ruleInput');
  ruleInput.addEventListener('change', () => {
    parseRule(ruleInput.value.toUpperCase());
    initGrid();
    initSequence();
  });
}

function parseRule(ruleStr) {
  rule = [];
  for (const char of ruleStr) {
    if (char === 'L') rule.push(-1);
    else if (char === 'R') rule.push(1);
    else if (char === 'N') rule.push(0);
    else if (char === 'B' || char === 'U') rule.push(2);
  }
  if (rule.length === 0) rule = [-1, 1];
  numStates = rule.length;
}

function updateInfo() {
  document.getElementById('stepCount').textContent = stepCount;
  document.getElementById('status').textContent = isPlaying ? 
    `STEP ${currentStep + 1}/16` : 'STANDBY';
}

// ==========================================
// INTERACCIÓN
// ==========================================
function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}

function keyPressed() {
  if (key === ' ') {
    isPlaying = !isPlaying;
    if (isPlaying) lastStepTime = millis();
    updateInfo();
  }
  if (key === 'r' || key === 'R') {
    isPlaying = false;
    initGrid();
    initSequence();
    updateInfo();
  }
}
