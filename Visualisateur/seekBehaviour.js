class SeekBehaviour {
  constructor(target) {
    this.target = target;
  }

  show(x, y) {
    fill(0);
    const title = "Seek Behaviour";
    text(title, x, y);
    if (this.target) {
      const targetPosition = `Target Position: (${this.target.position.x}, ${this.target.position.y})`;
      text(targetPosition, x, y + 20);
    } else {
      text("Target Position: None", x, y + 20);
    }
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
