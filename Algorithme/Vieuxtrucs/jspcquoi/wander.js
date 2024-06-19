let vehicles = [];
let sliderRayon;
let sliderDistanceCercle;
let sliderVariationAngleSurCercle;

function setup() {
  createCanvas(800, 600);

  const nbVehicles = 15;
  for(let i=0; i < nbVehicles; i++) {
    let vehicle = new Vehicle(100, 100);
    vehicles.push(vehicle);
  }
  for (let i = 0; i < 5; i++) {
    let obstacle = new Obstacle(random(width), random(height), 50);
    obstacles.push(obstacle);
  }

  // on cree un slider pour regler le rayon duy cercle
  // pour le comportement wander
  // min max val, step
  sliderRayon = createSlider(30, 200, 100, 1);

  sliderDistanceCercle = createSlider(10, 300, 100, 1);
  
  sliderVariationAngleSurCercle = createSlider(0, 0.8, 0.3, 0.01);
}

function draw() {
  background(0);
  //background(0, 0, 0, 20);

  vehicles.forEach(vehicle => {
    vehicle.wander();

    vehicle.distanceCercleWander = sliderDistanceCercle.value();
    vehicle.wanderRadius = sliderRayon.value();
    vehicle.displaceRange = sliderVariationAngleSurCercle.value();
    vehicle.avoidObstacles(obstacles);
    vehicle.update();
    vehicle.show();
    vehicle.edges();
  });
  obstacles.forEach(obstacle => {
    obstacle.show();
  });
}
function keyPressed() {
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  }
}
