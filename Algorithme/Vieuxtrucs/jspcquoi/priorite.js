let vehicle1;
let vehicle2;

function setup() {
  createCanvas(400, 400);
  vehicle1 = new Vehicle(100, height / 2, 2, 0);
  vehicle2 = new Vehicle(width / 2, 100, 0, 2);
}

function draw() {
  background(220);
  
  // Mise à jour et affichage des véhicules
  vehicle1.update(vehicle2);
  vehicle1.display();
  vehicle2.update(vehicle1);
  vehicle2.display();
}

class Vehicle {
  constructor(x, y, vx, vy) {
    this.pos = createVector(x, y); // Position
    this.vel = createVector(vx, vy); // Vitesse
    this.size = 20; // Taille
    this.stopped = false; // Indicateur pour savoir si le véhicule est arrêté temporairement
    this.stopTimer = 0; // Temporisation pour l'arrêt temporaire
    this.stopDuration = 60; // Durée de l'arrêt temporaire (en frames)
  }

  // Mettre à jour la position du véhicule
  update(other) {
    // Vérifier si les deux véhicules sont sur le point de se croiser
    let d = dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y);
    if (d < this.size / 2 + other.size / 2) {
      // Déterminer le véhicule qui doit s'arrêter en fonction de la position x
      if (this.pos.x > other.pos.x && !other.stopped) {
        // Si ce véhicule a une position x plus grande et que l'autre n'est pas arrêté, il s'arrête temporairement
        this.stopped = true;
        this.prevVel = this.vel.copy();
        this.vel.set(0, 0);
        this.stopTimer = frameCount + this.stopDuration; // Définir le temps d'arrêt temporaire
      } else if (this.pos.x < other.pos.x && !this.stopped) {
        // Si ce véhicule a une position x plus petite et qu'il n'est pas arrêté, l'autre s'arrête temporairement
        other.stopped = true;
        other.vel.set(0, 0);
        other.stopTimer = frameCount + other.stopDuration; // Définir le temps d'arrêt temporaire
      }
    }
    
    // Vérifier si le véhicule est en arrêt temporaire et réinitialiser l'arrêt après le délai
    if (this.stopped && frameCount >= this.stopTimer) {
      this.stopped = false;
      this.vel = createVector(random(-0, 1), random(-0, 1)); // Reprendre une vitesse aléatoire après l'arrêt temporaire
    }
    
    // Mettre à jour la position uniquement si le véhicule n'est pas arrêté temporairement
    if (!this.stopped) {
      this.pos.add(this.vel);
    }

    // Vérifier si le véhicule sort du canvas et inverser la direction si nécessaire
    if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
      this.reverse();
    }
  }

  // Afficher le véhicule
  display() {
    fill(255);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  // Inverser la direction du véhicule
  reverse() {
    this.vel.mult(-1);
  }
}
