class Road {
  constructor() {
    this.segments = [];
    this.numSegments = 20;
    this.radiusX = width / 3; // Radius of the road loop in the x direction
    this.radiusY = height / 3; // Radius of the road loop in the y direction
    this.roadWidth = 40; // Width of the road

    // Generate loop segments
    for (let i = 0; i < this.numSegments; i++) {
      let angle = map(i, 0, this.numSegments, 0, TWO_PI); // Calculate angle for this segment

      // Calculate x and y position along an oval
      let x = width / 2 + this.radiusX * cos(angle);
      let y = height / 2 + this.radiusY * sin(angle);

      let left = createVector(x - normal.x, y - normal.y);
      let right = createVector(x + normal.x, y + normal.y);

      // Store the road bounds in the segment
      this.segments[i] = { x, y, angle, left, right }; // Change this line
    }
  }

  draw() {
    stroke(255); // Set the color of the road bounds
    strokeWeight(2); // Set the thickness of the road bounds

    // Draw the left and right bounds of the road
    for (let i = 0; i < this.numSegments; i++) {
      let current = this.segments[i];
      let next = this.segments[(i + 1) % this.numSegments];

      // Draw the left bound of the road segment
      line(
        current.x - normal.x,
        current.y - normal.y,
        next.x - normal.x,
        next.y - normal.y
      );

      // Draw the right bound of the road segment
      line(
        current.x + normal.x,
        current.y + normal.y,
        next.x + normal.x,
        next.y + normal.y
      );
    }
  }
}
