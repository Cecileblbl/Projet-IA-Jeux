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
        "Distance Cercle Wander:",
        0,
        100,
        1,
        this.distanceCercleWander,
        (e) => {
          this.distanceCercleWander = parseFloat(e.target.value);
        }
      )
    );

    behaviorDiv.appendChild(
      createSlider("Wander Radius:", 0, 100, 1, this.wanderRadius, (e) => {
        this.wanderRadius = parseFloat(e.target.value);
      })
    );

    behaviorDiv.appendChild(
      createSlider("Displace Range:", 0, PI, 0.01, this.displaceRange, (e) => {
        this.displaceRange = parseFloat(e.target.value);
      })
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
