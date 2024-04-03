let pursuer1, pursuer2;
let target;
let obstacles = [];
let walls = [];
let vehicules = [];

let imgVaisseau;

function preload() {
  console.log("preload");
  imgVaisseau = loadImage("assets/images/vaisseau.png");
}

function setup() {
  console.log("setup");
  createCanvas(windowWidth, windowHeight);
  pursuer1 = new Vehicle(100, 100, imgVaisseau);
  pursuer2 = new Vehicle(random(width), random(height), imgVaisseau);

  vehicules.push(pursuer1);
  vehicules.push(pursuer2);

  // On cree un obstace au milieu de l'écran
  // un cercle de rayon 100px
  // TODO
  obstacles.push(new Obstacle(width / 2, height / 2, 50));

  // Créer le mur de gauche
  walls.push(new Wall((width / 3) * 2, 0, (width / 3) * 2, height / 3));

  // Créer le mur de droite, en laissant un espace de 100 pixels pour la porte
  walls.push(
    new Wall((width / 3) * 2, height / 3 + 100, (width / 3) * 2, height)
  );
  target = createVector(width, height / 2);
}

function draw() {
  // changer le dernier param (< 100) pour effets de trainée
  background(0, 0, 0, 100);

  // Dessin de la cible qui suit la souris
  // Dessine un cercle de rayon 32px à la position de la souris
  fill(255, 0, 0);
  noStroke();
  circle(target.x, target.y, 32);

  // dessin des obstacles
  obstacles.forEach((o) => {
    o.show();
  });

  // dessin des murs
  walls.forEach((w) => {
    w.show();
  });

  vehicules.forEach((v) => {
    // pursuer = le véhicule poursuiveur, il vise un point devant la cible
    v.applyBehaviors(target, obstacles, vehicules, walls);

    // déplacement et dessin du véhicule et de la target
    v.update();
    v.show();
  });
}

function mousePressed() {
  // TODO : ajouter un obstacle de taille aléatoire à la position de la souris
  obstacles.push(new Obstacle(mouseX, mouseY, random(30, 100)));
}

function keyPressed() {
  if (key == "v") {
    vehicules.push(new Vehicle(random(width), random(height), imgVaisseau));
  }
  if (key == "d") {
    Vehicle.debug = !Vehicle.debug;
  }
  if (key == "f") {
    // Je cree 100 vehicules qui partent du bord gauche de l'écran
    // et qui vont vers la cible/souris
    for (let i = 0; i < 10; i++) {
      let v = new Vehicle(
        random(150, 170),
        random(height / 2 - 10, height / 2 + 10),
        imgVaisseau
      );
      v.maxSpeed = 10;
      v.color = "purple";
      vehicules.push(v);
    }
  }
}
