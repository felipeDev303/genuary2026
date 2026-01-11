const PALETTE = {
  skyTop: "#051040",
  skyBottom: "#E05090",
  bldgBody: "#080818",
  bldgSide: "#020205",
  winWhite: "#D0E0FF",
  winGold: "#FFC050",
  winCyan: "#00FFFF",
  roadAsphalt: "#000000",
  roadGreen: "#00FF00",

  carBody: "#60C0E0",
  carRoof: "#FFFFFF",

  signGreen: "#008844",
  signBorder: "#FFFFFF",
  poleGray: "#505050",
  fenceRed: "#FF0000",
  fenceWhite: "#FFFFFF",
};

let horizon;
let speed = 400;
let posZ = 0;
let curveAmt = 0;
let skyline = [];
let signs = [];
let noiseLayer;

const FIXED_CURVE = 200;

function setup() {
  createCanvas(600, 700);
  noSmooth();

  horizon = height * 0.6;

  generateSkyline();

  for (let z = 2000; z < 45000; z += 6000) {
    signs.push(createSign(z, -1));
    signs.push(createSign(z, 1));
  }

  noiseLayer = createGraphics(width, height);
  noiseLayer.noStroke();
  noiseLayer.fill(255, 12);
  for (let i = 0; i < width * height * 0.08; i++) {
    noiseLayer.rect(random(width), random(height), 1, 1);
  }
}

function draw() {
  posZ += speed;

  if (keyIsDown(LEFT_ARROW)) curveAmt -= 0.5;
  if (keyIsDown(RIGHT_ARROW)) curveAmt += 0.5;

  drawRetroSky();
  drawStars();
  drawNagaiSkyline();
  drawRoadAndFences();
  drawHighwaySigns();
  drawRGBCar();
  drawRetroFilters();
  drawHUD();
}

function createSign(zPos, sideForce) {
  return {
    z: zPos,
    type: floor(random(3)),
    side: sideForce,
  };
}

function drawHighwaySigns() {
  signs.sort((a, b) => b.z - a.z);

  for (let s of signs) {
    s.z -= speed;

    if (s.z < 10) {
      s.z = 45000;

      s.type = floor(random(3));
    }

    let scale = 600 / s.z;
    let approxDy = 600 / s.z;
    let curveShift = FIXED_CURVE * 2 * (approxDy * approxDy);

    let worldX = width / 2 - curveShift + 1300 * scale * s.side;

    let renderX = worldX + curveAmt * scale;
    let renderY = horizon + 100 * scale;

    if (s.z > 20 && renderX > -400 && renderX < width + 400) {
      drawSingleSign(renderX, renderY, scale, s.type, s.side);
    }
  }
}

function drawSingleSign(x, y, scale, type, side) {
  let w = 220 * scale;
  let h = 120 * scale;
  let poleH = 200 * scale;
  let poleW = 12 * scale;

  push();
  noStroke();

  fill(0, 100);
  ellipse(x + (side === 1 ? w * 0.5 : -w * 0.5), y + poleH, w * 0.8, poleW * 3);

  fill(PALETTE.poleGray);
  let poleX1 = x + (side === 1 ? w * 0.2 : -w * 0.2);
  let poleX2 = x + (side === 1 ? w * 0.8 : -w * 0.8);

  let boardX = side === 1 ? x : x - w;

  rect(poleX1, y, poleW, poleH);
  rect(poleX2, y, poleW, poleH);

  let boardY = y;

  fill(0, 80);
  rect(boardX + 10 * scale, boardY + 10 * scale, w, h);

  fill(PALETTE.signBorder);
  rect(boardX, boardY, w, h);

  fill(PALETTE.signGreen);
  rect(boardX + 2 * scale, boardY + 2 * scale, w - 4 * scale, h - 4 * scale);

  fill(255);

  if (type === 0) {
    beginShape();
    vertex(boardX + w * 0.8, boardY + h * 0.6);
    vertex(boardX + w * 0.9, boardY + h * 0.7);
    vertex(boardX + w * 0.8, boardY + h * 0.8);
    endShape(CLOSE);
    rect(boardX + w * 0.82, boardY + h * 0.4, w * 0.05, h * 0.3);

    rect(boardX + w * 0.1, boardY + h * 0.2, w * 0.6, h * 0.2);
    rect(boardX + w * 0.1, boardY + h * 0.5, w * 0.4, h * 0.2);
  } else if (type === 1) {
    rect(boardX + w * 0.1, boardY + h * 0.15, w * 0.8, h * 0.15);
    rect(boardX + w * 0.1, boardY + h * 0.4, w * 0.8, h * 0.15);
    rect(boardX + w * 0.1, boardY + h * 0.65, w * 0.8, h * 0.15);
  } else {
    rect(boardX + w * 0.2, boardY + h * 0.3, w * 0.6, h * 0.4);
  }

  pop();
}

function drawRoadAndFences() {
  fill(PALETTE.roadAsphalt);
  noStroke();
  rect(0, horizon, width, height - horizon);

  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = PALETTE.roadGreen;

  for (let y = horizon + 1; y < height; y += 2) {
    let dy = (y - horizon) / (height - horizon);
    let perspective = pow(dy, 3);

    let minW = width * 0.05;
    let maxW = width * 8.0;
    let roadW = minW + maxW * perspective;

    let fixedCurveX = FIXED_CURVE * 2 * (dy * dy);
    let centerX = width / 2 - fixedCurveX;
    let worldZ = posZ * pow(dy, 0.7);

    fill(PALETTE.roadGreen);
    let lineThick = map(dy, 0, 1, 2, 18);
    let xL = centerX - roadW * 0.5;
    let xR = centerX + roadW * 0.5;

    let segment = floor(worldZ / 60) % 2;
    if (segment === 0) {
      rect(xL, y, lineThick, 2);
      rect(xR - lineThick, y, lineThick, 2);
      rect(centerX - roadW * 0.166 - lineThick / 2, y, lineThick, 2);
      rect(centerX + roadW * 0.166 - lineThick / 2, y, lineThick, 2);
    }

    drawingContext.shadowBlur = 0;
    let fenceH = map(dy, 0, 1, 2, 25);
    let fenceW = map(dy, 0, 1, 2, 20);
    let fenceSeg = floor(worldZ / 40) % 2;

    fill(fenceSeg === 0 ? PALETTE.fenceRed : PALETTE.fenceWhite);
    rect(xL - fenceW - 4, y - fenceH, fenceW, fenceH);
    rect(xR + 4, y - fenceH, fenceW, fenceH);

    drawingContext.shadowBlur = 15;
  }
  drawingContext.shadowBlur = 0;
}

function drawRGBCar() {
  push();
  translate(0, 10);
  blendMode(ADD);
  tint(255, 50, 50, 150);
  drawCar(4, 0);
  tint(0, 255, 255, 150);
  drawCar(-4, 0);
  blendMode(BLEND);
  noTint();
  drawCar(0, 0);
  pop();
}

function drawCar(offX, offY) {
  push();
  translate(width / 2 + offX + 40, height - 60 + offY);
  translate(0, sin(frameCount * 0.2) * 1.5);
  rectMode(CENTER);
  noStroke();

  fill(0, 180);
  rect(0, 22, 130, 8);

  fill(PALETTE.carBody);
  rect(0, 8, 120, 22);

  // Techo Blanco
  fill(PALETTE.carRoof);
  rect(0, -10, 90, 18);

  // Vidrio
  fill(10, 15, 40);
  rect(0, -12, 84, 10);
  fill(255, 60);
  beginShape();
  vertex(10, -17);
  vertex(20, -17);
  vertex(-5, -7);
  vertex(-15, -7);
  endShape();

  fill(80, 0, 0);
  rect(-42, 8, 12, 9);
  rect(-26, 8, 12, 9);
  rect(26, 8, 12, 9);
  rect(42, 8, 12, 9);
  fill(255, 40, 40);
  rect(-42, 8, 8, 5);
  rect(-26, 8, 8, 5);
  rect(26, 8, 8, 5);
  rect(42, 8, 8, 5);

  fill(255, 220, 100);
  rect(0, 8, 24, 7);
  fill(0);
  textSize(5);
  textAlign(CENTER, CENTER);
  text("GENUARY", 0, 8);

  fill(30);
  rect(-60, 16, 14, 10);
  rect(60, 16, 14, 10);
  pop();
}

function drawNagaiSkyline() {
  push();
  let parallax = curveAmt;
  drawingContext.shadowBlur = 6;
  drawingContext.shadowColor = "rgba(255, 255, 255, 0.4)";
  for (let b of skyline) {
    let renderX = b.x - parallax;
    if (renderX < -200) renderX += width * 3;
    if (renderX > width * 3 - 200) renderX -= width * 3;
    if (renderX > -100 && renderX < width + 100) {
      let bY = horizon - b.h;
      fill(PALETTE.bldgBody);
      noStroke();
      rect(renderX, bY, b.w, b.h + 5);
      fill(PALETTE.bldgSide);
      rect(renderX + b.w, bY + 2, 4, b.h + 2);
      drawMiniWindows(renderX, bY, b);
    }
  }
  drawingContext.shadowBlur = 0;
  pop();
}

function drawMiniWindows(bx, by, b) {
  randomSeed(b.seed);
  let cols = floor(b.w / 4);
  let rows = floor(b.h / 5);
  fill(b.type === 0 ? PALETTE.winWhite : PALETTE.winGold);
  for (let r = 1; r < rows; r++) {
    for (let c = 1; c < cols; c++) {
      if (random() > 0.4) rect(bx + c * 4, by + r * 5, 2, 2);
    }
  }
}

function generateSkyline() {
  let cx = -width;
  while (cx < width * 3) {
    let w = random(15, 45);
    let h = random(20, 90);
    skyline.push({
      x: cx,
      w: w,
      h: h,
      type: floor(random(2)),
      seed: random(10000),
    });
    cx += w + random(1, 5);
  }
}

function drawRetroSky() {
  noStroke();
  let steps = 40;
  let skyH = horizon + 20;
  for (let i = 0; i < steps; i++) {
    let y = (i / steps) * skyH;
    fill(lerpColor(color(PALETTE.skyTop), color(PALETTE.skyBottom), i / steps));
    rect(0, y, width, skyH / steps + 1);
  }
}

function drawStars() {
  fill(255);
  randomSeed(42);
  for (let i = 0; i < 60; i++) rect(random(width), random(horizon), 2, 2);
}

function drawRetroFilters() {
  fill(0, 40);
  noStroke();
  for (let y = 0; y < height; y += 4) rect(0, y, width, 2);
  strokeWeight(80);
  noFill();
  stroke(0, 100);
  rect(0, 0, width, height);
  blendMode(OVERLAY);
  image(noiseLayer, 0, 0);
  blendMode(BLEND);
}

function drawHUD() {
  fill(0, 255, 100, 200);
  noStroke();
  textAlign(RIGHT);
  textSize(12);
  text("GENUARY 08 2026", width - 20, 30);
}
