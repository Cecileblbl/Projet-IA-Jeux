class Wall {
  constructor(x1, y1, x2, y2) {
    this.start = createVector(x1, y1);
    this.end = createVector(x2, y2);
    this.color = color(155);
  }

  show() {
    push();
    stroke(this.color);
    strokeWeight(3);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
    pop();
  }
}
