class Vehicle {
  constructor(x, y, speedX, speedY) {
    this.x = x; // Position en x
    this.y = y; // Position en y
    this.speedX = speedX; // Vitesse en x
    this.speedY = speedY; // Vitesse en y
    this.radius = 10; // Rayon du véhicule
  }

  // Méthode pour afficher le véhicule
  display() {
    fill(255);
    ellipse(this.x, this.y, this.radius * 2);
  }

  // Méthode pour mettre à jour la position du véhicule
  update() {
    // Mise à jour de la position en fonction de la vitesse
    this.x += this.speedX;
    this.y += this.speedY;

    // Vérifier les collisions avec les bords du canevas
    if (this.x - this.radius < 0 || this.x + this.radius > width) {
      this.speedX *= -1; // Inverser la direction en x
    }
    if (this.y - this.radius < 0 || this.y + this.radius > height) {
      this.speedY *= -1; // Inverser la direction en y
    }
  }

  // Méthode pour détecter et éviter les collisions avec un autre véhicule
  avoidCollision(otherVehicle) {
    let distance = dist(this.x, this.y, otherVehicle.x, otherVehicle.y);
    let combinedRadius = 1.3*this.radius + otherVehicle.radius;
    if (distance < combinedRadius) {
      // Calculer la direction de collision
      let dx = this.x - otherVehicle.x;
      let dy = this.y - otherVehicle.y;
      let angle = atan2(dy, dx);
      // Calculer la nouvelle direction pour éviter la collision
      let newX = cos(angle) * combinedRadius;
      let newY = sin(angle) * combinedRadius;
      // Ajouter la nouvelle direction à la position actuelle
      this.x = otherVehicle.x + newX;
      this.y = otherVehicle.y + newY;
    }
  }

  // Méthode pour détecter et éviter les collisions avec un obstacle
  avoidObstacle(obstacle) {
    let distance = dist(this.x, this.y, obstacle.x, obstacle.y);
    let safeDistance = 1.4*this.radius + obstacle.radius;
    if (distance < safeDistance) {
      // Calculer la direction de collision
      let dx = this.x - obstacle.x;
      let dy = this.y - obstacle.y;
      let angle = atan2(dy, dx);
      // Calculer la nouvelle direction pour éviter l'obstacle
      let newX = cos(angle) * safeDistance;
      let newY = sin(angle) * safeDistance;
      // Ajouter la nouvelle direction à la position actuelle
      this.x = obstacle.x + newX;
      this.y = obstacle.y + newY;
    }
  }
}
