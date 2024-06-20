class Bordures {
  constructor(zoneX, zoneY, zoneWidth, zoneHeight, d) {
    this.zoneX = 0;
    this.zoneY = 0;
    this.zoneWidth = width;
    this.zoneHeight = height;
    this.d = d;
    this.magnitude = 1;
  }

  calculateForce(entity) {
    let desired = null;

    let bordGauche = this.zoneX;
    let bordDroit = this.zoneX + this.zoneWidth;
    let bordHaut = this.zoneY;
    let bordBas = this.zoneY + this.zoneHeight;

    if (entity.pos.x < bordGauche + this.d) {
      desired = createVector(entity.maxSpeed, entity.vel.y);
    } else if (entity.pos.x > bordDroit - this.d) {
      desired = createVector(-entity.maxSpeed, entity.vel.y);
    }

    if (entity.pos.y < bordHaut + this.d) {
      desired = createVector(entity.vel.x, entity.maxSpeed);
    } else if (entity.pos.y > bordBas - this.d) {
      desired = createVector(entity.vel.x, -entity.maxSpeed);
    }

    if (desired !== null) {
      // le véhicule est près d'un des bords, on calcule la force de répulsion
      // force = vitesse désirée - vitesse courante et on limite à maxForce
      desired.normalize();
      desired.mult(entity.maxSpeed);
      const steer = p5.Vector.sub(desired, entity.vel);
      steer.limit(entity.maxForce);
      return steer;
    } else {
      // le véhicule est loin des bords,
      // on renvoie une force nulle (on ne fait rien de spécial)
      return createVector(0, 0);
    }
  }
  draw() {}
}
