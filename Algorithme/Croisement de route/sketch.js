let vehicles = [];
let obstacles = [];
let numVehicles = 30; // Nombre de véhicules
let numObstacles = 4; // Nombre d'obstacles

function setup() {
  createCanvas(400, 400);
  // Initialisation des véhicules avec des positions et des vitesses aléatoires
  for (let i = 0; i < numVehicles; i++) {
    let x = random(width);
    let y = random(height);
    let speedX = random(-2, 2);
    let speedY = random(-2, 2);
    vehicles.push(new Vehicle(x, y, speedX, speedY));
  }
  // Initialisation des obstacles avec des positions aléatoires
  for (let i = 0; i < numObstacles; i++) {
    let x = random(width);
    let y = random(height);
    let radius = random(10, 30);
    obstacles.push(new Obstacle(x, y, radius));
  }
}

function draw() {
  background(50);

  // Mettre à jour et afficher chaque obstacle
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].display();
  }

  // Mettre à jour et afficher chaque véhicule
  for (let i = 0; i < vehicles.length; i++) {
    vehicles[i].update();
    vehicles[i].display();
    // Éviter les collisions avec les obstacles
    for (let j = 0; j < obstacles.length; j++) {
      vehicles[i].avoidObstacle(obstacles[j]);
    }
  }

  // Éviter les collisions entre les véhicules
  for (let i = 0; i < vehicles.length; i++) {
    for (let j = i + 1; j < vehicles.length; j++) {
      vehicles[i].avoidCollision(vehicles[j]);
    }
  }
}
