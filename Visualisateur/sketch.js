let button;
let select;
let vehicules = [];
let imgVaisseau;

let obstacles = [];

function preload() {
  console.log("preload");
  imgVaisseau = loadImage("assets/images/vaisseau.png");
}

function setup() {
  // Create a canvas and append it to a div with id "p5-canvas"
  let canvas = createCanvas(800, 500);

  // Use the parent method to attach the canvas to the existing div with id "p5-canvas"
  canvas.parent("p5-canvas");

  background(220);

  BManager = new BManager();

  for (let i = 0; i < 30; i++) {
    let x = random(width / 2); // Position aléatoire dans la moitié gauche du canevas
    let y = random(height); // Position aléatoire sur la hauteur du canevas
    let vehicule = new Vehicle(x, y, imgVaisseau);
    vehicules.push(vehicule);
  }

  obstacles.push(new Obstacle(100, 100, 50));

  //Wander behaviour on init
  Bkeeper.addB("arrival");
  // Bkeeper.addB("obstacleAvoidance");
  // Bkeeper.addB("Bordures");
  // Bkeeper.addB("pursue");
  displayBs(Bkeeper.Bs);
}

function draw() {
  if (isPaused) {
    return;
  }
  background(0, 0, 0, 100);
  vehicules.forEach((v) => {
    BManager.applyBs(v, Bkeeper.Bs);
    v.update();
    v.show();
  });
  obstacles.forEach((o) => {
    o.show();
  });
}

function addVehicule() {
  let x = random(width / 2); // Position aléatoire dans la moitié gauche du canevas
  let y = random(height); // Position aléatoire sur la hauteur du canevas
  let vehicule = new Vehicle(x, y, imgVaisseau);
  vehicules.push(vehicule);
}

function addObstacle() {
  let obstacle = new Obstacle(random(width), random(height), random(10, 50));
  obstacles.push(obstacle);
}
