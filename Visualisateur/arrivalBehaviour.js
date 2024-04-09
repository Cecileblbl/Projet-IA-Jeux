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
      button = createButton("Create Target");
      button.position(x, y + 20);
      button.mousePressed(() => {
        targetpicking();
      });
    }
    let distanceInput,
      slowdownInput,
      updateDistanceButton,
      updateSlowdownButton;

    // Create input fields and buttons
    distanceInput = createInput();
    distanceInput.position(x, y + 40);

    updateDistanceButton = createButton("Update Distance");
    updateDistanceButton.position(x + 200, y + 40); // Align with distanceInput

    slowdownInput = createInput();
    slowdownInput.position(x, y + 70); // Move down

    updateSlowdownButton = createButton("Update Slowdown");
    updateSlowdownButton.position(x + 200, y + 70); // Align with slowdownInput

    updateDistanceButton.mousePressed(() => {
      this.distance = parseFloat(distanceInput.value());
    });

    updateSlowdownButton.mousePressed(() => {
      this.slowdown = parseFloat(slowdownInput.value());
    });

    text(`Arrival Distance: ${this.distance}`, x, y + 20); // Move up
    text(`Slowdown Factor: ${this.slowdown}`, x, y + 50); // Move up
  }
}

let targetpicking = () => {
  let target = new Target(mouseX, mouseY);
  behaviours.push(new ArrivalBehaviour(target));
};
