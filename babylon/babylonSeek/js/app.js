let canvas;
let engine;
let scene;
let camera;
let box;
let sphere;
let inputStates = {}; // Objet pour stocker les états des entrées
let segments = [];
let serpents = []; // Tableau pour stocker nos serpents


window.onload = startGame;

function startGame() {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);

  scene = createScene();

  modifySettings(); // Initialiser les écouteurs d'événements pour le déplacement et le verrouillage du pointeur

  engine.runRenderLoop(() => {
    moveBox(); // Déplacer le cube en fonction des entrées
    updateSphere(); // Mettre à jour la position de la sphère pour suivre le cube
    updateScene(); // Mettre à jour les serpents
    scene.render();
  });
}

function createScene() {
  let scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair


  // Ajoute une skybox
  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
  skybox.material = skyboxMaterial;


  // Pyramid that will follow the sphere
  sphere = BABYLON.MeshBuilder.CreateCylinder("myPyramid", {diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4}, scene);
  sphere.position = new BABYLON.Vector3(0, 1 + 2, 0);
  // Rotate the pyramid to make it look like an arrow
  sphere.rotation.x = Math.PI / 2;

  // Movable sphere with direction keys
  box = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 4}, scene);
  box.position = new BABYLON.Vector3(-2, 1 + 2, 2);
  // couleur de la boîte
  let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
  boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Une couleur de boîte plus vive
  box.material = boxMaterial;

  // Ground
  let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
  let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");

  //groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1);
  ground.material = groundMaterial;

  // Caméra arc-rotate
  camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 75, new BABYLON.Vector3(0, 5, 0), scene);
  camera.attachControl(canvas, true);

// Configuration pour éviter le mouvement de la caméra avec les flèches du clavier
  camera.keysUp = [];
  camera.keysDown = [];
  camera.keysLeft = [];
  camera.keysRight = [];

// ajustement du champ de vision
  camera.fov = 1.5;

// effet de post-processing
  var glow = new BABYLON.GlowLayer("glow", scene);
  glow.intensity = 0.6;


  // Light
  let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
  light.position = new BABYLON.Vector3(50, 100, 50);
  light.intensity = 0.7;

// Lifght ambiant pour éclairer les zones sombres
  var ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(1, 1, 0), scene);
  ambientLight.intensity = 0.5;

// ombres
  var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.blurKernel = 32;
  shadowGenerator.addShadowCaster(box);
  shadowGenerator.addShadowCaster(sphere);
  segments.forEach(segment => shadowGenerator.addShadowCaster(segment));
  ground.receiveShadows = true;


  // Création des segments du serpent
  for (let i = 1; i <= 5; i++) {
    let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, {diameter: 1.8 - i * 0.1}, scene);
    segment.position = new BABYLON.Vector3(sphere.position.x, sphere.position.y, sphere.position.z + i * 2);
    segments.push(segment);
  }

  return scene;
}

function modifySettings() {
  scene.onPointerDown = () => {
    if (!scene.alreadyLocked) {
      console.log("requesting pointer lock");
      canvas.requestPointerLock();
    } else {
      console.log("Pointer already locked");
    }
  };

  document.addEventListener("pointerlockchange", () => {
    let element = document.pointerLockElement || null;
    if (element) {
      scene.alreadyLocked = true;
    } else {
      scene.alreadyLocked = false;
    }
  });

  // Initialise les états d'entrée à false
  inputStates.left = false;
  inputStates.right = false;
  inputStates.up = false;
  inputStates.down = false;

  window.addEventListener('keydown', (event) => {
    switch (event.key) {
      case "ArrowLeft":
      case "q":
      case "Q":
        inputStates.left = true;
        break;
      case "ArrowDown":
      case "z":
      case "Z":
        inputStates.up = true;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        inputStates.right = true;
        break;
      case "ArrowUp":
      case "s":
      case "S":
        inputStates.down = true;
        break;
      case "t":
      case "T":
        if (!inputStates.t) {  // Empêche la création multiple si la touche reste enfoncée
          inputStates.t = true;
          createSerpent();  // Créer un serpent quand la touche 'T' est pressée
        }
        break;
    }
    event.preventDefault();  // Empêche les actions par défaut des touches
  }, false);

  window.addEventListener('keyup', (event) => {
    switch (event.key) {
      case "ArrowLeft":
      case "q":
      case "Q":
        inputStates.left = false;
        break;
      case "ArrowDown":
      case "z":
      case "Z":
        inputStates.up = false;
        break;
      case "ArrowRight":
      case "d":
      case "D":
        inputStates.right = false;
        break;
      case "ArrowUp":
      case "s":
      case "S":
        inputStates.down = false;
        break;
      case "t":
      case "T":
        inputStates.t = false;  // Réinitialiser l'état lorsque la touche est relâchée
        break;
    }
    event.preventDefault();
  }, false);

}

  function moveBox() {
  let groundSize = 100; // La taille du sol
  let halfGroundSize = groundSize / 2;
  let boxSize = 2; // La taille de la boîte
  let halfBoxSize = boxSize / 2; // La moitié de la taille de la boîte

  let moveSpeed = 0.3; // vitesse de déplacement

  if (inputStates.left && box.position.x - halfBoxSize > -halfGroundSize) box.position.x -= moveSpeed;
  if (inputStates.right && box.position.x + halfBoxSize < halfGroundSize) box.position.x += moveSpeed;
  if (inputStates.up && box.position.z - halfBoxSize > -halfGroundSize) box.position.z -= moveSpeed;
  if (inputStates.down && box.position.z + halfBoxSize < halfGroundSize) box.position.z += moveSpeed;
}

function updateSphere() {
  let distanceBetweenSegments = 2; // Distance souhaitée entre les segments
  let followSpeed = 0.1; // Vitesse à laquelle les segments suivent la tête ou le segment précédent

  // La tête du serpent  suit directement la boîte
  let directionToBox = box.position.subtract(sphere.position).normalize();
  let desiredPositionForHead = box.position.subtract(directionToBox.scale(distanceBetweenSegments));
  let moveVectorForHead = desiredPositionForHead.subtract(sphere.position).scale(followSpeed);
  sphere.position.addInPlace(moveVectorForHead);
  //sphere.lookAt(box.position); // Oriente la tête vers la boîte
  // Ajuste la rotation pour que la tête regarde vers le cote opposé
  sphere.rotation.y = Math.atan2(directionToBox.x, directionToBox.z);

  // Boucle pour mettre à jour chaque segment à partir du premier
  for (let i = 0; i < segments.length; i++) {
    let leader; // L'objet que ce segment est en train de suivre
    if (i === 0) {
      leader = sphere; // Le premie segment suit la tête (pyramide)
    } else {
      leader = segments[i - 1]; // Les autres segments suivent le segment précédent
    }

    // Calcule la direction vers le leader
    let directionToLeader = leader.position.subtract(segments[i].position).normalize();
    let desiredPosition = leader.position.subtract(directionToLeader.scale(distanceBetweenSegments));

    // Déplace le segment vers la position désirée à la vitesse définie
    let moveVector = desiredPosition.subtract(segments[i].position).scale(followSpeed);
    segments[i].position.addInPlace(moveVector);

    // Oriente le segment pour qu'il regarde le leader
    segments[i].lookAt(leader.position);
  }
}

function updateScene() {
  serpents.forEach(serpent => {
    updateSerpent(serpent); // Mettre à jour chaque serpent
  });
}


function updateSerpent(serpent) {
  let distanceBetweenSegments = 2;

  // Utilise la vitesse de suivi spécifique à chaque serpent
  let followSpeed = serpent.followSpeed;

  // Mettre à jour la tête du serpent
  let directionToBox = box.position.subtract(serpent.head.position).normalize();
  let desiredPositionForHead = box.position.subtract(directionToBox.scale(distanceBetweenSegments));
  let moveVectorForHead = desiredPositionForHead.subtract(serpent.head.position).scale(followSpeed);
  serpent.head.position.addInPlace(moveVectorForHead);
  serpent.head.rotation.y = Math.atan2(directionToBox.x, directionToBox.z);

  // Boucle pour mettre à jour chaque segment à partir du premier
  for (let i = 0; i < serpent.segments.length; i++) {
    let leader = i === 0 ? serpent.head : serpent.segments[i - 1];
    let directionToLeader = leader.position.subtract(serpent.segments[i].position).normalize();
    let desiredPosition = leader.position.subtract(directionToLeader.scale(distanceBetweenSegments));
    let moveVector = desiredPosition.subtract(serpent.segments[i].position).scale(followSpeed);
    serpent.segments[i].position.addInPlace(moveVector);
    serpent.segments[i].lookAt(leader.position);
  }
}


function getRandomColor() {
  // Générer des composantes de couleur RGB aléatoires
  return new BABYLON.Color3(Math.random(), Math.random(), Math.random());
}

function createSerpent() {
  const offsetAngle = Math.random() * Math.PI * 2; // Angle aléatoire pour la dispersion
  const offsetDistance = 10; // Distance fixe du centre

  // Position initiale basée sur un décalage circulaire autour de la balle
  let initialX = box.position.x + offsetDistance * Math.cos(offsetAngle);
  let initialZ = box.position.z + offsetDistance * Math.sin(offsetAngle);

  // Création de la tête du serpent avec une couleur aléatoire
  let head = BABYLON.MeshBuilder.CreateCylinder("head" + serpents.length, {
    diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4
  }, scene);
  head.position = new BABYLON.Vector3(initialX, 1 + 2, initialZ);
  head.rotation.x = Math.PI / 2;
  let headMaterial = new BABYLON.StandardMaterial("headMat" + serpents.length, scene);
  headMaterial.diffuseColor = getRandomColor();
  head.material = headMaterial;

  let segments = [];
  // Création des segments du serpent
  for (let i = 1; i <= 5; i++) {
    let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, {diameter: 1.8 - i * 0.1}, scene);
    segment.position = new BABYLON.Vector3(head.position.x, head.position.y, head.position.z + i * 2);
    segment.material = headMaterial;  // Utiliser la même couleur que la tête pour tout le corps
    segments.push(segment);
  }

  // Ajoute le nouveau serpent à la liste des serpents avec une vitesse de suivi variée
  serpents.push({
    head: head,
    segments: segments,
    followSpeed: 0.05 + Math.random() * 0.1  // Vitesse de suivi aléatoire entre 0.05 et 0.15
  });
}


window.addEventListener("resize", () => {
  engine.resize();
});
