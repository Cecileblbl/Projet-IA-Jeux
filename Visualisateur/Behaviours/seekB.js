class SeekB {
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

    // Step 1: Calculate the direction towards the target
    let force = p5.Vector.sub(this.target.pos, entity.pos);

    // Step 2: Limit the vector to maximum speed
    force.setMag(entity.maxSpeed);

    // Step 3: Calculate the desired velocity
    let desired = p5.Vector.sub(force, entity.vel);

    // Step 4: Limit the force to maximum force
    desired.limit(entity.maxForce);

    return desired;
  }

  draw() {
    // Draw the target position
    fill("blue");
    ellipse(this.target.pos.x, this.target.pos.y, 10, 10);
  }

  drawDebug(entity) {
    // Step 1: Calculate the direction towards the target
    let force = p5.Vector.sub(this.target.pos, entity.pos);

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

    // Draw a circle around the target position for visualization
    noFill();
    stroke(0, 0, 255, 100); // Semi-transparent blue
    ellipse(this.target.x, this.target.y, 20, 20);
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
    // No additional UI updates needed for Seek behavior
    // Since Seek behavior does not have additional parameters to adjust
  }
}
