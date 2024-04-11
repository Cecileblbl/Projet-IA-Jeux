class FleeBehaviour {
  constructor(target) {
    this.target = target;
  }
  calculateForce(entity) {
    // Calculate the desired velocity away from the target
    const desiredVelocity = Vector2D.subtract(
      entity.position,
      this.target.position
    );

    // Normalize the desired velocity
    desiredVelocity.normalize();

    // Scale the desired velocity by the maximum speed of the entity
    desiredVelocity.multiply(entity.maxSpeed);

    // Calculate the steering force required to flee from the target
    const steeringForce = Vector2D.subtract(desiredVelocity, entity.velocity);

    return steeringForce;
  }
}
