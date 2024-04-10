let canvas;
let engine;
let scene;
let camera;
let box; // Cible
let sphere; // Poursuivant
let groundSize = 100; // Taille du terrain
let boxSpeed = 0.3; // Vitesse de déplacement du cube
let boxDirection = new BABYLON.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(); // Direction initiale aléatoire
let segments = []; // Segments du serpent

window.onload = function startGame() {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = createScene();

  engine.runRenderLoop(() => {
    moveBoxContinuously(); // Déplace le cube continuellement
    updateSphere(); // Met a jour  la position de la sphère pour poursuivre le cube
    if (isSphereCloseToBox()) {
      resetBoxPosition(); // Réinitialise la position du cube si la sphère est proche
      resetSpherePosition(); // Réinitialise la position de la sphère
      resetSegmentsPosition(); // Réinitialise la position des segments du serpent
    }
    scene.render();
  });
};

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
  sphere.position = new BABYLON.Vector3(0, 1 + 2, 0);
  // Rotate the pyramid to make it look like an arrow
  sphere.rotation.x = Math.PI / 2;

  // boule cible
  box = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 4}, scene);
  box.position = new BABYLON.Vector3(-2, 1 + 2, 2);
  // couleur de la boîte
  let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
  boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Une couleur de boîte plus vive
  box.material = boxMaterial;

  // Ground
  let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
  let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1); // Un sol plus clair
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


function moveBoxContinuously() {
  let boxSpeed = 0.4; // vitesse de déplacement du cube
  box.position.addInPlace(boxDirection.scale(boxSpeed)); // Déplace le cube dans la direction actuelle

  // Vérifie si le cube atteint les limites du terrain et change de direction si nécessaire
  if (box.position.x > groundSize / 2 || box.position.x < -groundSize / 2) {
    boxDirection.x *= -1;
  }
  if (box.position.z > groundSize / 2 || box.position.z < -groundSize / 2) {
    boxDirection.z *= -1;
  }
  boxDirection = boxDirection.normalize(); // Normalise la direction
}

function updateSphere() {
  let speed = 0.3; // Vitesse de déplacement de la tête du serpent

  // Calcule la direction de la sphère pour poursuivre la boîte
  let direction = box.position.subtract(sphere.position).normalize().scale(speed);
  sphere.position.addInPlace(direction);
  sphere.rotation.y = Math.atan2(direction.x, direction.z);

  let followSpeed = 0.1; // Vitesse à laquelle les segments suivent la tête ou le segment précédent
  let distanceBetweenSegments = 2; // Distance souhaitée entre les segments

  // Mise à jour de la position des segments pour suivre la tête ou le segment précédent
  for (let i = 0; i < segments.length; i++) {
    let leader = i === 0 ? sphere : segments[i - 1]; // Le leader est soit la tête soit le segment précédent
    let leaderPos = leader.position;

    // Calcule la direction et la distance idéale du segment actuel vers son leader
    let directionToLeader = leaderPos.subtract(segments[i].position).normalize();
    let desiredPosition = leaderPos.subtract(directionToLeader.scale(distanceBetweenSegments));

    // Calcule le vecteur de déplacement nécessaire pour atteindre la position idéale
    let moveVector = desiredPosition.subtract(segments[i].position).scale(followSpeed);
    segments[i].position.addInPlace(moveVector);

    //Oriente chaque segment pour regarder vers son leader
    segments[i].lookAt(leader.position);
  }
}


function isSphereCloseToBox() {
  // Vérifie si la sphère est proche du cube
  return sphere.position.subtract(box.position).length() < 3; // Seuil de proximité
}

function resetBoxPosition() {
  box.position.x = Math.random() * groundSize - groundSize / 2;
  box.position.z = Math.random() * groundSize - groundSize / 2;
  boxDirection = new BABYLON.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(); // Réinitialise la direction

}

function resetSpherePosition() {
  sphere.position = new BABYLON.Vector3(0, 1, 0); // Place la sphère au centre
}


function resetSegmentsPosition() {
  // Parcour chaque segment
  for (let i = 0; i < segments.length; i++) {
    // Place le segment à la position de la tête du serpent
  segments[i].position = new BABYLON.Vector3(sphere.position.x, sphere.position.y, sphere.position.z + (i + 1) * 2);
  }
}
