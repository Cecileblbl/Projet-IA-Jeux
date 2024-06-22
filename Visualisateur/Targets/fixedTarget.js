class fixedTarget {
  constructor() {
    this.pos = createVector(width / 2, height / 2);
  }

  updateX(x) {
    this.pos.x = x;
  }

  updateY(y) {
    this.pos.y = y;
  }

  show() {
    noStroke();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}
