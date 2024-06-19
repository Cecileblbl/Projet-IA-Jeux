let queue = []; // File d'attente
let canvasWidth = 1000;
let canvasHeight = 400;
let clientSize = 40; // Taille des clients
let checkoutSize = 60; // Taille du caissier
let spacing = 20; // Espacement entre les clients
let speed = 1; // Vitesse de défilement
let checkoutTime = 5; // Temps d'arrêt devant le caissier en secondes
let isCheckingOut = false; // Indique si un client est en train de passer à la caisse
let startTime; // Heure de début du passage à la caisse

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  
  // Créer un agent caissier
  let checkoutAgent = new Agent(canvasWidth - checkoutSize - 10, canvasHeight / 2 - checkoutSize / 2, checkoutSize);
  checkoutAgent.isCheckout = true;
  queue.push(checkoutAgent);
  
  // Enfiler des clients dans la file d'attente
  enqueue("Client 1");
  enqueue("Client 2");
  enqueue("Client 3");
}

function draw() {
  background(220);
  
  // Afficher les clients dans la file d'attente
  for (let i = 0; i < queue.length; i++) {
    queue[i].display();
  }
  
  // Vérifier si un client est en train de passer à la caisse
  if (isCheckingOut) {
    let elapsedTime = (millis() - startTime) / 1000; // Temps écoulé en secondes
    if (elapsedTime >= checkoutTime) {
      isCheckingOut = false;
      dequeue(); // Retirer le client de la file d'attente après l'arrêt à la caisse
    }
  }
  
  // Déplacer la file d'attente vers la gauche
  if (!isCheckingOut && frameCount % 60 === 0) {
    moveQueue();
    if (!isEmpty()) {
      isCheckingOut = true;
      startTime = millis();
    }
  }
}

class Agent {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = random(0.5, 2); // Vitesse aléatoire
    this.isCheckout = false; // Indique si l'agent est le caissier
  }

  move() {
    this.x -= this.speed;
  }

  display() {
    fill(255);
    stroke(0);
    rect(this.x, this.y, this.size, this.size);
    textAlign(CENTER, CENTER);
    fill(0);
    noStroke();
    if (this.isCheckout) {
      text("Caissier", this.x + this.size / 2, this.y + this.size / 2);
    } else {
      text("Client", this.x + this.size / 2, this.y + this.size / 2);
    }
  }
}

// Fonction pour enfiler un élément dans la file d'attente
function enqueue(item) {
  let x = (clientSize + spacing) * queue.length;
  let y = canvasHeight / 2 - clientSize / 2;
  let agent = new Agent(x, y, clientSize);
  queue.push(agent);
}

// Fonction pour défiler un élément de la file d'attente
function dequeue() {
  if (!isEmpty()) {
    return queue.shift();
  } else {
    console.log("La file d'attente est vide.");
    return null;
  }
}

// Fonction pour vérifier si la file d'attente est vide
function isEmpty() {
  return queue.length === 0;
}

// Fonction pour déplacer la file d'attente vers la gauche
function moveQueue() {
  for (let i = 0; i < queue.length; i++) {
    queue[i].move();
    if (queue[i].x + queue[i].size < 0) {
      // Supprimer les clients qui sortent de l'écran
      queue.splice(i, 1);
    }
  }
}
