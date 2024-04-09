class ArrivalBehaviour {
  constructor(target, distance = 100, slowdown = 0.2) {
    this.target = target;
    this.distance = distance;
    this.slowdown = slowdown;
  }

  update(entity) {
    // Calculate the desired velocity towards the target
    const desiredVelocity = Vector2D.subtract(
      this.target.position,
      entity.position
    );

    // Calculate the distance to the target
    const distanceToTarget = desiredVelocity.magnitude();

    // Check if the entity has arrived at the target
    if (distanceToTarget <= this.distance) {
      // Slow down the entity's velocity based on the distance
      const slowdownFactor = distanceToTarget / this.distance;
      desiredVelocity.multiply(slowdownFactor * this.slowdown);
    } else {
      // Normalize the desired velocity
      desiredVelocity.normalize();

      // Scale the desired velocity by the maximum speed of the entity
      desiredVelocity.multiply(entity.maxSpeed);
    }

    // Calculate the steering force required to reach the target
    const steeringForce = Vector2D.subtract(desiredVelocity, entity.velocity);

    // Apply the steering force to the entity's acceleration
    entity.acceleration.add(steeringForce);
  }
}

const entity = {
  position: new Vector2D(0, 0), // Replace with the actual entity position
  velocity: new Vector2D(0, 0), // Replace with the actual entity velocity
  acceleration: new Vector2D(0, 0), // Replace with the actual entity acceleration
  maxSpeed: 5, // Replace with the actual maximum speed of the entity
};

const arrivalBehaviour = new ArrivalBehaviour(target, 150, 0.3); // Adjust the distance and slowdown values as needed
arrivalBehaviour.update(entity);

function show(x, y) {
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
