class Wall {
  constructor(x, y, w, h) {
    this.pos = createVector(x, y);
    this.width = w;
    this.height = h;
    this.color = color(155);
  }

  show() {
    push();
    fill(this.color);
    stroke(0);
    strokeWeight(3);
    rect(this.pos.x, this.pos.y, this.width, this.height);
    fill(0);
    ellipse(this.pos.x, this.pos.y, 10);
    pop();
  }
}
