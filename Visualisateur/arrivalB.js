class ArrivalB {
  constructor(target, distance = 100, slowdown = 0.2) {
    this.target = target;
    this.magnitude = 1;
    this.distance = distance;
    this.slowdown = slowdown;
  }

  calculateForce(entity) {
    let force = p5.Vector.sub(this.target, entity.pos);
    let distance = force.mag();

    // Si l'entité est à moins de 'distance' de la cible, on commence à ralentir
    if (distance < this.distance) {
      let speed = entity.maxSpeed * (distance / this.distance) * this.slowdown;
      force.setMag(speed);
    } else {
      // Sinon, on continue à chercher normalement
      force.setMag(entity.maxSpeed);
    }

    force.sub(entity.vel);
    force.limit(entity.maxForce);
    return force;
  }

  draw() {
    // draw target
    ellipse(this.target.x, this.target.y, 10, 10);
  }
}
