class Vehicle {
  static debug = false;

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 10;
    this.maxForce = 0.9;
    this.r = 16;
    this.rayonZoneDeFreinage = 100;

    // Pour le dessin du chemin parcouru
    this.path = [];
    this.nbMaxPointsChemin = 40;
  }

  /* Poursuite d'un point devant la target !
      cette methode renvoie la force à appliquer au véhicule
   */
  pursue(target, evade = false) {
    // TODO
    // 1 - calcul de la position future de la cible
    // on fait une copie de la position de la target
    // 2 - On calcule un vecteur colinéaire au vecteur vitesse de la cible,
    let prediction = target.vel.copy();
    // et on le multiplie par 10 (10 frames)
    // 3 - prediction dans 10 frames = 10 fois la longueur du vecteur

    // target.distancePrediction varie en fonction de
    // la distance entre le véhicule et la cible
    // plus la cible est loin, plus on prédit loin

    prediction.mult(target.distancePrediction);
    // 4 - on positionne de la target au bout de ce vecteur
    prediction.add(target.pos);


    console.log("target distance prediction", target.distancePrediction)
    // dessin du vecteur prediction
    let v = p5.Vector.sub(prediction, target.pos);
    this.drawVector(target.pos, v);

    // 2 - dessin d'un cercle vert de rayon 20 pour voir ce point
    fill("green");
    circle(prediction.x, prediction.y, 20);

    // 3 - appel à seek avec ce point comme cible 
    let force = this.seek(prediction, evade);

    // n'oubliez pas, on renvoie la force à appliquer au véhicule !
    return force;
  }

  /* inverse de pursue
     cette methode renvoie la force à appliquer au véhicule
  */
  evade(target) {
    let evade = true;
    return this.pursue(target, evade);
  }


  arrive(target, distanceVisee = 0) {
    // 2nd argument true enables the arrival behavior
    return this.seek(target, true, distanceVisee);
  }

  flee(target) {
    // recopier code de flee de l'exemple précédent
  }

  seek(target, arrival = false, distanceVisee = 0) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;

    if (arrival) {
      // On définit un rayon de 100 pixels autour de la cible
      // si la distance entre le véhicule courant et la cible
      // est inférieure à ce rayon, on ralentit le véhicule
      // desiredSpeed devient inversement proportionnelle à la distance
      // si la distance est petite, force = grande
      // Vous pourrez utiliser la fonction P5 
      // distance = map(valeur, valeurMin, valeurMax, nouvelleValeurMin, nouvelleValeurMax)
      // qui prend une valeur entre valeurMin et valeurMax et la transforme en une valeur
      // entre nouvelleValeurMin et nouvelleValeurMax

      // TODO !
      // Approche expérimentale
      // on ajuste le rayon en fonction de la vitesse du véhicule
      //console.log(this.vel.mag());
      //this.rayonZoneDeFreinage = this.vel.mag()*30;

      // 1 - dessiner le cercle de rayon 50 autour du vehicule
      if (Vehicle.debug) {
        stroke("white");
        noFill();
        circle(this.pos.x, this.pos.y, this.rayonZoneDeFreinage);
      }

      // 2 - calcul de la distance entre la cible et le vehicule
      let distance = p5.Vector.dist(this.pos, target);

      // 3 - si distance < rayon du cercle, alors on modifie desiredSPeed
      // qui devient inversement proportionnelle à la distance.
      // si d = rayon alors desiredSpeed = maxSpeed
      // si d = 0 alors desiredSpeed = 0
      desiredSpeed = map(distance, distanceVisee, this.rayonZoneDeFreinage + distanceVisee, 0, this.maxSpeed);
    }

    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    // Pour le chemin, on ajoute la nouvelle position
    // du vehicule au tableau path
    this.path.push(this.pos.copy());

    // Si le tableau dépasse la taille maximale
    // on enleve les points les plus anciens
    if (this.path.length > this.nbMaxPointsChemin) {
      this.path.shift();
    }
  }

  show() {
    this.dessineVehicule();
    this.dessineCheminDerriere();
  }

  dessineCheminDerriere() {
    // on parcour le tableau path
    // et on dessine un cercle à chaque position
    // du tableau
    this.path.forEach((pos, index) => {
      if (index % 3 == 0) {
        stroke("white");
        noFill();
        circle(pos.x, pos.y, 2);
      }
    });
  }

  dessineVehicule() {
    stroke(255);
    strokeWeight(2);
    fill(255);
    stroke(0);
    strokeWeight(2);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
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
}

class Target extends Vehicle {
  constructor(x, y) {
    super(x, y);
    this.vel = p5.Vector.random2D();
    this.vel.mult(5);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill("#F063A4");
    push();
    translate(this.pos.x, this.pos.y);
    circle(0, 0, this.r * 2);
    pop();
  }
}
