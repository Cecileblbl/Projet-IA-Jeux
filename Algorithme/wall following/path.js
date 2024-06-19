
class Path {
    constructor() {
      // Arbitrary radius of 20
      // A path has a radius, i.e how far is it ok for the boid to wander off
      this.radius  = 20 ;
      // A Path is an arraylist of points (PVector objects)
      this.points = [];
    }
  
    // Add a point to the path
    addPoint(x, y) {
      let point = createVector(x, y);
      this.points.push(point);
    }
    // Draw the path
    display() {
      strokeJoin(ROUND);
  
      // Draw thick line for radius
      stroke(20);
      strokeWeight(this.radius/4);
      noFill();
      beginShape();
      for (let v of this.points) {
        vertex(v.x, v.y);
      }
      endShape(CLOSE);


    }

  }
  