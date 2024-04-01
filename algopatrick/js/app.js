let cols, rows;
let scl = 20;
let w = 700;
let h = 500;

let terrain = [];
let startPoint = null;
let endPoint = null;
let path = [];
let snake = []; // Chenille
let snakeIndex = 0; // Indice de progression de la chenille sur le chemin
let step = 0.1; // Pas de progression de la chenille (plus petit = plus lent)
let drawPath = false; // Indique si le chemin doit être affiché
let eraseIndex = 0; // Indice de début de la partie du chemin déjà parcourue

function setup() {
  createCanvas(800, 600);
  cols = w / scl;
  rows = h / scl;

  for (let x = 0; x < cols; x++) {
    terrain[x] = [];
    for (let y = 0; y < rows; y++) {
      terrain[x][y] = floor(random(100)); // Générer des valeurs entre 0 et 99
    }
  }

  // Appeler la fonction pour sélectionner les points
  selectPoints();
}

function draw() {
  background(255);

  // Dessiner le terrain
  for (let y = 0; y < rows - 1; y++) {
    for (let x = 0; x < cols - 1; x++) {
      // Dessiner un rectangle pour chaque cellule du terrain
      let x1 = x * scl;
      let x2 = (x + 1) * scl;
      let y1 = y * scl;
      let y2 = (y + 1) * scl;
      fill(terrain[x][y]);
      noStroke();
      rect(x1, y1, scl, scl);

      // Afficher le coût à côté de la case
      fill(0);
      textAlign(CENTER, CENTER);
      text(terrain[x][y], x1 + scl / 2, y1 + scl / 2);
    }
  }

  // Dessiner le point de départ en rouge
  if (startPoint) {
    fill(255, 0, 0);
    ellipse(startPoint.x, startPoint.y, 10, 10);
  }

  // Dessiner le point d'arrivée en bleu
  if (endPoint) {
    fill(0, 0, 255);
    ellipse(endPoint.x, endPoint.y, 10, 10);
  }

  // Tracer le chemin si nécessaire
  if (drawPath) {
    stroke(255, 0, 255);
    strokeWeight(4);
    noFill();
    beginShape();
    for (let i = 0; i < path.length; i++) { // Commencer le tracé du chemin dès le début
      let x = path[i][0] * scl + scl / 2;
      let y = path[i][1] * scl + scl / 2;
      vertex(x, y);
    }
    endShape();
    drawSnake(); // Dessiner la chenille
    if (snakeIndex < path.length) {
      snakeIndex += step;
    } else {
      drawPath = false;
    }
  }
}


function selectPoints() {
  // Fonction pour sélectionner les points en cliquant sur le canevas
  mousePressed = () => {
    let x = mouseX;
    let y = mouseY;

    // Convertir les coordonnées du canevas en coordonnées de terrain
    let terrainX = floor(x / scl);
    let terrainY = floor(y / scl);

    // Vérifier si les points sont dans les limites du terrain
    if (terrainX >= 0 && terrainX < cols && terrainY >= 0 && terrainY < rows) {
      // Afficher les coordonnées
      console.log("Coordonnées de la case sélectionnée : (" + terrainX + ", " + terrainY + ")");

      // Colorier la case sélectionnée
      fill(255, 0, 0); // Rouge
      rect(terrainX * scl, terrainY * scl, scl, scl);

      // Si startPoint n'est pas encore sélectionné, le définir
      if (!startPoint) {
        startPoint = createVector(terrainX * scl + scl / 2, terrainY * scl + scl / 2);
      }
      // Sinon, si endPoint n'est pas encore sélectionné, le définir
      else if (!endPoint) {
        endPoint = createVector(terrainX * scl + scl / 2, terrainY * scl + scl / 2);

        // Calculer le chemin avec A*
        path = A_star(terrain, [floor(startPoint.x / scl), floor(startPoint.y / scl)], [floor(endPoint.x / scl), floor(endPoint.y / scl)]);
        // Activer le dessin du chemin
        drawPath = true;
      }
    }
  };
}

function drawSnake() {
  // Ajouter un nouveau point à la chenille
  if (snakeIndex < path.length) {
    let x = path[floor(snakeIndex)][0] * scl + scl / 2;
    let y = path[floor(snakeIndex)][1] * scl + scl / 2;

    // Dessiner un cercle à la position actuelle de la chenille
    fill(0, 255, 0); // Vert
    ellipse(x, y, 10, 10); // Réduire la taille du cercle

    // Mettre à jour l'indice de progression de la chenille
    snakeIndex += step;
  } else {
    // Une fois que la chenille a terminé de parcourir le chemin, afficher le coût total dans la console
    let totalCost = 0;
    for (let i = 0; i < path.length - 1; i++) {
      totalCost += dist(path[i][0] * scl, path[i][1] * scl, path[i + 1][0] * scl, path[i + 1][1] * scl);
    }
    console.log("Coût total du chemin : " + totalCost);
  }
}



function A_star(G, depart, arrivee) {
  let sommets_possibles = [];
  enfiler(sommets_possibles, [0, depart, null]);
  let dict_predecesseur = {};

  while (sommets_possibles.length > 0) {
    let [distance, sommet, predecesseur] = defiler(sommets_possibles);

    if (sommet in dict_predecesseur) {
      continue;
    }

    dict_predecesseur[sommet] = predecesseur;

    if (sommet[0] === arrivee[0] && sommet[1] === arrivee[1]) {
      let chemin = [];
      while (sommet) {
        chemin.push(sommet);
        sommet = dict_predecesseur[sommet];
      }
      return chemin.reverse();
    }

    let voisins = indice_voisin(G, sommet);

    for (let voisin of voisins) {
      let [distance_candidat, candidat] = voisin;

      if (candidat in dict_predecesseur) {
        continue;
      }

      enfiler(
        sommets_possibles,
        [
          distance + distance_candidat + dist(candidat[0], candidat[1], arrivee[0], arrivee[1]),
          candidat,
          sommet
        ]
      );
    }
  }

  return [];
}

function enfiler(queue, element) {
  queue.push(element);
  queue.sort((a, b) => a[0] - b[0]);
}

function defiler(queue) {
  return queue.shift();
}

function indice_voisin(G, sommet) {
  let x = sommet[0];
  let y = sommet[1];
  let voisins = [];

  // Ajouter les voisins dans les quatre directions (haut, bas, gauche, droite)
  if (x > 0) {
    voisins.push([G[x - 1][y], [x - 1, y]]);
  }
  if (x < G.length - 1) {
    voisins.push([G[x + 1][y], [x + 1, y]]);
  }
  if (y > 0) {
    voisins.push([G[x][y - 1], [x, y - 1]]);
  }
  if (y < G[0].length - 1) {
    voisins.push([G[x][y + 1], [x, y + 1]]);
  }

  return voisins;
}
