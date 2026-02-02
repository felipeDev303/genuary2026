// The Perfectionist's Nightmare
// A harmonic grid of eyes... except for one.

let cols, rows;
let size = 40; // Diameter of the eye
let glitchX, glitchY;

function setup() {
  createCanvas(500, 700);
  background(0);
  
  // Calculate grid columns and rows based on size
  cols = floor(width / size);
  rows = floor(height / size);
  
  // Select the "glitch" eye position (somewhere central but random)
  glitchX = floor(random(2, cols - 2));
  glitchY = floor(random(2, rows - 2));
  
  noStroke();
}

function draw() {
  background(0); // Keep background black
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * size + size / 2;
      let y = j * size + size / 2;
      
      // Calculate oscillation
      // We use the distance from center to create a radial wave pattern
      let d = dist(x, y, width/2, height/2);
      let angle = (d * 0.05) - (frameCount * 0.05);
      
      let isGlitch = (i === glitchX && j === glitchY);
      
      // Draw Sclera
      if (isGlitch) {
        fill(0); // Black Sclera (Inverted)
        stroke(255); // White outline to see it against black bg
        strokeWeight(1);
      } else {
        fill(255); // White Sclera
        noStroke();
      }
      ellipse(x, y, size, size);
      
      // Draw Pupil (Black part usually)
      let pupilSize = map(sin(angle), -1, 1, size * 0.2, size * 0.85);
      
      if (isGlitch) fill(255); // White Pupil (Inverted)
      else fill(0); // Black Pupil
      
      ellipse(x, y, pupilSize, pupilSize);
    }
  }
}
