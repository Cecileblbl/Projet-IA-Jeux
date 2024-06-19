// Using this variable to decide whether to draw all the stuff
let debug = false;

// A path object (series of connected points)
let paths = [];

// Two vehicles
let vehicles = [];

function setup() {
  createCanvas(640, 360);
  // Call a function to generate new Path object
  newPath();

  // We are now making random vehicles and storing them in an ArrayList
  for (let i = 0; i < 12; i++) {
    newVehicle(width/2, height/2);
  }
  createP(
    "Hit 'd' to toggle debugging lines.<br/>Click the mouse to generate new vehicles."
  );
}

function draw() {
  background(240);
  // Display the path
  for (let path of paths) {
    path.display();
  }

  for (let v of vehicles) {
    // Path following and separation are worked on in this function
    v.applyBehaviors(vehicles, paths);
    // Call the generic run method (update, borders, display, etc.)
    v.run();
  }
}

function newPath() {
  let offset = 140; // Distance from the corner

  // Top-left corner
  let path = new Path();
  path.addPoint(offset, offset);

  path.addPoint(-1000, offset);
  path.addPoint(offset+100,-1000);
  

  paths.push(path);

  // Top-right corner
  let path2 = new Path();
  path2.addPoint(width - offset, offset);
  path2.addPoint(1000, offset);
  path2.addPoint(offset, -20000);
  paths.push(path2);

  // Bottom-right corner
  let path3 = new Path();
  path3.addPoint(width - offset, height - offset);
  path3.addPoint(1000, height - offset);
  path3.addPoint(width - offset, 1000);
  paths.push(path3);

  // Bottom-left corner
  let path4 = new Path();
  path4.addPoint(offset, height - offset);
  path4.addPoint(-1000, height - offset);
  path4.addPoint(offset, 1000);
  paths.push(path4);
}

function newVehicle(x, y) {
  let maxspeed = 2.5;
  let maxforce = 0.5;
  vehicles.push(new Vehicle(x, y, maxspeed, maxforce));
}

function keyPressed() {
  if (key == "d") {
    debug = !debug;
  }
}

function mousePressed() {
  newVehicle(mouseX, mouseY);
}