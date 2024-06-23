class Character {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(2, 2);
    this.acceleration = createVector(0, 0);
    this.maxSpeed = 3;
    this.maxForce = 0.1;
  }
  
  followWall(walls) {
    let predict = this.velocity.copy();
    predict.setMag(25); // Predict 25 pixels ahead
    let predictLoc = p5.Vector.add(this.position, predict);
    
    let closestWall = null;
    let recordDist = Infinity;
    let closestPoint = null;
    
    for (let wall of walls) {
      let a = wall.start;
      let b = wall.end;
      let normalPoint = getNormalPoint(predictLoc, a, b);
      
      // Ensure the normal point is on the segment
      if (normalPoint.x < min(a.x, b.x) || normalPoint.x > max(a.x, b.x) ||
          normalPoint.y < min(a.y, b.y) || normalPoint.y > max(a.y, b.y)) {
        normalPoint = b.copy();
      }
      
      let distance = p5.Vector.dist(predictLoc, normalPoint);
      if (distance < recordDist) {
        recordDist = distance;
        closestWall = wall;
        closestPoint = normalPoint;
      }
    }
    
    if (closestWall) {
      let dir = p5.Vector.sub(closestWall.end, closestWall.start).normalize(); 
      let perp = createVector(-dir.y, dir.x); 
      perp.setMag(wallFollowDistance); 
      let target = p5.Vector.add(closestPoint, perp); 
      this.seek(target);
      
      // DEBUG: Draw the perp vector
      if (debugMode) {
        stroke(0, 255, 0); // Green color for perp vector
        line(closestPoint.x, closestPoint.y,
             closestPoint.x + perp.x,
             closestPoint.y + perp.y);
      }
    }
  }
  
  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }
  
  show() {
    fill(127);
    stroke(0);
    strokeWeight(1);
    ellipse(this.position.x, this.position.y, 32, 32);
  }
  
  drawVectors() {
    // Draw velocity vector
    stroke(255, 0, 0); // Red color for velocity vector
    line(this.position.x, this.position.y, 
         this.position.x + this.velocity.x * 10, 
         this.position.y + this.velocity.y * 10);
    
    // Draw acceleration vector
    stroke(0, 0, 255); // Blue color for acceleration vector
    line(this.position.x, this.position.y, 
         this.position.x + this.acceleration.x * 100, 
         this.position.y + this.acceleration.y * 100);
  }
}
function getNormalPoint(p, a, b) {
  let ap = p5.Vector.sub(p, a);
  let ab = p5.Vector.sub(b, a);
  ab.setMag(ap.dot(ab) / ab.mag());
  let normalPoint = p5.Vector.add(a, ab);
  return normalPoint;
}