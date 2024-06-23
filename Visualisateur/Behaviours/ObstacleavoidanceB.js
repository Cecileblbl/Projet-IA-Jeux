class ObstacleAvoidanceB {
  constructor() {
    this.largeurZoneEvitementDevantVaisseau = 10;
    this.magnitude = 1;
  }

  calculateForce(entity) {
    // calcul d'un vecteur ahead devant le véhicule
    // il regarde par exemple 50 frames devant lui
    let ahead = entity.vel.copy();
    ahead.mult(entity.distanceAhead);
    // on l'ajoute à la position du véhicule
    let pointAuBoutDeAhead = p5.Vector.add(entity.pos, ahead);

    // Calcule de ahead2, deux fois plus petit que le premier
    let ahead2 = ahead.copy();
    ahead2.mult(0.5);
    let pointAuBoutDeAhead2 = p5.Vector.add(entity.pos, ahead2);

    // Detection de l'obstacle le plus proche
    let obstacleLePlusProche = getObstacleLePlusProche(entity);

    // Si pas d'obstacle, on renvoie un vecteur nul
    if (obstacleLePlusProche === undefined) {
      return createVector(0, 0);
    }

    // On calcule la distance entre le centre du cercle de l'obstacle
    // et le bout du vecteur ahead
    let distance = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead);
    // et pour ahead2
    let distance2 = obstacleLePlusProche.pos.dist(pointAuBoutDeAhead2);
    // et pour la position du vaisseau
    let distance3 = obstacleLePlusProche.pos.dist(entity.pos);

    let plusPetiteDistance = min(distance, distance2, distance3);

    let pointLePlusProcheDeObstacle = undefined;
    let alerteRougeVaisseauDansObstacle = false;

    if (distance === plusPetiteDistance) {
      pointLePlusProcheDeObstacle = pointAuBoutDeAhead;
    } else if (distance2 === plusPetiteDistance) {
      pointLePlusProcheDeObstacle = pointAuBoutDeAhead2;
    } else if (distance3 === plusPetiteDistance) {
      pointLePlusProcheDeObstacle = entity.pos;
      // si le vaisseau est dans l'obstacle, alors alerte rouge !
      if (distance3 < obstacleLePlusProche.r) {
        alerteRougeVaisseauDansObstacle = true;
        obstacleLePlusProche.color = color("red");
      } else {
        obstacleLePlusProche.color = "green";
      }
    }

    // si la distance est < rayon de l'obstacle
    // il y a collision possible et on calcule la force d'évitement
    if (
      plusPetiteDistance <
      obstacleLePlusProche.r + entity.largeurZoneEvitementDevantVaisseau
    ) {
      // calcul de la force d'évitement. C'est un vecteur qui va
      // du centre de l'obstacle vers le point au bout du vecteur ahead
      let force = p5.Vector.sub(
        pointLePlusProcheDeObstacle,
        obstacleLePlusProche.pos
      );

      // Dessous c'est l'ETAPE 2 : le pilotage (comment on se dirige vers la cible)
      // on limite ce vecteur à la longueur maxSpeed
      // force est la vitesse désirée
      force.setMag(entity.maxSpeed);
      // on calcule la force à appliquer pour atteindre la cible avec la formule
      // que vous commencez à connaitre : force = vitesse désirée - vitesse courante
      force.sub(entity.vel);
      // on limite cette force à la longueur maxForce
      force.limit(entity.maxForce);

      if (alerteRougeVaisseauDansObstacle) {
        return force.setMag(entity.maxForce * 2);
      } else {
        return force;
      }
    } else {
      // pas de collision possible
      return createVector(0, 0);
    }
  }

  draw() {}

  drawDebug(entity) {}

  UIdisplay(parentElement) {
    const behaviorDiv = document.createElement("div");

    const createSlider = (labelText, min, max, step, value, onChange) => {
      const container = document.createElement("div");
      container.className = "range-slider";

      const boxMinMax = document.createElement("div");
      boxMinMax.className = "box-minmax";

      const label = document.createElement("span");
      label.textContent = `${labelText} (${min} - ${max}) `;

      const valueSpan = document.createElement("span");
      valueSpan.textContent = value;

      const slider = document.createElement("input");
      slider.type = "range";
      slider.min = min;
      slider.max = max;
      slider.step = step;
      slider.value = value;
      slider.className = "rs-range";

      const valueLabel = document.createElement("span");
      valueLabel.className = "rs-label";
      valueLabel.textContent = value;

      slider.addEventListener("input", (e) => {
        const newValue = parseFloat(e.target.value);
        valueSpan.textContent = newValue;
        valueLabel.textContent = newValue;
        onChange(e);
      });

      boxMinMax.appendChild(label);
      boxMinMax.appendChild(valueSpan);

      container.appendChild(boxMinMax);
      container.appendChild(slider);
      container.appendChild(valueLabel);

      return container;
    };

    behaviorDiv.appendChild(
      createSlider(
        "Largeur Zone Évitement:",
        0,
        100,
        1,
        this.largeurZoneEvitementDevantVaisseau,
        (e) => {
          this.largeurZoneEvitementDevantVaisseau = parseFloat(e.target.value);
        }
      )
    );

    behaviorDiv.appendChild(
      createSlider("Magnitude:", 0, 10, 0.1, this.magnitude, (e) => {
        this.magnitude = parseFloat(e.target.value);
      })
    );

    const debugButton = document.createElement("button");
    debugButton.textContent = "Activate Debug";
    debugButton.style.backgroundColor = "#4a90e2";
    debugButton.style.color = "white";

    debugButton.addEventListener("click", () => {
      this.debug = !this.debug;
      debugButton.textContent = this.debug
        ? "Deactivate Debug"
        : "Activate Debug";
      debugButton.style.backgroundColor = this.debug ? "#d62929" : "#4a90e2";
    });

    behaviorDiv.appendChild(debugButton);

    parentElement.appendChild(behaviorDiv);
  }
}

function getObstacleLePlusProche(entity) {
  let plusPetiteDistance = 100000000;
  let obstacleLePlusProche = undefined;

  obstacles.forEach((o) => {
    // Je calcule la distance entre le vaisseau et l'obstacle
    const distance = entity.pos.dist(o.pos);

    if (distance < plusPetiteDistance) {
      plusPetiteDistance = distance;
      obstacleLePlusProche = o;
    }
  });

  return obstacleLePlusProche;
}
