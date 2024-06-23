class Bordures {
  // Constructor initializes the zone's position, dimensions, and a distance parameter
  constructor(x, y, width, height, bufferDistanceX, bufferDistanceY) {
    // Zone position (top-left corner)
    this.x = x || 0;
    this.y = y || 0;

    // Zone dimensions
    this.width = width || windowWidth || 0;
    this.height = height || windowHeight || 0;

    // Distance from canvas edges
    this.bufferDistanceX = bufferDistanceX || 0;
    this.bufferDistanceY = bufferDistanceY || 0;

    // Optional properties (not used in provided methods)
    this.magnitude = 1;
    this.debug = false;
  }

  // Update dimensions
  updateDimensions(width, height) {
    this.width = width;
    this.height = height;
  }

  // Calculates a force to steer an entity away from the zone boundaries
  calculateForce(entity) {
    // Determine the boundaries of the zone
    let leftEdge = this.x + this.bufferDistanceX;
    let rightEdge = this.x + this.width - this.bufferDistanceX;
    let topEdge = this.y + this.bufferDistanceY;
    let bottomEdge = this.y + this.height - this.bufferDistanceY;

    let desired = null;

    // Check proximity to each edge and adjust the desired velocity accordingly
    if (entity.pos.x < leftEdge) {
      desired = createVector(entity.maxSpeed, entity.vel.y);
    } else if (entity.pos.x > rightEdge) {
      desired = createVector(-entity.maxSpeed, entity.vel.y);
    }

    if (entity.pos.y < topEdge) {
      desired = createVector(entity.vel.x, entity.maxSpeed);
    } else if (entity.pos.y > bottomEdge) {
      desired = createVector(entity.vel.x, -entity.maxSpeed);
    }

    if (desired !== null) {
      // Calculate steering force to move entity towards desired velocity
      desired.normalize();
      desired.mult(entity.maxSpeed);
      const steer = p5.Vector.sub(desired, entity.vel);
      steer.limit(entity.maxForce);
      return steer;
    } else {
      // No steering force needed (entity is not near any boundaries)
      return createVector(0, 0);
    }
  }

  // Draws visual representation of the zone and its danger areas
  draw() {
    // Draw main zone boundary
    stroke("blue");
    noFill();
    rect(this.x, this.y, this.width, this.height);

    // Draw danger zones around each edge
    stroke("red");
    // Left danger zone
    line(
      this.x + this.bufferDistanceX,
      this.y,
      this.x + this.bufferDistanceX,
      this.y + this.height
    );
    // Right danger zone
    line(
      this.x + this.width - this.bufferDistanceX,
      this.y,
      this.x + this.width - this.bufferDistanceX,
      this.y + this.height
    );
    // Top danger zone
    line(
      this.x,
      this.y + this.bufferDistanceY,
      this.x + this.width,
      this.y + this.bufferDistanceY
    );
    // Bottom danger zone
    line(
      this.x,
      this.y + this.height - this.bufferDistanceY,
      this.x + this.width,
      this.y + this.height - this.bufferDistanceY
    );
  }

  // Placeholder for drawing debug information related to entities
  drawDebug(entity) {
    // To be implemented as needed
  }

  // Method to display UI controls for adjusting parameters
  UIdisplay(parentElement) {
    const behaviorDiv = document.createElement("div");
    behaviorDiv.className = "container";

    // Buffer distance X slider
    behaviorDiv.appendChild(
      createSlider(
        "Buffer Distance X:",
        0,
        this.width / 2,
        1,
        this.bufferDistanceX,
        (e) => {
          this.bufferDistanceX = parseFloat(e.target.value);
        }
      )
    );

    // Buffer distance Y slider
    behaviorDiv.appendChild(
      createSlider(
        "Buffer Distance Y:",
        0,
        this.height / 2,
        1,
        this.bufferDistanceY,
        (e) => {
          this.bufferDistanceY = parseFloat(e.target.value);
        }
      )
    );

    behaviorDiv.appendChild(
      createSlider("Magnitude:", 0, 1, 0.1, this.magnitude, (e) => {
        this.magnitude = parseFloat(e.target.value);
      })
    );

    parentElement.appendChild(behaviorDiv);

    // Helper function to create a slider element
    function createSlider(labelText, min, max, step, value, onChange) {
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
    }
  }
}
