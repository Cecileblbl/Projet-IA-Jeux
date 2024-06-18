class BManager {
  constructor() {}

  applyBs(vehicle, Bs) {
    // Apply all Bs to the vehicle
    for (let i = 0; i < Bs.length; i++) {
      const force = Bs[i].calculateForce(vehicle);
      //limit force by magnitude
      if (Bs[i].magnitude) {
        force.mult(Bs[i].magnitude);
      }
      vehicle.applyForce(force);

      Bs[i].draw();
    }
  }
}
