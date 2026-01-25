let sigma = 10;
let rho = 28;
let beta = 8 / 3;
let dt = 0.01;
let maxPoints = 100;

let attractors = [];
let num = 20;

function setup() {
  createCanvas(600, 400, WEBGL);
  for (let i = 0; i < num; i++) {
    let initCond = (i + 1) * 0.05;
    let c = color(((i + 1) / num) * 255, 100, 255);
    attractors[i] = new Attractor(initCond, initCond, initCond, c);
  }
}

function draw() {
  background(30);
  orbitControl();
  scale(5);

  for (let i = 0; i < num; i++) {
    attractors[i].update();
    attractors[i].display();
  }
}
