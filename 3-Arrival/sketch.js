let vehicle;
let vehicles = [];

function setup() {
  createCanvas(800, 800);

  let nbVehicles = 2;
  // Create nbVehicles vehicles
  for (let i = 0; i < nbVehicles; i++) {
    let vehicle = new Vehicle(random(width), random(height));

    vehicles.push(vehicle);
  }
}

function draw() {
  // couleur pour effacer l'écran
  background(0);
  // pour effet psychedelique
  //background(0, 0, 0, 50);

  // Cible qui suit la souris, cercle rouge de rayon 32
  let target = createVector(mouseX, mouseY);
  fill(255, 0, 0);
  noStroke();
  ellipse(target.x, target.y, 32);

  vehicles.forEach((vehicle, index) => {
    let forceArrive;

    if (index == 0) {
      // C'est le 1er véhicule, il suit la cible/souris
      forceArrive = vehicle.arrive(target);
    } else {
      // les véhicules suivants suivent le véhicule précédent
      let vehiculePrecedent = vehicles[index - 1];

      //let pointDerriere = vehiculePrecedent.vel.copy().mult(-1);
      //pointDerriere.setMag(70);
      //pointDerriere.add(vehiculePrecedent.pos);

      //on le dessine sous la forme d'un cercle vert
      //fill("lightgreen");
      //noStroke();
      //circle(pointDerriere.x, pointDerriere.y, 10);

      forceArrive = vehicle.arrive(vehiculePrecedent.pos, 40);
    }

    // On applique la force au véhicule
    vehicle.applyForce(forceArrive);

    // On met à jour la position et on dessine le véhicule
    vehicle.update();
    vehicle.show();
  });

}

function keyPressed() {
  if (key == 'd') {
    Vehicle.debug = !Vehicle.debug;
  }
}