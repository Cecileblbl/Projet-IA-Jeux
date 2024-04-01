let grid = [];
let w = 70;
let img;

function preload() {
  img = loadSVG("simplemaze.svg"); // charge l'image
}

// la fonction setup est appelée une fois au démarrage du programme par p5.js
function setup() {
  createCanvas(windowWidth, windowHeight);
  shape(img, 0, 0, windowWidth, windowHeight);

  // let jsonString =
  //   // '[{"i":0,"j":0,"walls":[true,true,false,true],"visited":true},{"i":1,"j":0,"walls":[true,false,true,true],"visited":true},{"i":2,"j":0,"walls":[true,false,false,false],"visited":true},{"i":3,"j":0,"walls":[true,false,true,false],"visited":true},{"i":4,"j":0,"walls":[true,false,true,false],"visited":true},{"i":5,"j":0,"walls":[true,true,false,false],"visited":true},{"i":6,"j":0,"walls":[true,false,false,true],"visited":true},{"i":7,"j":0,"walls":[true,true,true,false],"visited":true},{"i":0,"j":1,"walls":[false,false,true,true],"visited":true},{"i":1,"j":1,"walls":[true,false,true,false],"visited":true},{"i":2,"j":1,"walls":[false,true,true,false],"visited":true},{"i":3,"j":1,"walls":[true,true,false,true],"visited":true},{"i":4,"j":1,"walls":[true,false,false,true],"visited":true},{"i":5,"j":1,"walls":[false,true,true,false],"visited":true},{"i":6,"j":1,"walls":[false,false,true,true],"visited":true},{"i":7,"j":1,"walls":[true,true,false,false],"visited":true},{"i":0,"j":2,"walls":[true,false,false,true],"visited":true},{"i":1,"j":2,"walls":[true,false,true,false],"visited":true},{"i":2,"j":2,"walls":[true,false,true,false],"visited":true},{"i":3,"j":2,"walls":[false,false,true,false],"visited":true},{"i":4,"j":2,"walls":[false,true,true,false],"visited":true},{"i":5,"j":2,"walls":[true,false,false,true],"visited":true},{"i":6,"j":2,"walls":[true,false,true,false],"visited":true},{"i":7,"j":2,"walls":[false,true,false,false],"visited":true},{"i":0,"j":3,"walls":[false,true,false,true],"visited":true},{"i":1,"j":3,"walls":[true,false,true,true],"visited":true},{"i":2,"j":3,"walls":[true,false,true,false],"visited":true},{"i":3,"j":3,"walls":[true,false,false,false],"visited":true},{"i":4,"j":3,"walls":[true,false,true,false],"visited":true},{"i":5,"j":3,"walls":[false,false,true,false],"visited":true},{"i":6,"j":3,"walls":[true,true,false,false],"visited":true},{"i":7,"j":3,"walls":[false,true,false,true],"visited":true},{"i":0,"j":4,"walls":[false,true,false,true],"visited":true},{"i":1,"j":4,"walls":[true,false,false,true],"visited":true},{"i":2,"j":4,"walls":[true,true,false,false],"visited":true},{"i":3,"j":4,"walls":[false,false,false,true],"visited":true},{"i":4,"j":4,"walls":[true,false,true,false],"visited":true},{"i":5,"j":4,"walls":[true,true,true,false],"visited":true},{"i":6,"j":4,"walls":[false,true,false,true],"visited":true},{"i":7,"j":4,"walls":[false,true,false,true],"visited":true},{"i":0,"j":5,"walls":[false,false,true,true],"visited":true},{"i":1,"j":5,"walls":[false,true,true,false],"visited":true},{"i":2,"j":5,"walls":[false,true,false,true],"visited":true},{"i":3,"j":5,"walls":[false,true,true,true],"visited":true},{"i":4,"j":5,"walls":[true,false,false,true],"visited":true},{"i":5,"j":5,"walls":[true,false,true,false],"visited":true},{"i":6,"j":5,"walls":[false,true,true,false],"visited":true},{"i":7,"j":5,"walls":[false,true,false,true],"visited":true},{"i":0,"j":6,"walls":[true,false,false,true],"visited":true},{"i":1,"j":6,"walls":[true,true,true,false],"visited":true},{"i":2,"j":6,"walls":[false,false,true,true],"visited":true},{"i":3,"j":6,"walls":[true,true,false,false],"visited":true},{"i":4,"j":6,"walls":[false,true,false,true],"visited":true},{"i":5,"j":6,"walls":[true,false,false,true],"visited":true},{"i":6,"j":6,"walls":[true,true,false,false],"visited":true},{"i":7,"j":6,"walls":[false,true,false,true],"visited":true},{"i":0,"j":7,"walls":[false,false,true,true],"visited":true},{"i":1,"j":7,"walls":[true,false,true,false],"visited":true},{"i":2,"j":7,"walls":[true,false,true,false],"visited":true},{"i":3,"j":7,"walls":[false,false,true,false],"visited":true},{"i":4,"j":7,"walls":[false,true,true,false],"visited":true},{"i":5,"j":7,"walls":[false,true,true,true],"visited":true},{"i":6,"j":7,"walls":[false,false,true,true],"visited":true},{"i":7,"j":7,"walls":[false,true,true,false],"visited":true}]';
  // let data = JSON.parse(jsonString);
  // grid = data.map(
  //   (cellData) =>
  //     new Cell(cellData.i, cellData.j, cellData.walls, cellData.visited)
  // );
  // background(51);
  // for (let i = 0; i < grid.length; i++) {
  //   grid[i].show();
  // }
  // // loadJSON(
  // //   "maze.json",
  // //   (data) => {
  // //     if (Array.isArray(data)) {
  // //       grid = data.map(
  // //         (cellData) =>
  // //           new Cell(cellData.i, cellData.j, cellData.walls, cellData.visited)
  // //       );
  // //       background(51);
  // //       for (let i = 0; i < grid.length; i++) {
  // //         grid[i].show();
  // //       }
  // //     } else {
  // //       console.error("Invalid data format or empty array in maze.json");
  // //       // Handle the error here, such as displaying an error message to the user
  // //     }
  // //   },
  // //   (error) => {
  // //     console.error("Error loading maze.json:", error);
  // //     // Handle the error here, such as displaying an error message to the user
  // //   }
  // // );
}

// la fonction draw est appelée en boucle par p5.js, 60 fois par seconde par défaut
// Le canvas est effacé automatiquement avant chaque appel à draw
function draw() {}
