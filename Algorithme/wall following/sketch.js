let walls = [];
let character;
let wallFollowDistance = 50; // Desired distance from the wall
let debugMode = false; // Variable to indicate if debug mode is enabled

function setup() {
  createCanvas(800, 600);
  
  // Define walls (start and end points)
  walls.push(new Wall(100, 5, 700, 0));
  walls.push(new Wall(700, 0, 750, 100));
  walls.push(new Wall(750, 100, 750, 500));
  walls.push(new Wall(750, 500, 400, 580));
  walls.push(new Wall(400, 580, 100, 500));
  walls.push(new Wall(100, 500, 100, 100));
  walls.push(new Wall(100, 100, 100, 5));
  
  // Create the character
  character = new Character(200, 200);
}

function draw() {
  background(220);
  
  // Draw walls
  for (let wall of walls) {
    wall.show();
  }
  
  // Toggle debug mode on/off with 'd' key
  if (keyIsDown(68)) { // 68 is the keycode for 'd'
    debugMode = !debugMode;
  }
  
  // Update and draw character
  character.followWall(walls);
  character.update();
  
  // Draw character and vectors (if debug mode is on)
  if (debugMode) {
    character.drawVectors();
  }
  
  character.show();
}

// Wall class

function getNormalPoint(p, a, b) {
  let ap = p5.Vector.sub(p, a);
  let ab = p5.Vector.sub(b, a);
  ab.setMag(ap.dot(ab) / ab.mag());
  let normalPoint = p5.Vector.add(a, ab);
  return normalPoint;
}
