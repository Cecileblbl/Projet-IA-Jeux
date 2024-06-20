

let lifetime; 

let population; // Population

let lifecycle; // Timer for cycle of generation
let recordtime; 

let target; 


let obstacles = []; 

function setup() {
  createCanvas(640, 360);
  lifetime = 300;

  // Initialize variables
  lifecycle = 0;
  recordtime = lifetime;

  target = new Obstacle(width / 2 - 12, 24, 24, 24);

  // Create a population with a mutation rate, and population max
  let mutationRate = 0.01;
  population = new Population(mutationRate, 50);

  obstacles = [];
  obstacles.push(new Obstacle(width / 2 - 100, height / 2, 200, 10));
}

function draw() {
  background(127);

  target.display();

  // If the generation hasn't ended yet
  if (lifecycle < lifetime) {
    population.live(obstacles);
    if (population.targetReached() && lifecycle < recordtime) {
      recordtime = lifecycle;
    }
    lifecycle++;
  } else {
    lifecycle = 0;
    population.calcFitness();
    population.selection();
    population.reproduction();
  }

  // Draw the obstacles
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].display();
  }

  // Display some info
  fill(0);
  noStroke();
  text("Generation #: " + population.getGenerations(), 10, 18);
  text("Cycles left: " + (lifetime - lifecycle), 10, 36);
  text("Record cycles: " + recordtime, 10, 54);
}


function mousePressed() {
  target.position.x = mouseX;
  target.position.y = mouseY;
  recordtime = lifetime;
}
