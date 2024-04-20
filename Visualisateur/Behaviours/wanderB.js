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
}
