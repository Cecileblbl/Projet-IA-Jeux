document.addEventListener("DOMContentLoaded", function () {
  let canvas = document.getElementById("myCanvas");
  let engine = new BABYLON.Engine(canvas, true);
  let scene;
  let terrain = [];
  let startPoint = null;
  let endPoint = null;
  let path = [];
  let snakeIndex = 0; // Indice de progression de la chenille sur le chemin
  let step = 0.1; // Pas de progression de la chenille (plus petit = plus lent)
  let drawPath = false; // Indique si le chemin doit être affiché
  let serpents = []; // Liste des serpents

  const scl = 40; // Taille des cellules
  const w = 600;
  const h = 600;
  const cols = Math.floor(w / scl);
  const rows = Math.floor(h / scl);

  function createScene() {
    scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

    // Ajoute une skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1500 }, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

    // Caméra arc-rotate
    let camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 500, new BABYLON.Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    // Configuration pour éviter le mouvement de la caméra avec les flèches du clavier
    camera.keysUp = [];
    camera.keysDown = [];
    camera.keysLeft = [];
    camera.keysRight = [];

    // ajustement du champ de vision
    camera.fov = 1.0;

    // Ajout d'un effet de post-processing (glow effect par exemple)
    var glow = new BABYLON.GlowLayer("glow", scene);
    glow.intensity = 0.3;

    // Améliore l'éclairage
    let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
    light.position = new BABYLON.Vector3(20, 40, 20);
    light.intensity = 0.7;

    // Ajout d'une lumière ambiante pour éclaircir les zones ombragées
    var ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.3;

    // Activer les ombres
    var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
    shadowGenerator.useBlurExponentialShadowMap = true;

    // Initialiser le terrain
    createTerrainMesh();

    // Afficher le terrain dans la console
    console.table(terrain);

    // Event listener for mouse click
    canvas.addEventListener("click", (event) => {
      selectPoints(event);
    });

    return scene;
  }

  function createTerrainMesh() {
    for (let x = 0; x < cols; x++) {
      terrain[x] = [];
      for (let y = 0; y < rows; y++) {
        terrain[x][y] = Math.floor(Math.random() * 100); // Générer des valeurs entre 0 et 99
      }
    }

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let x1 = x * scl;
        let y1 = y * scl;

        // Create a box for each terrain cell
        let height = terrain[x][y] / 5; // Increase the height variation
        let box = BABYLON.MeshBuilder.CreateBox(`box_${x}_${y}`, { width: scl, depth: scl, height: height }, scene);
        box.position = new BABYLON.Vector3(x1 - w / 2 + scl / 2, height / 2, y1 - h / 2 + scl / 2);
        box.material = new BABYLON.StandardMaterial(`mat_${x}_${y}`, scene);

        // Use a color gradient based on the terrain value
        let colorValue = terrain[x][y] / 100;
        box.material.diffuseColor = new BABYLON.Color3(1 - colorValue, colorValue, 0);
        box.material.specularColor = new BABYLON.Color3(0, 0, 0); // Remove specular highlights
        box.material.emissiveColor = new BABYLON.Color3(1 - colorValue, colorValue, 0).scale(0.1); // Add a slight emissive color to reduce the shadow effect

        // Make the box pickable
        box.isPickable = true;

        // Add action to highlight the box on hover
        box.actionManager = new BABYLON.ActionManager(scene);
        box.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOverTrigger,
                function (event) {
                  event.source.material.emissiveColor = new BABYLON.Color3(0, 1, 0); // Highlight color
                }
            )
        );

        box.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                BABYLON.ActionManager.OnPointerOutTrigger,
                function (event) {
                  let colorValue = terrain[x][y] / 100;
                  event.source.material.emissiveColor = new BABYLON.Color3(1 - colorValue, colorValue, 0).scale(0.1); // Restore original color
                }
            )
        );
      }
    }
  }

  function selectPoints(event) {
    let pickResult = scene.pick(event.clientX, event.clientY);
    if (pickResult.hit) {
      let pickedMesh = pickResult.pickedMesh;
      console.log("pickedMesh.position.x:", pickedMesh.position.x);
      console.log("pickedMesh.position.z:", pickedMesh.position.z);
      let x = Math.floor((pickedMesh.position.x + w / 2) / scl);
      let y = Math.floor((pickedMesh.position.z + h / 2) / scl);

      let adjustedX = x * scl - w / 2 + scl / 2;
      let adjustedZ = y * scl - h / 2 + scl / 2;

      console.log(`Clicked on cell: (${x}, ${y})`);
      console.log(`Adjusted position: (${adjustedX}, ${adjustedZ})`);

      if (!startPoint) {
        startPoint = new BABYLON.Vector3(adjustedX, 5, adjustedZ);
        createPointMesh(startPoint, BABYLON.Color3.Red());
        console.log("Start Point Selected: ", startPoint);
      } else if (!endPoint) {
        endPoint = new BABYLON.Vector3(adjustedX, 5, adjustedZ);
        createPointMesh(endPoint, BABYLON.Color3.Blue());
        console.log("End Point Selected: ", endPoint);

        // Calculate path with A*
        path = A_star(terrain, [Math.floor((startPoint.x + w / 2) / scl), Math.floor((startPoint.z + h / 2) / scl)], [x, y]);
        console.log("Path: ", path);
        drawPath = true;
        highlightPath(path); // Highlight the path
      }
    }
  }

  function createPointMesh(position, color) {
    let point = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 10 }, scene);
    point.position = position;
    point.material = new BABYLON.StandardMaterial("pointMat", scene);
    point.material.diffuseColor = color;
  }

  function highlightPath(path) {
    path.forEach(([x, y]) => {
      let box = scene.getMeshByName(`box_${x}_${y}`);
      if (box) {
        box.material.emissiveColor = new BABYLON.Color3(0, 0, 1); // Highlight the path with a blue color
      }
    });
  }

  function drawSnake() {
    if (snakeIndex < path.length) {
      let x = path[Math.floor(snakeIndex)][0] * scl - w / 2 + scl / 2;
      let y = path[Math.floor(snakeIndex)][1] * scl - h / 2 + scl / 2;

      let snakePart = BABYLON.MeshBuilder.CreateSphere(`snakePart_${snakeIndex}`, { diameter: 10 }, scene);
      snakePart.position = new BABYLON.Vector3(x, 5, y);
      snakePart.material = new BABYLON.StandardMaterial("snakeMat", scene);
      snakePart.material.diffuseColor = BABYLON.Color3.Green();

      snakeIndex += step;
    } else {
      drawPath = false;
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

  function dist(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  }

  // Animation loop
  engine.runRenderLoop(() => {
    scene.render();
    if (drawPath) {
      drawSnake();
    }
  });

  scene = createScene();

  window.addEventListener("resize", function () {
    engine.resize();
  });
});
