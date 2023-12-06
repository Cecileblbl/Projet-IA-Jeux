// Path Following (Complex Path)
// The Nature of Code
// The Coding Train / Daniel Shiffman
// https://youtu.be/LrnR6dc2IfM
// https://thecodingtrain.com/learning/nature-of-code/5.7-path-following.html

// Path Following: https://editor.p5js.org/codingtrain/sketches/dqM054vBV
// Complex Path: https://editor.p5js.org/codingtrain/sketches/2FFzvxwVt

// Crowd Path Following
// Via Reynolds: http://www.red3d.com/cwr/steer/CrowdPath.html

// Pour debug on/off affichage des lignes etc.
let debug = false;

// le chemin
let path;

// Tableau des véhicules
let vehicles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // la fonction suivante créer un chemin composé de plusieurs points
  newPath();

  // On crée n véhicules placés aléatoirement sur le canvas
  const nbVehicules = 1;

  for (let i = 0; i < nbVehicules; i++) {
    newVehicle(random(width), random(height));
  }
  createP(
    "Appuyez sur 'd' pour afficher les infos de debug.<br/>Click souris pour générer de nouveaux véhicules."
  );
}

function draw() {
  background(240);
  // Affichage du chemin
  path.display();

  for (let v of vehicles) {
    // On applique les comportements pour suivre le chemin
    v.applyBehaviors(vehicles, path);
    // on a regroupé update, draw etc. dans une méthode run (update, borders, display, etc.)
    v.run();

    if(v.couleur == "green") {
      v.edges();
    }
  }
}

function newPath() {
  // Simple suite de points partant de 30, 30 et allant vers 30, height - 30 etc.
  path = new Path();
  let offset = 30;
  path.addPoint(offset, offset);
  path.addPoint(width - offset-300, offset+300);
  path.addPoint(400, 300);
  path.addPoint(width/2, height/2);
  path.addPoint(400, 800);
  path.addPoint(width - offset, height - offset);
  path.addPoint(width / 2, height - offset * 3);
  path.addPoint(offset, height - offset);
}

function newVehicle(x, y) {
  let maxspeed = random(2, 4);
  let maxforce = 0.3;
  let v = new Vehicle(x, y, maxspeed, maxforce);
  vehicles.push(v);
  return v;
}

function newVehicleRapide(x, y) {
  let maxspeed = 8
  let maxforce = 0.3;
  let v = new Vehicle(x, y, maxspeed, maxforce);
  v.couleur = "red";
  vehicles.push(v);
  return v;
}

function newVehicleWanderer(x, y) {
  let maxspeed = 3;
  let maxforce = 0.3;
  let v = new Vehicle(x, y, maxspeed, maxforce);
  v.couleur = "green";
  v.r = 30;
  v.poidsSeparation = 2;
  v.poidsWander = 1;
  vehicles.push(v);
  return v;
}

function keyPressed() {
  if (key == "d") {
    debug = !debug;
  } else if (key == "s") {
    newVehicleRapide(width / 2, height / 2);
  } else if (key == "w") {
    newVehicleWanderer(width / 2, height / 2);
  }
}

function mouseDragged() {
  newVehicle(mouseX, mouseY);
}
