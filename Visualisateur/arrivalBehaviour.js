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
}
