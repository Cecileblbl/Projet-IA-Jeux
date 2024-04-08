class Obstacle {
    constructor(x, y, radius) {
      this.x = x; // Position en x
      this.y = y; // Position en y
      this.radius = radius; // Rayon de l'obstacle
    }
  
    // Méthode pour afficher l'obstacle
    display() {
      fill(150);
      ellipse(this.x, this.y, this.radius * 2);
    }
  }
