class SeekB {
  constructor(target) {
    this.target = target;
    this.magnitude = 1;
    this.debug = false;
  }

  calculateForce(entity) {
    // on calcule la direction vers la cible
    // C'est l'ETAPE 1 (action : se diriger vers une cible)
    let force = p5.Vector.sub(this.target, entity.pos);

    // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
    // on limite ce vecteur à la longueur maxSpeed
    force.setMag(entity.maxSpeed);

    // on calcule maintenant force = desiredSpeed - currentSpeed
    force.sub(entity.vel);
    // et on limite cette force à la longueur maxForce
    force.limit(entity.maxForce);
    return force;
  }

  draw() {
    // draw target
    ellipse(this.target.x, this.target.y, 10, 10);
  }

  drawDebug(entity) {
    // Step 1: Calculate the direction towards the target
    let force = p5.Vector.sub(this.target, entity.pos);

    // Step 2: Limit the vector to maximum speed
    force.setMag(entity.maxSpeed);

    // Step 3: Calculate the desired velocity
    let desired = p5.Vector.sub(force, entity.vel);

    // Step 4: Limit the force to maximum force
    desired.limit(entity.maxForce);

    // Step 5: Draw the green vector representing the force
    push();
    stroke(0, 255, 0); // Green color
    strokeWeight(3);
    let arrowSize = 10;
    line(
      entity.pos.x,
      entity.pos.y,
      entity.pos.x + desired.x,
      entity.pos.y + desired.y
    );
    translate(entity.pos.x + desired.x, entity.pos.y + desired.y);
    rotate(desired.heading());
    translate(-arrowSize / 2, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
  }
}
