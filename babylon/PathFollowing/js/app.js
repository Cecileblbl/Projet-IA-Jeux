const groundSize = 100; // La taille du sol
let vehicle; // Le véhicule
let vehicleDirection; // La direction du véhicule
let vehicleSpeed; // La vitesse du véhicule
let directionIndicator; // L'indicateur de direction
let proximityIndicator; // L'indicateur de proximité
let segments = []; // Les segments du serpent
let scene; // La scène
let camera; // La caméra
let canvas; // Le canvas
let engine; // Le moteur


window.onload = startGame;


function startGame() {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);

  scene = createScene();

  engine.runRenderLoop(() => {
    scene.render();
  });
}

const createScene = function() {
  // Create a new scene
  let scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

  // Ajoute une skybox
  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  // Create the sphere (vehicle)
  const vehicle = BABYLON.MeshBuilder.CreateCylinder("vehicle", {diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4}, scene);
  vehicle.position = new BABYLON.Vector3(0, 2, 0);
  vehicle.direction = new BABYLON.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
  vehicle.rotation.x = Math.PI / 2;

  // Création des segments du serpent
  for (let i = 1; i <= 5; i++) {
    let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, {diameter: 1.8 - i * 0.1}, scene);
    segment.position = new BABYLON.Vector3(vehicle.position.x, vehicle.position.y, vehicle.position.z + i * 2);
    segments.push(segment);
  }


  let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
  boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Une couleur de boîte plus vive
  vehicle.material = boxMaterial;

  // Ground
  let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
  let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1); // Un sol plus clair et plus accueillant
  ground.material = groundMaterial;

  // Caméra arc-rotate
  camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 75, new BABYLON.Vector3(0, 5, 0), scene);
  camera.attachControl(canvas, true);

  // Ajout d'un effet de post-processing
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
  shadowGenerator.addShadowCaster(vehicle); // La tête du serpent projette des ombres
  ground.receiveShadows = true; // Le sol reçoit des ombres

  // Define the start and end points of the path
  const pathStart = new BABYLON.Vector3(-40, 0.5, 0);
  const pathEnd = new BABYLON.Vector3(40, 0.5, 0);
  // Create the path
  BABYLON.MeshBuilder.CreateLines("path", {points: [pathStart, pathEnd]}, scene);

  // Define the initial direction and speed of the vehicle
  let vehicleDirection = new BABYLON.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
  let vehicleSpeed = 1;

  // Visualize direction and proximity
  let directionIndicator = BABYLON.MeshBuilder.CreateLines("directionIndicator", {
    points: [vehicle.position, vehicle.position.add(vehicle.direction.scale(10))], // Change here
    updatable: true
  }, scene);

  let proximityIndicator = BABYLON.Mesh.CreateTorus("proximityIndicator", 10, 0.1, 20, scene, false, BABYLON.Mesh.DOUBLESIDE);
  proximityIndicator.position = vehicle.position;
  proximityIndicator.color = new BABYLON.Color3(1, 0, 0);

  // Add a function to be executed before each render of the scene
  scene.onBeforeRenderObservable.add(() => {
    let distanceToPath = BABYLON.Vector3.Distance(vehicle.position, findNearestPointOnLine(vehicle.position, pathStart, pathEnd));

    if (distanceToPath < 5) {
      let pathDirection = pathEnd.subtract(pathStart).normalize();
      vehicle.direction = BABYLON.Vector3.Lerp(vehicle.direction, pathDirection, 0.05).normalize(); // Adjusted for smoother follow

      vehicle.material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Change to green when following path
      vehicleSpeed = 0.1 + Math.random() * 0.2; // Variable speed for natural movement
    } else {
      vehicle.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Change to red when not following path
    }

    moveVehicleContinuously();

    // Update direction and proximity indicators
    directionIndicator = BABYLON.MeshBuilder.CreateLines("directionIndicator", {
      points: [vehicle.position, vehicle.position.add(vehicle.direction.scale(10))],
      instance: directionIndicator
    }, scene);
    proximityIndicator.position = vehicle.position;
  });

  function moveVehicleContinuously() {
    let distanceBetweenSegments = 2; // Distance souhaitée entre les segments
    let followSpeed = 0.1; // Vitesse à laquelle les segments suivent la tête ou le segment précédent

    // La tête du serpent suit directement le sol
    let desiredPositionForHead = vehicle.position.subtract(vehicle.direction.scale(distanceBetweenSegments));
    let moveVectorForHead = desiredPositionForHead.subtract(vehicle.position).scale(followSpeed);
    vehicle.position.addInPlace(moveVectorForHead);

    // Boucle pour mettre à jour chaque segment à partir du premier
    for (let i = 0; i < segments.length; i++) {
      let leader; // L'objet que ce segment est en train de suivre
      if (i === 0) {
        leader = vehicle; // Le premier segment suit la tête du serpent
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

    // Ajoute une légère déviation aléatoire à la direction pour un mouvement naturel
    vehicle.direction.x += (Math.random() - 0.5) * 0.1;
    vehicle.direction.z += (Math.random() - 0.5) * 0.1;

    // Normalise le vecteur de direction
    vehicle.direction.normalize();
    vehicle.rotation.y = Math.atan2(vehicle.direction.x, vehicle.direction.z)+Math.PI;

    // Inverse la direction lorsque le véhicule atteint un bord
    if (Math.abs(vehicle.position.x) > groundSize / 2) {
      vehicle.direction.x *= -1;
    }
    if (Math.abs(vehicle.position.z) > groundSize / 2) {
      vehicle.direction.z *= -1;
    }
  }

  function findNearestPointOnLine(point, start, end) {
    const ap = point.subtract(start);
    const ab = end.subtract(start);
    ab.normalize();
    const amount = BABYLON.Vector3.Dot(ap, ab);
    return start.add(ab.scale(Math.min(Math.max(amount, 0), BABYLON.Vector3.Distance(start, end))));
  }

  return scene;
};

window.addEventListener("resize", () => {
  engine.resize();
});
