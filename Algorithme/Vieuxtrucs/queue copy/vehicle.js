class Vehicle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 2;
    this.maxForce = 0.2;
    this.r = 16;
    this.reached = false;
  }

  seek(target) {
    this.targetPos = target; // Save the target position
    let desired = p5.Vector.sub(target, this.pos);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.applyForce(steer);
    circle(target.x, target.y, 10);
    line(this.pos.x, this.pos.y, target.x, target.y);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    let d = p5.Vector.dist(this.pos, this.targetPos);
    if (d < this.r) {
      // If the vehicle is close enough to the target position
      this.vel.set(0, 0); // Set the velocity to zero
    } else {
      this.vel.add(this.acc);
      this.vel.limit(this.maxSpeed);
      this.pos.add(this.vel);
      this.acc.set(0, 0);
    }
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, 100);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  edges() {
    if (this.pos.x > width + this.r) {
      this.pos.x = -this.r;
    } else if (this.pos.x < -this.r) {
      this.pos.x = width + this.r;
    }
    if (this.pos.y > height + this.r) {
      this.pos.y = -this.r;
    } else if (this.pos.y < -this.r) {
      this.pos.y = height + this.r;
    }
  }
}
