let d = 30;
let stars = [];
let numStars = 150;
let angle = 0;

function setup() {
  createCanvas(1920, 1080, WEBGL);
  t = 0;
  
  // Generate stars as voxel positions (boxes in space)
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: random(-width, width),
      y: random(-height, height),
      z: random(-1500, -600),
      size: random(3, 8),
      twinkle: random(1000)
    });
  }
}

function draw() {
  // Space background
  background(0, 0, 15);
  
  // Draw twinkling stars as VOXEL BOXES
  push();
  noStroke();
  for (let star of stars) {
    let brightness = 180 + 75 * sin(millis() / 400 + star.twinkle);
    fill(brightness, brightness, brightness - 10);
    push();
    translate(star.x, star.y, star.z);
    box(star.size);
    pop();
  }
  pop();
  
  // Lighting
  pointLight(255, 255, 255, 500, -500, 500);
  pointLight(255, 255, 255, -500, -500, 500);
  pointLight(200, 200, 255, -500, -500, -500);
  pointLight(255, 255, 255, 500, -500, -500);
  
  orbitControl();
  
  // Earth's axial tilt (~23.5 degrees)
  rotateZ(radians(23.5));
  
  // Rotation around its axis
  rotateY(angle);
  angle += 0.008;
  
  // Draw Earth voxels
  noStroke();
  for (let i = 0; i < d; i++) {
    for (let j = 0; j < d; j++) {
      for (let k = 0; k < d; k++) {
        if (sqrt((i - d / 2) ** 2 + (j - d / 2) ** 2 + (k - d / 2) ** 2) < d / 2 && 
            sqrt((i - d / 2) ** 2 + (j - d / 2) ** 2 + (k - d / 2) ** 2) > d / 2 - 1.5) {
          push();
          translate((i - d / 2) * 10, (j - d / 2) * 10, (k - d / 2) * 10);
          
          // Use lower frequency noise for larger, grouped landmasses (continents)
          let sz = noise(i / 8, j / 8, k / 8) * 255;
          
          // Calculate latitude for polar detection
          let latitude = abs(j - d / 2) / (d / 2);
          
          // === COLORS - Continents grouped, few islands ===
          if (latitude > 0.75) {
            fill(240, 250, 255); // Polar ice
          }
          // Continent/Land - larger connected masses
          else if (sz > 140) {
            fill(34, 139, 34); // Forest green
          }
          // Coastal/Sand - narrow band around continents
          else if (sz > 130) {
            fill(210, 180, 140); // Sand
          }
          // Ocean - majority
          else {
            fill(0, 105, 148); // Ocean
          }
          
          // Box extrusion (using animation noise separately)
          let animSz = noise((i + t) / 5, (j + t) / 5, (k + t) / 5) * 255;
          
          if (abs(i - d / 2) > abs(j - d / 2) && abs(i - d / 2) > abs(k - d / 2)) {
            translate(Math.sign(i - d / 2) * animSz / 255 * 100 / 2 - Math.sign(i - d / 2) * 100 / 2, 0, 0);
            box(10 + animSz / 255 * 100, 10, 10);
          }
          if (abs(j - d / 2) > abs(i - d / 2) && abs(j - d / 2) > abs(k - d / 2)) {
            translate(0, Math.sign(j - d / 2) * animSz / 255 * 100 / 2 - Math.sign(j - d / 2) * 100 / 2, 0);
            box(10, 10 + animSz / 255 * 100, 10);
          }
          if (abs(k - d / 2) > abs(i - d / 2) && abs(k - d / 2) > abs(j - d / 2)) {
            translate(0, 0, Math.sign(k - d / 2) * animSz / 255 * 100 / 2 - Math.sign(k - d / 2) * 100 / 2);
            box(10, 10, 10 + animSz / 255 * 100);
          }
          
          pop();
        }
      }
    }
  }
  
  // === CLOUDS - Floating visibly above Earth surface ===
  noStroke();
  let cloudScale = 11.5; // Position multiplier for cloud layer (higher than Earth's 10)
  for (let i = 0; i < d; i++) {
    for (let j = 0; j < d; j++) {
      for (let k = 0; k < d; k++) {
        let dist = sqrt((i - d / 2) ** 2 + (j - d / 2) ** 2 + (k - d / 2) ** 2);
        
        // Only on surface shell
        if (dist < d / 2 && dist > d / 2 - 1.5) {
          let cloudNoise = noise((i + 500) / 4, (j + 500) / 4, (k + 500) / 4);
          
          // Sparse clouds (~15% coverage)
          if (cloudNoise > 0.7) {
            push();
            // Clouds at larger radius (11.5 vs Earth's 10) = visibly floating
            translate((i - d / 2) * cloudScale, (j - d / 2) * cloudScale, (k - d / 2) * cloudScale);
            fill(255, 255, 255, 230);
            box(7, 7, 7);
            pop();
          }
        }
      }
    }
  }
  
  t += 0.25;
}

function mousePressed() {
  console.log(sin(-t / 10) * 600, -500 * cos(t / 20) * sin(-t / 10), cos(-t / 10) * 600);
}
