class Mouse {
  constructor() {
    this.pos = createVector(mouseX, mouseY);
  }

  update() {
    this.pos.set(mouseX, mouseY);
  }

  show() {
    // Example visualization if needed
    noStroke();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}
