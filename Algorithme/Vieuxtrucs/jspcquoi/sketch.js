let pursuer1;
let pursuer2;
let target;
let winner = '';
let scorePursuer1 = 0;


let scorePursuer2 = 0;

function setup() {
  createCanvas(800, 800);
  pursuer1 = new Vehicle(100, 100, color(255, 0, 0)); // Premier véhicule en rouge
  pursuer2 = new Vehicle(100, 700, color(0, 0, 255)); // Deuxième véhicule en bleu
  target = new Target(random(width), random(height));
}

function draw() {
  background(0);

  // Mettre à jour les deux poursuivants et afficher les informations
  pursuer1.pursue(target);
  pursuer2.pursue(target);
  pursuer1.update();
  pursuer2.update();
  pursuer1.show();
  pursuer2.show();

  // Mettre à jour la cible et afficher la cible
  target.update();
  target.show();

  // Vérifier les collisions entre les poursuivants et la cible
  if (target.isReached(pursuer1)) {
    scorePursuer1++;
    target.resetPosition();
  } else if (target.isReached(pursuer2)) {
    scorePursuer2++;
    target.resetPosition();
  }

  // Vérifier les collisions entre les deux poursuivants
  if (pursuer1.collides(pursuer2)) {
    pursuer1.avoidCollision(pursuer2);
  }

  // Afficher les scores des poursuivants
  textSize(16);
  fill(255);
  textAlign(LEFT, TOP);
  text('Score Poursuivant 1 (Rouge): ' + scorePursuer1, 10, 10);
  text('Score Poursuivant 2 (Bleu): ' + scorePursuer2, 10, 30);

  // Afficher le gagnant
  if (scorePursuer1 === 10 || scorePursuer2 === 10) {
    noLoop(); // Arrêter le dessin lorsque l'un des poursuivants atteint 10 points
    winner = (scorePursuer1 === 10) ? 'Poursuivant 1 (Rouge)' : 'Poursuivant 2 (Bleu)';
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text(winner + ' a gagné!', width / 2, height / 2);
  }
}

class Vehicle {
  constructor(x, y, col) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.maxSpeed = 5;
    this.maxForce = 0.1;
    this.r = 16; // Rayon du véhicule
    this.col = col; // Couleur du véhicule
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  pursue(target) {
    let desired = p5.Vector.sub(target.pos, this.pos);
    let d = desired.mag();
    let speed = this.maxSpeed;
    if (d < 100) {
      speed = map(d, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    fill(this.col);
    stroke(255);
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }
  

  collides(other) {
    let d = p5.Vector.dist(this.pos, other.pos);
    return d < this.r + other.r;
  }

  avoidCollision(other) {
    let opposite1 = p5.Vector.sub(this.pos, other.pos).normalize().mult(this.maxSpeed);
    let opposite2 = p5.Vector.sub(other.pos, this.pos).normalize().mult(other.maxSpeed);
    this.vel = opposite1;
    other.vel = opposite2;
  }
}

class Target {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.r = 16; // Rayon de la cible
    this.speed = 1; // Vitesse de déplacement de la cible
    this.velocity = p5.Vector.random2D().mult(this.speed);
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = height;
  }

  update() {
    this.pos.add(this.velocity);
    this.edges();
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }

  isReached(vehicle) {
    let d = p5.Vector.dist(vehicle.pos, this.pos);
    return d < vehicle.r + this.r;
  }

  resetPosition() {
    this.pos.set(random(width), random(height));
  }
}
