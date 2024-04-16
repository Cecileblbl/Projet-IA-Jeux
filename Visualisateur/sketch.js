let button;
let select;
let vehicules = [];
let imgVaisseau;

function preload() {
  console.log("preload");
  imgVaisseau = loadImage("assets/images/vaisseau.png");
}

function setup() {
  createCanvas(500, 500); // Increase the canvas width to accommodate the side menus
  background(220);

  BManager = new BManager();

  for (let i = 0; i < 30; i++) {
    let x = random(width / 2); // Position aléatoire dans la moitié gauche du canevas
    let y = random(height); // Position aléatoire sur la hauteur du canevas
    let vehicule = new Vehicle(x, y, imgVaisseau);
    vehicules.push(vehicule);
  }

  //Wander behaviour on init
  Bkeeper.addB("wander");
  displayBs(Bkeeper.Bs);
}

function draw() {
  background(0, 0, 0, 100);
  vehicules.forEach((v) => {
    BManager.applyBs(v, Bkeeper.Bs);
    v.update();
    v.show();
  });
}
