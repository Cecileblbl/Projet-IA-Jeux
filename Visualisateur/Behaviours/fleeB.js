class FleeB {
  constructor(target) {
    this.target = target;
    this.magnitude = 1;
    this.debug = false;
    this.targetType = "fixed"; // Default target type is fixed
  }

  calculateForce(entity) {
    if (this.targetType !== "fixed") {
      this.target.update();
    }

    let force = p5.Vector.sub(entity.pos, this.target.pos);
    force.setMag(entity.maxSpeed);
    force.sub(entity.vel);
    force.limit(entity.maxForce);

    return force;
  }

  draw() {
    fill("blue");
    ellipse(this.target.pos.x, this.target.pos.y, 10, 10);
  }

  drawDebug(entity) {
    stroke(255, 0, 0);
    line(this.target.pos.x, this.target.pos.y, entity.pos.x, entity.pos.y);

    noFill();
    stroke(255, 0, 0, 100);
    ellipse(this.target.pos.x, this.target.pos.y, 20);

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

  UIdisplay(parentElement) {
    const behaviorDiv = document.createElement("div");

    const targetTypeSelect = document.createElement("select");
    targetTypeSelect.innerHTML = `
      <option value="fixed">Fixed</option>
      <option value="wandering">Wandering</option>
      <option value="mouse">Mouse</option>
    `;
    targetTypeSelect.addEventListener("change", (e) => {
      this.targetType = e.target.value;
      this.updateTarget();
      this.updateUI(behaviorDiv);
    });

    behaviorDiv.appendChild(targetTypeSelect);

    this.updateUI(behaviorDiv);

    behaviorDiv.className = "container";

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
      createSlider("Magnitude:", 0, 1, 0.1, this.magnitude, (e) => {
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

  updateTarget() {
    if (this.targetType === "fixed") {
      this.target = new fixedTarget();
    } else if (this.targetType === "wandering") {
      this.target = new Target(random(width), random(height));
    } else if (this.targetType === "mouse") {
      this.target = new Mouse();
    }
  }

  updateUI(behaviorDiv) {
    const existingXInput = document.querySelector("#targetPositionXInput");
    const existingYInput = document.querySelector("#targetPositionYInput");
    if (existingXInput) existingXInput.remove();
    if (existingYInput) existingYInput.remove();

    if (this.targetType === "fixed") {
      const targetPositionXInput = document.createElement("input");
      targetPositionXInput.type = "number";
      targetPositionXInput.value = this.target.pos.x;
      targetPositionXInput.id = "targetPositionXInput";
      targetPositionXInput.addEventListener("input", (e) => {
        this.target.updateX(parseFloat(e.target.value));
      });
      behaviorDiv.appendChild(targetPositionXInput);

      const targetPositionYInput = document.createElement("input");
      targetPositionYInput.type = "number";
      targetPositionYInput.value = this.target.pos.y;
      targetPositionYInput.id = "targetPositionYInput";
      targetPositionYInput.addEventListener("input", (e) => {
        this.target.updateY(parseFloat(e.target.value));
      });
      behaviorDiv.appendChild(targetPositionYInput);
    }
  }
}
