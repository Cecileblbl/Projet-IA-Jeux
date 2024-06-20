let follower;
let target;
let walls = []; // Tableau pour stocker les murs
let targetVisionRange = 100; // Portée du champ de vision de la cible
let targetSmoothness = 0.1; // Contrôle la fluidité des mouvements de la cible

function setup() {
  createCanvas(800, 600);
  follower = new Vehicle(width / 2, height / 2, color(255, 0, 0)); // Véhicule 1 (le suiveur) en rouge
  target = new Vehicle(random(width), random(height), color(0, 255, 0)); // Véhicule 2 (la cible) en vert

  // Créer les murs
  walls.push(new Wall(100, 500, 700, 500)); // Mur horizontal en bas
  walls.push(new Wall(100, 100, 100, 500)); // Mur vertical à gauche
  walls.push(new Wall(100, 100, 300, 100)); // Mur vertical à droite
}

function draw() {
  background(0);

  // Mettre à jour la position de la cible
  target.update();
  target.randomMovement();
  target.checkEdges(); // Vérifier les bords du canvas
  target.displayVision(); // Afficher le champ de vision de la cible

  // Mettre à jour la position du suiveur
  follower.update();
  follower.checkEdges(); // Vérifier les bords du canvas

  // Vérifier si le suiveur entre dans le champ de vision de la cible
  if (target.isFollowerInSight(follower)) {
    follower.stop(); // Arrêter le suiveur
  } else {
    // Suivre la cible
    follower.follow(target);
  }

  // Vérifier et résoudre les collisions avec les murs pour le suiveur
  follower.collideWalls();

  // Vérifier et résoudre les collisions avec les murs pour la cible
  target.collideWalls();

  // Afficher les murs
  for (let wall of walls) {
    wall.display();
  }

  // Afficher la cible et le suiveur
  target.display();
  follower.display();
}

class Vehicle {
  constructor(x, y, col) {
    this.pos = createVector(x, y); // Position
    this.vel = createVector(); // Vitesse
    this.acc = createVector(); // Accélération
    this.maxSpeed = 3; // Vitesse maximale
    this.maxForce = 0.1; // Force maximale
    this.r = 8; // Rayon
    this.col = col; // Couleur
    this.visible = false; // Indique si le suiveur est visible pour la cible
  }

  // Mettre à jour la position en fonction de la vitesse et de l'accélération
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  // Appliquer une force
  applyForce(force) {
    this.acc.add(force);
  }

  // Suivre la cible
  follow(target) {
    let desired = p5.Vector.sub(target.pos, this.pos); // Vecteur pointant vers la cible
    desired.normalize();
    desired.mult(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel); // Vecteur de direction
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  // Mouvement aléatoire
  randomMovement() {
    let randomForce = p5.Vector.random2D();
    randomForce.mult(targetSmoothness);
    this.applyForce(randomForce);
  }

  // Arrêter le suiveur
  stop() {
    this.vel.mult(0); // Vitesse nulle
    this.acc.mult(0); // Accélération nulle
  }

  // Afficher le véhicule
  display() {
    push();
    fill(this.col);
    noStroke();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading() + PI / 2);
    triangle(-this.r, this.r, this.r, this.r, 0, -this.r);
    pop();
  }

  // Afficher le champ de vision de la cible
  displayVision() {
    fill(255, 0, 0, 100); // Rouge semi-transparent
    ellipse(this.pos.x, this.pos.y, targetVisionRange * 2);
  }

  // Vérifier si le suiveur est dans le champ de vision de la cible
  isFollowerInSight(follower) {
    let d = p5.Vector.dist(this.pos, follower.pos);
    return d <= targetVisionRange;
  }

  // Vérifier les bords du canvas
  checkEdges() {
    if (this.pos.x < 0) {
      this.pos.x = 0;
    } else if (this.pos.x > width) {
      this.pos.x = width;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
    } else if (this.pos.y > height) {
      this.pos.y = height;
    }
  }

  // Vérifier et résoudre les collisions avec les murs
  collideWalls() {
    for (let wall of walls) {
      if (wall.intersects(this.pos)) {
        // Réinitialiser la position pour éviter le mur
        this.pos.x = constrain(this.pos.x, wall.start.x, wall.end.x);
        this.pos.y = constrain(this.pos.y, wall.start.y, wall.end.y);
      }
    }
  }
}

class Wall {
  constructor(x1, y1, x2, y2) {
    this.start = createVector(x1, y1); // Position de départ du mur
    this.end = createVector(x2, y2); // Position de fin du mur
    this.normal = p5.Vector.sub(this.end, this.start).normalize(); // Vecteur normal au mur
  }

  // Afficher le mur
  display() {
    stroke(255);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }

  // Vérifier si un point est à l'intérieur du mur
  intersects(point) {
    let d1 = dist(point.x, point.y, this.start.x, this.start.y);
    let d2 = dist(point.x, point.y, this.end.x, this.end.y);
    let wallLength = dist(this.start.x, this.start.y, this.end.x, this.end.y);
    return (d1 + d2 >= wallLength - 1 && d1 + d2 <= wallLength + 1);
  }
}
