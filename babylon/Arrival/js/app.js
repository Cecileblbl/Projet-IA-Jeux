let canvas;
let engine;
let scene;
let camera;
let box;
let sphere;
let inputStates = {}; // Objet pour stocker les états des entrées
let segments = []; // Tableau pour stocker les segments du serpent


window.onload = startGame;

function startGame() {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = createScene();

  modifySettings(); // Initialise les écouteurs d'événements pour le déplacement et le verrouillage du pointeur

  engine.runRenderLoop(() => {
    moveBox(); // Déplace le cube en fonction des entrées
    updateSphere(); // Mettre à jour la position de la sphère pour suivre le cube
    scene.render();
  });
}

function createScene() {
  let scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair


  // Ajoute une skybox
  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;


  // Pyramid
  sphere = BABYLON.MeshBuilder.CreateCylinder("myPyramid", {diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4}, scene);
  sphere.position = new BABYLON.Vector3(0,2, 0);
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
  groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1); // Un sol plus clair et plus accueillant
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

// Ajout d'un effet de post-processing (glow effect par exemple)
  var glow = new BABYLON.GlowLayer("glow", scene);
  glow.intensity = 0.3;


  // Améliore l'éclairage
  let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
  light.position = new BABYLON.Vector3(20, 40, 20);
  light.intensity = 0.7

  // Ajout d'une lumière ambiante pour éclaircir les zones ombragées
  var ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
  ambientLight.intensity = 0.3;


  // Activer les ombres
  var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  shadowGenerator.useBlurExponentialShadowMap = true;
  shadowGenerator.addShadowCaster(sphere); // La sphère projette des ombres
  ground.receiveShadows = true; // Le sol reçoit des ombres


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
    }
    event.preventDefault();
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
  // Logique d'arrivée pour la tête du serpent
  let slowRadius = 20;
  let stopRadius = 1.5;
  let maxSpeed = 0.2;

  let toTarget = box.position.subtract(sphere.position);
  let distance = toTarget.length();

  let speed;
  if (distance < stopRadius) {
    speed = 0;
  } else if (distance < slowRadius) {
    speed = maxSpeed * (distance / slowRadius);
  } else {
    speed = maxSpeed;
  }

  let velocity = toTarget.normalize().scale(speed);
  sphere.position.addInPlace(velocity);
  sphere.rotation.y = Math.atan2(toTarget.x, toTarget.z);


  // Logique d'arrivée pour les segments du serpent
  let segmentSlowRadius = 10;
  let segmentStopRadius = 2;
  let segmentMaxSpeed = 0.2;
  let desiredSegmentDistance = 2;

  for (let i = 0; i < segments.length; i++) {
    let leader = i === 0 ? sphere : segments[i - 1];
    let toLeader = leader.position.subtract(segments[i].position);
    let segmentDistance = toLeader.length();

    let segmentSpeed;
    if (segmentDistance < segmentStopRadius) {
      segmentSpeed = 0;
    } else if (segmentDistance < segmentSlowRadius) {
      segmentSpeed = segmentMaxSpeed * (segmentDistance / segmentSlowRadius);
    } else {
      segmentSpeed = segmentMaxSpeed;
    }

    let segmentVelocity = toLeader.normalize().scale(segmentSpeed);
    segments[i].position.addInPlace(segmentVelocity);

    // Si le segment est trop proche de son leader, le déplacer pour maintenir la distance souhaitée
    if (segmentDistance < desiredSegmentDistance) {
      let moveAway = toLeader.normalize().scale(desiredSegmentDistance - segmentDistance);
      segments[i].position.subtractInPlace(moveAway);
    }

    // Ajuste la rotation pour que le segment regarde vers le leader
    segments[i].lookAt(leader.position);
  }
}


window.addEventListener("resize", () => {
  engine.resize();
});
