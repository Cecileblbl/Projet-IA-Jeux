let cols = 15;
let rows = 15;
let cellSize = 20;
let grid = [];
let entrance;
let exit;
let vehicle;

function setup() {
  createCanvas(cols * cellSize, rows * cellSize);
  // Initialisation de la grille avec des cellules normales
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      let cell = new Cell(i, j);
      grid.push(cell);
    }
  }
  // Création de l'entrée et de la sortie du labyrinthe
  entrance = grid[0]; // Coin supérieur gauche
  exit = grid[cols * rows - 1]; // Coin inférieur droit
  entrance.walls = [false, true, true, false]; // Supprime les murs à gauche et en bas
  exit.walls = [true, false, false, true]; // Supprime les murs à droite et en haut
  // Création du labyrinthe
  createMaze();
  // Création du véhicule
  vehicle = new Vehicle(0, 0);
}

function draw() {
  background(220);
  // Affichage du labyrinthe
  for (let cell of grid) {
    cell.show();
  }
  // Déplacement et affichage du véhicule
  vehicle.move(grid);
  vehicle.show();
}

// Fonction pour créer le labyrinthe
function createMaze() {
  let stack = [];
  let current = grid[0];
  current.visited = true;
  while (true) {
    let next = current.checkNeighbors();
    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      break;
    }
  }
}

// Fonction pour enlever les murs entre deux cellules
function removeWalls(a, b) {
  let x = a.i - b.i;
  if (x === 1) {
    a.walls[3] = false;
    b.walls[1] = false;
  } else if (x === -1) {
    a.walls[1] = false;
    b.walls[3] = false;
  }
  let y = a.j - b.j;
  if (y === 1) {
    a.walls[0] = false;
    b.walls[2] = false;
  } else if (y === -1) {
    a.walls[2] = false;
    b.walls[0] = false;
  }
}

// Classe représentant une cellule du labyrinthe
class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    // Mur du haut, droite, bas, gauche
    this.walls = [true, true, true, true];
  }

  // Renvoie l'index de la cellule dans le tableau grid
  index(i, j) {
    if (i < 0 || j < 0 || i >= cols || j >= rows) {
      return -1;
    }
    return i + j * cols;
  }

  // Renvoie les voisins non visités de la cellule
  checkNeighbors() {
    let neighbors = [];
    let top = grid[this.index(this.i, this.j - 1)];
    let right = grid[this.index(this.i + 1, this.j)];
    let bottom = grid[this.index(this.i, this.j + 1)];
    let left = grid[this.index(this.i - 1, this.j)];
    if (top && !top.visited) {
      neighbors.push(top);
    }
    if (right && !right.visited) {
      neighbors.push(right);
    }
    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }
    if (left && !left.visited) {
      neighbors.push(left);
    }
    if (neighbors.length > 0) {
      let r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  }

  // Affiche la cellule et ses murs
  show() {
    let x = this.i * cellSize;
    let y = this.j * cellSize;
    stroke(0);
    if (this.walls[0]) {
      line(x, y, x + cellSize, y);
    }
    if (this.walls[1]) {
      line(x + cellSize, y, x + cellSize, y + cellSize);
    }
    if (this.walls[2]) {
      line(x + cellSize, y + cellSize, x, y + cellSize);
    }
    if (this.walls[3]) {
      line(x, y + cellSize, x, y);
    }
    // Couleur de l'entrée et de la sortie
    fill(0, 255, 0); // Vert
    // Dessiner l'entrée
    if (this === entrance) {
      rect(x, y, cellSize, cellSize);
    }
    // Dessiner la sortie
    fill(255, 0, 0); // Rouge
    if (this === exit) {
      rect(x, y, cellSize, cellSize);
    }
  }
}

// Classe représentant le véhicule
// Classe représentant le véhicule
class Vehicle {
  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.direction = 1; // Initialisation de la direction (1 pour la droite)
     this.visited = false;
  }

  move(grid) {
    let currentCell = grid[this.i + this.j * cols];

    // Avancer dans la direction actuelle
    switch (this.direction) {
      case 0: // Haut
        if (!currentCell.walls[0]) {
          this.j--;
        } else if (!currentCell.walls[3]) { // Tourner à gauche si possible
          this.direction = 3; // Gauche
        } else {
          this.direction = (this.direction + 1) % 4; // Tourner à droite
        }
        break;
      case 1: // Droite
        if (!currentCell.walls[1]) {
          this.i++;
        } else if (!currentCell.walls[0]) { // Tourner à gauche si possible
          this.direction = 0; // Haut
        } else {
          this.direction = (this.direction + 1) % 4; // Tourner à droite
        }
        break;
      case 2: // Bas
        if (!currentCell.walls[2]) {
          this.j++;
        } else if (!currentCell.walls[1]) { // Tourner à gauche si possible
          this.direction = 1; // Droite
        } else {
          this.direction = (this.direction + 1) % 4; // Tourner à droite
        }
        break;
      case 3: // Gauche
        if (!currentCell.walls[3]) {
          this.i--;
        } else if (!currentCell.walls[2]) { // Tourner à gauche si possible
          this.direction = 2; // Bas
        } else {
          this.direction = (this.direction + 1) % 4; // Tourner à droite
        }
        break;
    }
  }

  show() {
    let x = this.i * cellSize;
    let y = this.j * cellSize;
    fill(0, 0, 255); // Bleu pour le véhicule
    rect(x, y, cellSize, cellSize);
  }
}
