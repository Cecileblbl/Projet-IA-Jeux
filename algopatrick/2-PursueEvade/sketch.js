let pursuer;
let target;
let sliderVitesseMaxCible;
let sliderDistancePrediction;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pursuer = new Vehicle(random(width), random(height));
  target = new Target(random(width), random(height));
  target.maxSpeed = 6;
  target.maxForce = 0.1

  pursuer.maxSpeed = 6;
  pursuer.maxForce = 0.2
  

  // min max value step
  sliderDistancePrediction = createSlider(2, 50, 10, 1);

}

function draw() {
  background(0);
  let forcePoursuite = pursuer.pursue(target);
  pursuer.applyForce(forcePoursuite);

  if ((frameCount % 300) < 200) {
    // pendant les 100 premières images
    // pursuer = le véhicule poursuiveur, il vise un point devant la cible
    let forceEvade = target.evade(pursuer);
    target.applyForce(forceEvade);
  } else {
    // ils ralentissent et se reposent...
    //pursuer.vel.mult(0.99);
    // Cat tired! Cat and mouse slow down
    pursuer.applyForce( pursuer.vel.copy().mult(-0.01) )
    target.applyForce( target.vel.copy().mult(-0.01) )
  }

  // déplacement et dessin du véhicule et de la target
  pursuer.update();
  pursuer.edges();
  pursuer.show();

  // lorsque la target atteint un bord du canvas elle ré-apparait de l'autre côté

  //target.distancePrediction = sliderDistancePrediction.value();
  target.edges();
  target.update();



  //let angle = target.vel.heading();
  //angle += random(-0.1, 0.1);
  //target.vel.setHeading(angle);
  //target.vel.setMag(20);  

  target.show();
}
