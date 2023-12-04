let target, vehicle;
let vehicles = [];
let vehicule;
let sliderVitesse;
let sliderForce;

let targetVehicle;

// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  // on crée un canvas de 800px par 800px
  createCanvas(windowWidth, windowHeight);

  // On crée un slider pour régler la vitesse max des véhicules
  // paramètres : min, max, valeur par défaut, pas
  sliderVitesse = createSlider(1, 15, 4, 1);
  sliderForce = createSlider(0.05, 2, 0.9, 0.01);

  let nbVehicles = 5;
  for (let i = 0; i < nbVehicles; i++) {
    let vehicule = new Vehicle(random(width), random(height));
    // vitesse et max force aléatoires
    // taille aussi
    vehicule.maxSpeed = random(1, 10);
    vehicule.maxForce = random(0.05, 0.9);
    vehicule.r = random(4, 16);

    vehicles.push(vehicule);
  }

  // TODO: créer un tableau de véhicules en global
  // ajouter nb vehicules au tableau dans une boucle
  // avec une position random dans le canvas

  // La cible est un vecteur avec une position aléatoire dans le canvas
  target = createVector(random(width), random(height));

  // Je crée une autre cible qui est un véhicule (classe qui hérite de la classe Vehicle)
  targetVehicle = new Target(random(width), random(height));
}

// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {
  // fond noir pour le canvas
  background(0);

  // A partir de maintenant toutes les formes pleines seront en rouge
  fill("red");
  // on veut un contours de 15 pixels, rose
  //strokeWeight(15);
  //stroke("pink");

  // on ne veut pas de contours
  noStroke();

  // mouseX et mouseY sont des variables globales de p5.js, elles correspondent à la position de la souris
  // on les stocke dans un vecteur pour pouvoir les utiliser avec la méthode seek (un peu plus loin)
  // du vehicule

  target.x = mouseX;
  target.y = mouseY;

  // Dessine un cercle de diamètre 32px à la position de la souris
  // la couleur de remplissage est rouge car on a appelé fill(255, 0, 0) plus haut
  // pas de contours car on a appelé noStroke() plus haut
  circle(target.x, target.y, 32);

  vehicles.forEach((vehicule) => {
    // on met la vitesse max en fonction de la valeur du slider
    vehicule.maxSpeed = sliderVitesse.value();
    // on met la force max en fonction de la valeur du slider
    vehicule.maxForce = sliderForce.value();

    // je déplace et dessine le véhicule
    // on applique les comportements
    vehicule.applyBehaviors(targetVehicle.pos);
    vehicule.update();

    // on regarde si on a atteint la cible, si c'est le cas, le vaisseau
    // ré-apparait à une position aléatoire
    let distance = p5.Vector.dist(vehicule.pos, targetVehicle.pos);

    if((distance-vehicule.r) < targetVehicle.r) {
      vehicule.pos.x = random(width);
      vehicule.pos.y = random(height);
    }
    
    // on veut que le véhicule réapparaisse de l'autre côté du canvas
    vehicule.edges();
    // on dessine le véhicuke
    vehicule.show();

    // on déplace et on dessine la cible vehicule
    targetVehicle.update();
    targetVehicle.edges();
    targetVehicle.show();
  });


  // TODO: boucle sur le tableau de véhicules
  // pour chaque véhicule : seek, update, show
}
/*
// fonction appelée quand on clique dans le canvas
function mousePressed() {
  console.log("click");
  // je créée 100 véhicules qui partent des bords de l'écran 
  // et qui vont vers la souris
  for (let i = 0; i < 100; i++) {
    // on ajoute un véhicule au tableau
    let vehicule = new Vehicle(random(width), random(height));
    // vitesse et max force aléatoires
    // taille aussi
    vehicule.maxSpeed = random(1, 10);
    vehicule.maxForce = random(0.05, 0.9);
    vehicule.r = random(4, 16);

    vehicles.push(vehicule);
  }
}
*/
