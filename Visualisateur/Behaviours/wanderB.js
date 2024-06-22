class WanderB {
  constructor(
    distanceCercleWander = 50,
    wanderRadius = 50,
    wanderTheta = 0,
    displaceRange = PI / 4,
    magnitude = 1
  ) {
    this.distanceCercleWander = distanceCercleWander;
    this.wanderRadius = wanderRadius;
    this.wanderTheta = wanderTheta;
    this.displaceRange = displaceRange;
    this.magnitude = magnitude;
    this.debug = false;
  }

  calculateForce(entity) {
    let wanderPoint = entity.vel
      .copy()
      .setMag(this.distanceCercleWander)
      .add(entity.pos);

    let theta = this.wanderTheta + entity.vel.heading();
    let x = this.wanderRadius * cos(theta);
    let y = this.wanderRadius * sin(theta);

    wanderPoint.add(x, y);
    let desiredSpeed = wanderPoint.sub(entity.pos);

    let force = desiredSpeed.copy().setMag(this.magnitude);
    this.wanderTheta += random(-this.displaceRange, this.displaceRange);
    return force;
  }
  draw() {}

  drawDebug(entity) {
    // Draw the wander radius
    noFill();
    stroke(0, 255, 0); // Green color for radius
    ellipse(entity.pos.x, entity.pos.y, this.wanderRadius * 2);

    // Draw the wander direction line
    let wanderDirection = p5.Vector.fromAngle(
      entity.vel.heading() + this.wanderTheta
    ).setMag(this.wanderRadius);
    stroke(255, 0, 0); // Red color for direction line
    line(
      entity.pos.x,
      entity.pos.y,
      entity.pos.x + wanderDirection.x,
      entity.pos.y + wanderDirection.y
    );
  }
}
