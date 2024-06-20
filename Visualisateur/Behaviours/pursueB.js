class PursueB {
  constructor(target, distancePrediction = 10) {
    this.target = target;
    this.distancePrediction = distancePrediction;
    this.magnitude = 1;
  }

  calculateForce(entity) {
    // Step 1: Calculate the future position of the target
    let futurePos = this.target.pos.copy();
    let prediction = this.target.vel.copy().mult(this.distancePrediction);
    futurePos.add(prediction);

    // Step 2: Calculate the seeking force towards the future position
    let force = p5.Vector.sub(futurePos, entity.pos);
    force.setMag(entity.maxSpeed);
    force.sub(entity.vel);
    force.limit(entity.maxForce);

    return force;
  }

  draw() {
    this.target.update();
    // Dessiner la cible future prédite
    let prediction = this.target.vel.copy();
    prediction.mult(10);
    prediction.add(this.target.pos);
    fill("red");
    ellipse(prediction.x, prediction.y, 20, 20);

    // Dessiner la cible actuelle
    fill("blue");
    ellipse(this.target.pos.x, this.target.pos.y, 10, 10);
  }

  debug(entity) {
    // Step 1: Calculate the future position of the target
    let futurePos = this.target.pos.copy();
    let prediction = this.target.vel.copy().mult(this.distancePrediction);
    futurePos.add(prediction);

    // Step 2: Draw the red vector representing the velocity of the target vehicle
    push();
    stroke(255, 0, 0); // Red color for velocity vector
    strokeWeight(3);
    line(
      this.target.pos.x,
      this.target.pos.y,
      this.target.pos.x + this.target.vel.x * 10,
      this.target.pos.y + this.target.vel.y * 10
    );
    pop();

    // Step 3: Draw the green vector representing the pursuit direction
    let force = p5.Vector.sub(futurePos, entity.pos);
    let desired = force.copy().setMag(30);
    let pursuitTarget = p5.Vector.add(entity.pos, desired);

    push();
    stroke(0, 255, 0); // Green color for pursuit vector
    strokeWeight(3);
    line(entity.pos.x, entity.pos.y, pursuitTarget.x, pursuitTarget.y);
    pop();

    // Step 4: Draw a green circle at the predicted interception point
    fill(0, 255, 0); // Green color for circle
    ellipse(futurePos.x, futurePos.y, 16, 16);
  }
}
