class Bkeeper {
  constructor() {
    this.Bs = [];
  }

  addB(B) {
    // Add the selected B to the vehicle
    if (B === "seek") {
      this.Bs.push(new SeekB(createVector(width / 2, height / 2)));
    }
    if (B === "arrival") {
      this.Bs.push(new ArrivalB(createVector(width / 2, height / 2)));
    }
    if (B === "flee") {
      this.Bs.push(new FleeB(createVector(width / 2, height / 2)));
    }
    if (B === "wander") {
      this.Bs.push(new WanderB());
    }
    if (B === "obstacleAvoidance") {
      this.Bs.push(new ObstacleAvoidanceB());
    }
    console.log(this.Bs);
  }

  removeB(B) {
    // Remove the selected B from the vehicle
    const index = this.Bs.indexOf(B);
    this.Bs.splice(index, 1);
  }
}
