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
    this.maxSpeed = 4;
    // force maximale appliquée au véhicule
    this.maxForce = 0.7;
    this.color = "white";
    // à peu près en secondes
    this.dureeDeVie = 5;

    this.r_pourDessin = 24;
    // rayon du véhicule pour l'évitement
    this.r = this.r_pourDessin * 3;

    // Pour évitement d'obstacle
    this.largeurZoneEvitementDevantVaisseau = this.r / 2;
    this.distanceAhead = 30;

    // chemin derrière vaisseaux
    this.path = [];
    this.pathMaxLength = 30;
  }

  // on fait une méthode applyBehaviors qui applique les comportements
  // seek et avoid
  applyBehaviors(target, obstacles, vehicules) {

    let seekForce = this.arrive(target);
    let avoidForceObstacles = this.avoid(obstacles);
    //let avoidForceVehicules = this.avoidVehicules(vehicules);
    let separationForce = this.separate(vehicules);

    seekForce.mult(0.2);
    avoidForceObstacles.mult(0.9);
    //avoidForceVehicules.mult(0);
    separationForce.mult(0.9);

    this.applyForce(seekForce);
    this.applyForce(avoidForceObstacles);
    //this.applyForce(avoidForceVehicules);
    this.applyForce(separationForce);
  }

  // Méthode d'évitement d'obstacle, implémente le comportement avoid
  // renvoie une force (un vecteur) pour éviter l'obstacle
  avoid(obstacles) {
    // calcul d'un vecteur ahead devant le véhicule
    // il regarde par exemple 50 frames devant lui
    let ahead = this.vel.copy();
    ahead.mult(this.distanceAhead);
    // on l'ajoute à la position du véhicule
    let pointAuBoutDeAhead = p5.Vector.add(this.pos, ahead);

    if (Vehicle.debug) {
      // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
      this.drawVector(this.pos, ahead, color(255, 0, 0));
      // On dessine ce point au bout du vecteur ahead pour debugger
      fill("lightgreen");
      noStroke();
      circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);

      // On dessine ce point au bout du vecteur ahead pour debugger
      fill("lightgreen");
      noStroke();
      circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
    }

    // Calcule de ahead2, deux fois plus petit que le premier
    let ahead2 = ahead.copy();
    ahead2.mult(0.5);
    let pointAuBoutDeAhead2 = p5.Vector.add(this.pos, ahead2);
    if (Vehicle.debug) {

      // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
      this.drawVector(this.pos, ahead2, color("lightblue"));
      // On dessine ce point au bout du vecteur ahead pour debugger
      fill("orange");
      noStroke();
      circle(pointAuBoutDeAhead2.x, pointAuBoutDeAhead2.y, 10);
    }
    // Detection de l'obstacle le plus proche
    let obstacleLePlusProche = this.getObstacleLePlusProche(obstacles);

    // Si pas d'obstacle, on renvoie un vecteur nul
    if (obstacleLePlusProche == undefined) {
      return createVector(0, 0);
    }

    // On calcule la distance entre le centre du cercle de l'obstacle 
    // et le bout du vecteur ahead
    let distance = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead);
    // et pour ahead2
    let distance2 = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead2);
    // et pour la position du vaiseau
    let distance3 = obstacleLePlusProche.pos.dist(this.pos);

    let plusPetiteDistance = min(distance, distance2);
    plusPetiteDistance = min(plusPetiteDistance, distance3);

    let pointLePlusProcheDeObstacle = undefined;
    let alerteRougeVaisseauDansObstacle = false;

    if (distance == plusPetiteDistance) {
      pointLePlusProcheDeObstacle = pointAuBoutDeAhead;
    } else if (distance2 == plusPetiteDistance) {
      pointLePlusProcheDeObstacle = pointAuBoutDeAhead2;
    } else if (distance3 == plusPetiteDistance) {
      pointLePlusProcheDeObstacle = this.pos;
      // si le vaisseau est dans l'obstacle, alors alerte rouge !
      if (distance3 < obstacleLePlusProche.r) {
        alerteRougeVaisseauDansObstacle = true;
        obstacleLePlusProche.color = color("red");
      } else {
        obstacleLePlusProche.color = "green";
      }
    }

    
    // On dessine la zone d'évitement
    // Pour cela on trace une ligne large qui va de la position du vaisseau
    // jusqu'au point au bout de ahead
    if (Vehicle.debug) {
      stroke(255, 200, 0, 90);
      strokeWeight(this.largeurZoneEvitementDevantVaisseau);
      line(this.pos.x, this.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);
    }
    // si la distance est < rayon de l'obstacle
    // il y a collision possible et on dessine l'obstacle en rouge

    if (plusPetiteDistance < obstacleLePlusProche.r + this.largeurZoneEvitementDevantVaisseau) {
      // collision possible

      // calcul de la force d'évitement. C'est un vecteur qui va
      // du centre de l'obstacle vers le point au bout du vecteur ahead
      let force = p5.Vector.sub(pointLePlusProcheDeObstacle, obstacleLePlusProche.pos);

      // on le dessine en jaune pour vérifier qu'il est ok (dans le bon sens etc)
      if(Vehicle.debug)
        this.drawVector(obstacleLePlusProche.pos, force, "yellow");

      // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
      // on limite ce vecteur à la longueur maxSpeed
      // force est la vitesse désirée
      force.setMag(this.maxSpeed);
      // on calcule la force à appliquer pour atteindre la cible avec la formule
      // que vous commencez à connaitre : force = vitesse désirée - vitesse courante
      force.sub(this.vel);
      // on limite cette force à la longueur maxForce
      force.limit(this.maxForce);

      if (alerteRougeVaisseauDansObstacle) {
        return force.setMag(this.maxForce * 2);
      } else {
        return force;
      }

    } else {
      // pas de collision possible
      return createVector(0, 0);
    }
  }

  avoidVehicules(vehicules) {
    // calcul d'un vecteur ahead devant le véhicule
    // il regarde par exemple 50 frames devant lui
    let ahead = this.vel.copy();
    ahead.mult(this.distanceAhead);
    // on l'ajoute à la position du véhicule
    let pointAuBoutDeAhead = p5.Vector.add(this.pos, ahead);

    if (Vehicle.debug) {
      // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
      this.drawVector(this.pos, ahead, color(255, 0, 0));
      // On dessine ce point au bout du vecteur ahead pour debugger
      fill("lightgreen");
      noStroke();
      circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);

      // On dessine ce point au bout du vecteur ahead pour debugger
      fill("lightgreen");
      noStroke();
      circle(pointAuBoutDeAhead.x, pointAuBoutDeAhead.y, 10);
    }

    // Calcule de ahead2, deux fois plus petit que le premier
    let ahead2 = ahead.copy();
    ahead2.mult(0.5);
    let pointAuBoutDeAhead2 = p5.Vector.add(this.pos, ahead2);
    if (Vehicle.debug) {

      // on le dessine avec ma méthode this.drawVector(pos vecteur, color)
      this.drawVector(this.pos, ahead2, color("lightblue"));
      // On dessine ce point au bout du vecteur ahead pour debugger
      fill("orange");
      noStroke();
      circle(pointAuBoutDeAhead2.x, pointAuBoutDeAhead2.y, 10);
    }
    // Detection de l'obstacle le plus proche
    let obstacleLePlusProche = this.getVehiculeLePlusProche(vehicules);

    // Si pas d'obstacle, on renvoie un vecteur nul
    if (obstacleLePlusProche == undefined) {
      return createVector(0, 0);
    }

    // On calcule la distance entre le centre du cercle de l'obstacle 
    // et le bout du vecteur ahead
    let distance = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead);
    // et pour ahead2
    let distance2 = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead2);
    // et pour la position du vaiseau
    let distance3 = obstacleLePlusProche.pos.dist(this.pos);

    let plusPetiteDistance = min(distance, distance2);
    plusPetiteDistance = min(plusPetiteDistance, distance3);

    let pointLePlusProcheDeObstacle = undefined;
    let alerteRougeVaisseauDansObstacle = false;

    if (distance == plusPetiteDistance) {
      pointLePlusProcheDeObstacle = pointAuBoutDeAhead;
    } else if (distance2 == plusPetiteDistance) {
      pointLePlusProcheDeObstacle = pointAuBoutDeAhead2;
    } else if (distance3 == plusPetiteDistance) {
      pointLePlusProcheDeObstacle = this.pos;
      // si le vaisseau est dans l'obstacle, alors alerte rouge !
      if (distance3 < obstacleLePlusProche.r) {
        alerteRougeVaisseauDansObstacle = true;
        obstacleLePlusProche.color = color("red");
      } else {
        obstacleLePlusProche.color = "green";
      }
    }

    
    // On dessine la zone d'évitement
    // Pour cela on trace une ligne large qui va de la position du vaisseau
    // jusqu'au point au bout de ahead
    if (Vehicle.debug) {
      stroke(255, 200, 0, 90);
      strokeWeight(this.largeurZoneEvitementDevantVaisseau);
      line(this.pos.x, this.pos.y, pointAuBoutDeAhead.x, pointAuBoutDeAhead.y);
    }
    // si la distance est < rayon de l'obstacle
    // il y a collision possible et on dessine l'obstacle en rouge

    if (plusPetiteDistance < obstacleLePlusProche.r + this.largeurZoneEvitementDevantVaisseau) {
      // collision possible

      // calcul de la force d'évitement. C'est un vecteur qui va
      // du centre de l'obstacle vers le point au bout du vecteur ahead
      let force = p5.Vector.sub(pointLePlusProcheDeObstacle, obstacleLePlusProche.pos);

      // on le dessine en jaune pour vérifier qu'il est ok (dans le bon sens etc)
      if(Vehicle.debug)
        this.drawVector(obstacleLePlusProche.pos, force, "yellow");

      // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
      // on limite ce vecteur à la longueur maxSpeed
      // force est la vitesse désirée
      force.setMag(this.maxSpeed);
      // on calcule la force à appliquer pour atteindre la cible avec la formule
      // que vous commencez à connaitre : force = vitesse désirée - vitesse courante
      force.sub(this.vel);
      // on limite cette force à la longueur maxForce
      force.limit(this.maxForce);

      if (alerteRougeVaisseauDansObstacle) {
        return force.setMag(this.maxForce * 2);
      } else {
        return force;
      }

    } else {
      // pas de collision possible
      return createVector(0, 0);
    }
  }

  getObstacleLePlusProche(obstacles) {
    let plusPetiteDistance = 100000000;
    let obstacleLePlusProche = undefined;

    obstacles.forEach(o => {
      // Je calcule la distance entre le vaisseau et l'obstacle
      const distance = this.pos.dist(o.pos);

      if (distance < plusPetiteDistance) {
        plusPetiteDistance = distance;
        obstacleLePlusProche = o;
      }
    });

    return obstacleLePlusProche;
  }

  getVehiculeLePlusProche(vehicules) {
    let plusPetiteDistance = Infinity;
    let vehiculeLePlusProche;

    vehicules.forEach(v => {
      if (v != this) {
        // Je calcule la distance entre le vaisseau et le vehicule
        const distance = this.pos.dist(v.pos);
        if (distance < plusPetiteDistance) {
          plusPetiteDistance = distance;
          vehiculeLePlusProche = v;
        }
      }
    });

    return vehiculeLePlusProche;
  }


  
  separate(boids) {
    let desiredseparation = this.r * 2;
    let steer = createVector(0, 0, 0);
    let count = 0;
    // On examine les autres boids pour voir s'ils sont trop près
    for (let i = 0; i < boids.length; i++) {
      let other = boids[i];
      let d = p5.Vector.dist(this.pos, other.pos);
      // Si la distance est supérieure à 0 et inférieure à une valeur arbitraire (0 quand on est soi-même)
      if (d > 0 && d < desiredseparation) {
        // Calculate vector pointing away from neighbor
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.normalize();
        diff.div(d); // poids en fonction de la distance. Plus le voisin est proche, plus le poids est grand
        steer.add(diff);
        count++; // On compte le nombre de voisins
      }
    }
    // On moyenne le vecteur steer en fonction du nombre de voisins
    if (count > 0) {
      steer.div(count);
    }

    // si la force de répulsion est supérieure à 0
    if (steer.mag() > 0) {
      // On implemente : Steering = Desired - Velocity
      steer.normalize();
      steer.mult(this.maxSpeed);
      steer.sub(this.vel);
      steer.limit(this.maxForce);
    }
    return steer;
  }

  arrive(target) {
    // 2nd argument true enables the arrival behavior
    return this.seek(target, true);
  }

  seek(target, arrival = false) {
    let force = p5.Vector.sub(target, this.pos);
    let desiredSpeed = this.maxSpeed;
    if (arrival) {
      let slowRadius = 100;
      let distance = force.mag();
      if (distance < slowRadius) {
        desiredSpeed = map(distance, 0, slowRadius, 0, this.maxSpeed);
      }
    }
    force.setMag(desiredSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    return force;
  }

  // inverse de seek !
  flee(target) {
    return this.seek(target).mult(-1);
  }

  /* Poursuite d'un point devant la target !
     cette methode renvoie la force à appliquer au véhicule
  */
  pursue(vehicle) {
    let target = vehicle.pos.copy();
    let prediction = vehicle.vel.copy();
    prediction.mult(10);
    target.add(prediction);
    fill(0, 255, 0);
    circle(target.x, target.y, 16);
    return this.seek(target);
  }

  evade(vehicle) {
    let pursuit = this.pursue(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  // applyForce est une méthode qui permet d'appliquer une force au véhicule
  // en fait on additionne le vecteurr force au vecteur accélération
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

  ajoutePosAuPath() {
    // on rajoute la position courante dans le tableau
    this.path.push(this.pos.copy());

    // si le tableau a plus de 50 éléments, on vire le plus ancien
    if (this.path.length > this.pathMaxLength) {
      this.path.shift();
    }
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
    rotate(PI/2);
    imageMode(CENTER);
    image(this.imageVaisseau, 0, 0, this.r_pourDessin*2, this.r_pourDessin*2);
    pop();
   
    // Dessin d'un véhicule sous la forme d'un triangle. Comme s'il était droit, avec le 0, 0 en haut à gauche
   // triangle(-this.r_pourDessin, -this.r_pourDessin / 2, -this.r_pourDessin, this.r_pourDessin / 2, this.r_pourDessin, 0);
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

  // que fait cette méthode ?
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
}