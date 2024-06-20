/*
  Calcule la projection orthogonale du point a sur le vecteur b
  a et b sont des vecteurs calculés comme ceci :
  let v1 = p5.Vector.sub(a, pos); soit v1 = pos -> a
  let v2 = p5.Vector.sub(b, pos); soit v2 = pos -> b
  */
function findProjection(pos, a, b) {
  let v1 = p5.Vector.sub(a, pos);
  let v2 = p5.Vector.sub(b, pos);
  v2.normalize();
  let sp = v1.dot(v2);
  v2.mult(sp);
  v2.add(pos);
  return v2;
}

class Vehicle {
  static debug = false;

  constructor(x, y, imageVaisseau) {
    this.imageVaisseau = imageVaisseau;
    // position du véhicule
    this.pos = createVector(x, y);
    // vitesse du véhicule
    this.vel = createVector(0, 0);
    // accélération du véhicule
    this.acc = createVector(0, 0);
    // vitesse maximale du véhicule
    this.maxSpeed = 1;
    // force maximale appliquée au véhicule
    this.maxForce = 0.2;
    this.color = "white";
    // à peu près en secondes
    this.dureeDeVie = 5;

    this.r_pourDessin = 16;
    // rayon du véhicule pour l'évitement
    this.r = this.r_pourDessin * 3;

    // Pour évitement d'obstacle
    this.largeurZoneEvitementDevantVaisseau = this.r / 2;
    this.distanceAhead = 20;

    // chemin derrière vaisseaux
    this.path = [];
    this.pathMaxLength = 30;
  }

  // on fait une méthode applyBehaviors qui applique les comportements
  // seek et avoid
  //   applyBehaviors(target, obstacles, vehicules, walls) {
  //     let seekForce = this.arrive(target);
  //     let avoidForceObstacles = this.avoid(obstacles);
  //     let separationForce = this.separate(vehicules);
  //     let avoidForceWalls = this.avoidWalls(walls);

  //     seekForce.mult(0.3);
  //     avoidForceObstacles.mult(0.5);
  //     separationForce.mult(0.9);
  //     avoidForceWalls.mult(0.5);

  //     this.applyForce(seekForce);
  //     this.applyForce(avoidForceObstacles);
  //     this.applyForce(separationForce);
  //     this.applyForce(avoidForceWalls);
  //   }

  applyB() {
    let wanderForce = this.wander();
    this.applyForce(wanderForce);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    // on ajoute l'accélération à la vitesse. L'accélération est un incrément de vitesse
    // (accélératiion = dérivée de la vitesse)
    this.vel.add(this.acc);
    // on contraint la vitesse à la valeur maxSpeed
    this.vel.limit(this.maxSpeed);
    // on ajoute la vitesse à la position. La vitesse est un incrément de position,
    // (la vitesse est la dérivée de la position)
    this.pos.add(this.vel);

    // on remet l'accélération à zéro
    this.acc.set(0, 0);

    // mise à jour du path (la trainée derrière)
    this.ajoutePosAuPath();

    // durée de vie
    this.dureeDeVie -= 0.01;
  }

  // On dessine le véhicule, le chemin etc.
  show() {
    // dessin du chemin
    this.drawPath();
    // dessin du vehicule
    this.drawVehicle();
  }

  drawVehicle() {
    // formes fil de fer en blanc
    stroke(255);
    // épaisseur du trait = 2
    strokeWeight(2);

    // formes pleines
    fill(this.color);

    // sauvegarde du contexte graphique (couleur pleine, fil de fer, épaisseur du trait,
    // position et rotation du repère de référence)
    push();
    // on déplace le repère de référence.
    translate(this.pos.x, this.pos.y);
    // et on le tourne. heading() renvoie l'angle du vecteur vitesse (c'est l'angle du véhicule)
    rotate(this.vel.heading());

    // dessin de l'image du vaisseau
    push();
    imageMode(CENTER);
    rotate(PI / 2);
    image(
      this.imageVaisseau,
      0,
      0,
      this.r_pourDessin * 2,
      this.r_pourDessin * 2
    );
    pop();

    // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
    //triangle(-this.r_pourDessin, -this.r_pourDessin / 2, -this.r_pourDessin, this.r_pourDessin / 2, this.r_pourDessin, 0);
    // Que fait cette ligne ?
    //this.edges();

    // draw velocity vector
    pop();
    this.drawVector(this.pos, this.vel, color(255, 0, 0));

    // Cercle pour évitement entre vehicules et obstacles
    if (Vehicle.debug) {
      stroke(255);
      noFill();
      circle(this.pos.x, this.pos.y, this.r);
    }
  }

  ajoutePosAuPath() {
    // on rajoute la position courante dans le tableau
    this.path.push(this.pos.copy());

    // si le tableau a plus de 50 éléments, on vire le plus ancien
    if (this.path.length > this.pathMaxLength) {
      this.path.shift();
    }
  }

  drawPath() {
    push();
    stroke(255);
    noFill();
    strokeWeight(1);

    fill(this.color);
    // dessin du chemin
    this.path.forEach((p, index) => {
      if (!(index % 5)) {
        circle(p.x, p.y, 1);
      }
    });
    pop();
  }
  drawVector(pos, v, color) {
    push();
    // Dessin du vecteur vitesse
    // Il part du centre du véhicule et va dans la direction du vecteur vitesse
    strokeWeight(3);
    stroke(color);
    line(pos.x, pos.y, pos.x + v.x, pos.y + v.y);
    // dessine une petite fleche au bout du vecteur vitesse
    let arrowSize = 5;
    translate(pos.x + v.x, pos.y + v.y);
    rotate(v.heading());
    translate(-arrowSize / 2, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
  wander() {
    let wanderR = 25; // Radius for our "wander circle"
    let wanderD = 80; // Distance for our "wander circle"
    let change = 0.3;
    let circlePos = this.vel.copy();
    circlePos.normalize();
    circlePos.mult(wanderD);
    circlePos.add(this.pos);

    let h = this.vel.heading();

    let circleOffSet = createVector(
      wanderR * cos(change),
      wanderR * sin(change)
    );
    change += random(-0.5, 0.5);

    let target = p5.Vector.add(circlePos, circleOffSet);

    let desired = p5.Vector.sub(target, this.pos);
    desired.normalize();
    desired.mult(this.maxSpeed);

    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    return steer;
  }
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }

  show() {
    push();
    stroke(255);
    strokeWeight(2);
    fill("#F063A4");
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.r * 2);
    pop();
    pop();
  }

  applyForce(force) {
    this.acc.add(force);
  }
}
