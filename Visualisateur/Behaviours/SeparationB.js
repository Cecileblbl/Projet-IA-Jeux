class SeparationB {
  constructor() {
    this.largeurZoneEvitementDevantVaisseau = 10;
    this.magnitude = 1;
  }

  calculateForce(entity) {
    // Detection du véhicule le plus proche
    let vehicleLePlusProche = getVehicleLePlusProche(entity);

    // Si pas de véhicule, on renvoie un vecteur nul
    if (vehicleLePlusProche === undefined) {
      return createVector(0, 0);
    }

    // On calcule la distance entre le centre du véhicule
    // et le bout du vecteur ahead (entity.distanceAhead)
    let ahead = entity.vel.copy().mult(entity.distanceAhead);
    let pointAuBoutDeAhead = p5.Vector.add(entity.pos, ahead);
    let distance = vehicleLePlusProche.pos.dist(pointAuBoutDeAhead);

    // Si la distance est < rayon du véhicule + largeur de zone d'évitement
    // on calcule la force d'évitement
    if (
      distance <
      vehicleLePlusProche.r + entity.largeurZoneEvitementDevantVaisseau
    ) {
      // Calcul de la force d'évitement
      let force = p5.Vector.sub(pointAuBoutDeAhead, vehicleLePlusProche.pos);
      force.setMag(entity.maxSpeed);
      force.sub(entity.vel);
      force.limit(entity.maxForce);

      return force;
    } else {
      // Pas de collision possible
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

    parentElement.appendChild(behaviorDiv);
  }
}

function getVehicleLePlusProche(entity) {
  let plusPetiteDistance = 100000000;
  let vehicleLePlusProche = undefined;

  vehicules.forEach((v) => {
    const distance = entity.pos.dist(v.pos);

    if (distance < plusPetiteDistance && v !== entity) {
      plusPetiteDistance = distance;
      vehicleLePlusProche = v;
    }
  });

  return vehicleLePlusProche;
}
