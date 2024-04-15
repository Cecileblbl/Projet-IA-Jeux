class FleeB {
  constructor(target) {
    this.target = target;
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
}
