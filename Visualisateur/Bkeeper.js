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
      this.Bs.push(new ArrivalB(new fixedTarget()));
    }
    if (B === "flee") {
      this.Bs.push(new FleeB(new Target((width / 2, height / 2))));
    }
    if (B === "wander") {
      this.Bs.push(new WanderB());
    }
    if (B === "obstacleAvoidance") {
      this.Bs.push(new ObstacleAvoidanceB());
    }
    if (B === "Bordures") {
      this.Bs.push(new Bordures());
    }
    if (B === "evade") {
      this.Bs.push(new EvadeB(new Target((width / 2, height / 2))));
    }
    if (B === "pursue") {
      this.Bs.push(new PursueB(new Target((width / 2, height / 2))));
    }
    console.log(this.Bs);
  }

  removeB(B) {
    // Remove the selected B from the vehicle
    const index = this.Bs.indexOf(B);
    this.Bs.splice(index, 1);
  }
}
