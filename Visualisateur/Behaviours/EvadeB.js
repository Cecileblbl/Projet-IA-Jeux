class EvadeB {
  constructor(target) {
    this.target = target;
    this.magniture = 1;
  }

  calculateForce(entity) {
    this.target.update();
    // 1 - Calcul de la position future de la cible
    let prediction = this.target.vel.copy();
    prediction.mult(10); // On suppose une prédiction de 10 frames dans le futur
    prediction.add(this.target.pos);

    // 2 - Calcul du vecteur force pour échapper à la position prédite de la cible
    let force = p5.Vector.sub(prediction, entity.pos);
    force.setMag(entity.maxSpeed);
    force.mult(-1); // Inversion pour l'évasion
    force.sub(entity.vel);
    force.limit(entity.maxForce);

    return force;
  }

  draw() {
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
    // Dessiner la cible future prédite
    let prediction = this.target.vel.copy();
    prediction.mult(10);
    prediction.add(this.target.pos);
    fill("red");
    ellipse(prediction.x, prediction.y, 20, 20);

    // Dessiner la cible actuelle
    fill("blue");
    ellipse(this.target.pos.x, this.target.pos.y, 10, 10);

    // Optionally, you can also draw lines or additional information
    stroke("red");
    line(this.target.pos.x, this.target.pos.y, prediction.x, prediction.y);
  }
}
