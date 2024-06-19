let vehicle;
let target;

function setup() {
  createCanvas(400, 400);
  vehicle = new Vehicle(100, 100);
  target = new Target(200, 200);
}

function draw() {
  background(0);
  fill(255, 0, 0);
  noStroke();
  // target = createVector(mouseX, mouseY);
  // circle(target.x, target.y, 32);

  // let seek = vehicle.seek(target);
  // vehicle.applyForce(seek);

  let pursue = vehicle.pursue(target.pos);
  vehicle.applyForce(pursue);

  vehicle.update();
  vehicle.show();

  target.update();
  target.show();
}
