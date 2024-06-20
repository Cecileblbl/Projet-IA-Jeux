let obstacles = [];

class Obstacle {
  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }

  show() {
    fill(255);
    stroke(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
  }
}