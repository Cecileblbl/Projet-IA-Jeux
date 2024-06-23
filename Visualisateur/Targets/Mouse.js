class Mouse {
  constructor() {
    this.pos = createVector(mouseX, mouseY);
    this.prevPos = this.pos.copy();
    this.vel = createVector(0, 0);
  }

  update() {
    this.prevPos.set(this.pos);
    this.pos.set(mouseX, mouseY);
    this.vel = p5.Vector.sub(this.pos, this.prevPos);
  }

  show() {
    noStroke();
    fill(255, 0, 0);
    ellipse(this.pos.x, this.pos.y, 10, 10);
  }
}
