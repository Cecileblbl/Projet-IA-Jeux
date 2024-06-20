class FleeB {
  constructor(target) {
    this.target = target;
    this.magnitude = 1;
  }
  calculateForce(entity) {
    // on calcule la direction vers la cible
    // C'est l'ETAPE 1 (action : se diriger vers une cible)
    let force = p5.Vector.sub(entity.pos, this.target);

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

  debug(entity) {
    // Draw a line from entity to target
    stroke(255, 0, 0);
    line(this.target.x, this.target.y, entity.pos.x, entity.pos.y);

    // Draw a transparent red circle around the target
    noFill();
    stroke(255, 0, 0, 100);
    ellipse(this.target.x, this.target.y, this.target.r * 2);

    // Draw a line showing the fleeing direction
    let fleeingDirection = p5.Vector.sub(entity.pos, this.target.pos);
    fleeingDirection.setMag(30);
    stroke(0, 255, 0);
    line(
      entity.pos.x,
      entity.pos.y,
      entity.pos.x + fleeingDirection.x,
      entity.pos.y + fleeingDirection.y
    );
  }
}
