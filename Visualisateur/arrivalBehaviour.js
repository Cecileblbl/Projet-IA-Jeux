class ArrivalBehaviour {
  constructor(target, distance = 100, slowdown = 0.2) {
    this.target = target;
    this.distance = distance;
    this.slowdown = slowdown;
  }

  calculateForce(entity) {
    const desiredVelocity = p5.Vector.sub(
      this.target.position,
      entity.position
    );
    const distance = desiredVelocity.mag();
    desiredVelocity.setMag(entity.maxSpeed);

    if (distance < this.distance) {
      const mappedSpeed = map(distance, 0, this.distance, 0, entity.maxSpeed);
      desiredVelocity.setMag(mappedSpeed);
    } else {
      desiredVelocity.setMag(entity.maxSpeed);
    }

    const steeringForce = p5.Vector.sub(desiredVelocity, entity.velocity);
    steeringForce.limit(entity.maxForce);

    return steeringForce.mult(this.slowdown);
  }

  show(x, y) {
    fill(0);
    const title = "Arrival Behaviour";
    text(title, x, y);
    if (this.target) {
      const targetPosition = `Target Position: (${this.target.position.x}, ${this.target.position.y})`;
      text(targetPosition, x, y + 20);
    } else {
      text("Target Position: None", x, y + 20);
    }
    text(`Arrival Distance: ${this.distance}`, x, y + 40);
    text(`Slowdown Factor: ${this.slowdown}`, x, y + 60);
  }
}