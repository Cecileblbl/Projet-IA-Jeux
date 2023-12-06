let vehicle;
let vehicles = [];
let cibles = [];
let demo = "snake";

function setup() {
  createCanvas(800, 800);

  /* POUR LE SNAKE 
  let nbVehicles = 20;
  // Create nbVehicles vehicles
  for (let i = 0; i < nbVehicles; i++) {
    let vehicle = new Vehicle(random(width), random(height));

    vehicles.push(vehicle);
  }
  */

  creerLesCiblesPourFormerInitiales();
  creerVehiclesPourFormerInitiales();
}

function creerLesCiblesPourFormerInitiales() {
  // Pour le moment je crée deux cibles à des positions aléatoires et
  // je les dessinerai juste avec des cercles, pour voir...
  // Barre verticale gauche du M
  cibles = [];
  cibles.push(createVector(100, 100));
  cibles.push(createVector(100, 150));
  cibles.push(createVector(100, 200));
  cibles.push(createVector(100, 250));
  cibles.push(createVector(100, 300));

  // Intérieur du M
  cibles.push(createVector(150, 150));
  cibles.push(createVector(200, 200));
  cibles.push(createVector(250, 150));
  cibles.push(createVector(300, 100));

  // Barre verticale droite du M
  cibles.push(createVector(300, 100));
  cibles.push(createVector(300, 150));
  cibles.push(createVector(300, 200));
  cibles.push(createVector(300, 250));
  cibles.push(createVector(300, 300));

  // Le B !

  // Barre verticale gauche du B
  cibles.push(createVector(400, 100));
  cibles.push(createVector(400, 150));
  cibles.push(createVector(400, 200));
  cibles.push(createVector(400, 250));
  cibles.push(createVector(400, 300));

  // Demi-cercle haut du B
  cibles.push(createVector(450, 100));
  cibles.push(createVector(500, 120));
  cibles.push(createVector(520, 150));
  cibles.push(createVector(500, 180));
  cibles.push(createVector(450, 200));
  cibles.push(createVector(500, 220));
  cibles.push(createVector(520, 250));
  cibles.push(createVector(500, 280));
  cibles.push(createVector(450, 300));
}

function creerVehiclesPourFormerInitiales() {
  for (let i = 0; i < cibles.length; i++) {
    let vehicle = new Vehicle(random(width), random(height));
    vehicles.push(vehicle);
  }
}

function deplacerLesCibles() {
  cibles.forEach((cible) => {
    cible.x += random(-10, 10);
    cible.y += random(-10, 10);
  });
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

  switch (demo) {
    case "vehiculesFormentLettres":
      /* POUR CIBLES QUI FORMENT LES INITIALES */
      // Dessiner les cibles

      cibles.forEach((cible) => {
        stroke("yellow");
        noFill();
        ellipse(cible.x, cible.y, 32);
      });


      vehicles.forEach((vehicle, index) => {
        let forceArrive;
        let target = cibles[index];

        forceArrive = vehicle.arrive(target);
        // On applique la force au véhicule
        vehicle.applyForce(forceArrive);

        // On met à jour la position et on dessine le véhicule
        vehicle.update();
        //vehicle.show();
        // On dessine un cercle à la place du vehicule
        fill("white");
        stroke("blue");
        circle(vehicle.pos.x, vehicle.pos.y, 40);
      });


      // Toutes les 5 secondes, on déplace les cibles
      if ((millis() > 5000) && (millis() < 10000)) {
        deplacerLesCibles();
      }
      else {
        // Au bout de 10s on réinitialise les cibles
        // pour reformer les initiales
        if ((millis() > 10000) && (millis() < 10100)) {
          creerLesCiblesPourFormerInitiales();
        }
      }
      break;
    case "snake":
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
      break;
  }
}

function keyPressed() {
  switch(key) {
    case 'd':
      Vehicle.debug = !Vehicle.debug;
      break;
    case 'l':
      demo = "vehiculesFormentLettres";
      break;
    case 's':
      demo = "snake";
      break;
  }
}