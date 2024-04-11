class SeekBehaviour {
  constructor(target) {
    this.target = target;
  }

  calculateForce(entity) {
    // Calculate the desired velocity towards the target
    const desiredVelocity = Vector2D.subtract(
      this.target.position,
      entity.position
    );

    // Normalize the desired velocity
    desiredVelocity.normalize();

    // Scale the desired velocity by the maximum speed of the entity
    desiredVelocity.multiply(entity.maxSpeed);

    // Calculate the steering force required to reach the target
    const steeringForce = Vector2D.subtract(desiredVelocity, entity.velocity);

    return steeringForce;
  }
}
