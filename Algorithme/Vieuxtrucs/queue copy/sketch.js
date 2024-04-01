let vehicles = [];
let target;
let offset;

let queue = [];

function setup() {
  createCanvas(800, 800);
  target = createVector(width, height / 2);
  setInterval(addVehicle, 2000);
  offset = createVector(50, 0);
}

function draw() {
  background(0);

  for (let i = 0; i < vehicles.length; i++) {
    let vehicle = vehicles[i];
    if (queue.includes(vehicle)) {
      // if vehicle is frist in queue fo forward
      if (queue[0] === vehicle) {
        // console.log("first IN queue ");

        vehicle.seek(target);
        vehicle.update();
      }
      if (p5.Vector.dist(vehicle.pos, target) < vehicle.r) {
        // wait 2 seconds before deleting the vehicle
        setTimeout(() => {
          vehicles.splice(i, 1);
          queue.shift();
          console.log("Vehicle deleted");
          // change i
          i++;
        }, 2000);
      } else if (queue.length > 2) {
        let vehicleInFront = p5.Vector.sub(queue[i - 1].pos, offset);
        vehicle.seek(vehicleInFront);
      }
    } else {
      // console.log("NOT in queue ");
      let targetPos = target;
      if (queue.length > 0) {
        // console.log("queue " + queue.length);
        targetPos = p5.Vector.sub(queue[queue.length - 1].pos, offset);
        fill(0, 255, 0);
        noStroke();
        circle(
          queue[queue.length - 1].x,
          queue[queue.length - 1].y,
          offset.mag() * 2
        );
        fill(255, 0, 0);
        noStroke();
        circle(targetPos.x, targetPos.y, 10);
      } else {
        targetPos = target;
      }
      console.log("Target pos " + targetPos);
      if (p5.Vector.dist(vehicle.pos, targetPos) < vehicle.r + 20) {
        console.log("Added to queue");
        queue.push(vehicle);
        fill(255, 255, 0);
        vehicle.seek(targetPos);
        vehicle.update();
      } else if (p5.Vector.dist(vehicle.pos, targetPos) < vehicle.r) {
        console.log("Reached target");
      } else {
        console.log("Seeking target");
        vehicle.seek(targetPos);
        vehicle.update();
      }
    }
    vehicle.show();
  }
}

function addVehicle() {
  vehicles.push(new Vehicle(random(width), random(height)));
}
