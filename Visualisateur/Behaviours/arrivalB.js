class ArrivalB {
  constructor(target, distance = 100, slowdown = 0.2) {
    this.target = target;
    this.magnitude = 1;
    this.distance = distance;
    this.slowdown = slowdown;
    this.debug = false;
  }

  calculateForce(entity) {
    let force = p5.Vector.sub(this.target, entity.pos);
    let distance = force.mag();

    // Si l'entité est à moins de 'distance' de la cible, on commence à ralentir
    if (distance < this.distance) {
      let speed = entity.maxSpeed * (distance / this.distance) * this.slowdown;
      force.setMag(speed);
    } else {
      // Sinon, on continue à chercher normalement
      force.setMag(entity.maxSpeed);
    }

    force.sub(entity.vel);
    force.limit(entity.maxForce);
    return force;
  }

  draw() {
    // draw target
    ellipse(this.target.x, this.target.y, 10, 10);
  }

  drawDebug(entity) {
    // Draw the slowing down zone around the target
    stroke("red");
    noFill();
    ellipse(this.target.x, this.target.y, this.distance * 2);
  }

  UIdisplay(parentElement) {
    console.log("UI DISPLAY");
    const behaviorDiv = document.createElement("div");
    behaviorDiv.className = "container"; // Add container class to the main div

    const createSlider = (labelText, min, max, step, value, onChange) => {
      const container = document.createElement("div");
      container.className = "range-slider"; // Add range-slider class to each slider container

      const boxMinMax = document.createElement("div");
      boxMinMax.className = "box-minmax"; // Add box-minmax class to the min-max container

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
      slider.className = "rs-range"; // Add rs-range class to the slider

      const valueLabel = document.createElement("span");
      valueLabel.className = "rs-label";
      valueLabel.textContent = value;

      slider.addEventListener("input", (e) => {
        const newValue = parseFloat(e.target.value);
        valueSpan.textContent = newValue;
        valueLabel.textContent = newValue;
        console.log(`${labelText} value: ${newValue}`); // Log the title and new value
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
      createSlider("Distance:", 0, 500, 1, this.distance, (e) => {
        this.distance = parseFloat(e.target.value);
      })
    );

    behaviorDiv.appendChild(
      createSlider("Slowdown:", 0, 1, 0.01, this.slowdown, (e) => {
        this.slowdown = parseFloat(e.target.value);
      })
    );

    behaviorDiv.appendChild(
      createSlider("Magnitude:", 0, 1, 0.1, this.magnitude, (e) => {
        this.magnitude = parseFloat(e.target.value);
      })
    );

    const debugButton = document.createElement("button");
    debugButton.textContent = "Activate Debug";
    debugButton.style.backgroundColor = "#4a90e2"; // Blue background color
    debugButton.style.color = "white"; // White text color

    debugButton.addEventListener("click", () => {
      console.log("Debug mode" + this.debug);
      this.debug = !this.debug;
      debugButton.textContent = this.debug
        ? "Deactivate Debug"
        : "Activate Debug";
      if (this.debug) {
        debugButton.style.backgroundColor = "#d62929"; // Red background color
      } else {
        debugButton.style.backgroundColor = "#4a90e2"; // Blue background color
      }
    });

    behaviorDiv.appendChild(debugButton);

    parentElement.appendChild(behaviorDiv);
  }
}
