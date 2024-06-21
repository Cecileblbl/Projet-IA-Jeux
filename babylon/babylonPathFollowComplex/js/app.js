const groundSize = 100; // La taille du sol
let vehicles = []; // Les véhicules
let segments = []; // Les segments du serpent
let scene; // La scène
let camera; // La caméra
let canvas; // Le canvas
let engine; // Le moteur
let shadowGenerator; // Générateur d'ombres

let path = []; // Chemin complexe
let debugMode = false; // Mode de débogage pour afficher les informations

window.onload = startGame;

function startGame() {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);

  scene = createScene();

  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "t" || event.key === "T") {
      createNewVehicle();
    } else if (event.key === "d" || event.key === "D") {
      debugMode = !debugMode; // Toggle debug mode
    }
  });
}

function createScene() {
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

  // Ajoute une skybox
  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  // Ground
  let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
  let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
  ground.material = groundMaterial;

  // Caméra arc-rotate
  camera = new BABYLON.ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 4,
      75,
      new BABYLON.Vector3(0, 5, 0),
      scene
  );
  camera.attachControl(canvas, true);

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
  shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
  shadowGenerator.useBlurExponentialShadowMap = true;

  ground.receiveShadows = true; // Le sol reçoit des ombres

  // Create the initial vehicle
  createNewVehicle();

  // Create the complex path
  createPath();

  // Add a function to be executed before each render of the scene
  scene.onBeforeRenderObservable.add(() => {
    vehicles.forEach((vehicle, index) => {
      followPath(vehicle);
      moveVehicleContinuously(vehicle, segments[index]);

      if (debugMode) {
        showDebugInfo(vehicle);
      }
    });
  });

  return scene;
}

function createNewVehicle() {
  let newVehicle = BABYLON.MeshBuilder.CreateCylinder(
      `vehicle${vehicles.length}`,
      { diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4 },
      scene
  );
  newVehicle.id = vehicles.length; // Assign an ID to the vehicle
  newVehicle.position = new BABYLON.Vector3(
      Math.random() * groundSize - groundSize / 2,
      2,
      Math.random() * groundSize - groundSize / 2
  );
  newVehicle.direction = new BABYLON.Vector3(1, 0, 0).normalize();
  newVehicle.rotation.x = Math.PI / 2;
  newVehicle.speed = 0.1; // Increased speed for clarity

  let boxMaterial = new BABYLON.StandardMaterial(`boxMaterial${vehicles.length}`, scene);
  boxMaterial.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
  newVehicle.material = boxMaterial;

  vehicles.push(newVehicle);
  shadowGenerator.addShadowCaster(newVehicle);

  // Create segments for the new vehicle
  let newSegments = [];
  for (let i = 1; i <= 5; i++) {
    let segment = BABYLON.MeshBuilder.CreateSphere(`segment${vehicles.length}_${i}`, { diameter: 1.8 - i * 0.1 }, scene);
    segment.position = new BABYLON.Vector3(newVehicle.position.x, newVehicle.position.y, newVehicle.position.z + i * 2);
    newSegments.push(segment);
  }
  segments.push(newSegments);
}

function createPath() {
  path.push(new BABYLON.Vector3(-40, 0.5, -40));
  path.push(new BABYLON.Vector3(-30, 0.5, -30));
  path.push(new BABYLON.Vector3(-20, 0.5, -40));
  path.push(new BABYLON.Vector3(0, 0.5, -40));
  path.push(new BABYLON.Vector3(10, 0.5, -30));
  path.push(new BABYLON.Vector3(20, 0.5, -40));
  path.push(new BABYLON.Vector3(30, 0.5, -30));
  path.push(new BABYLON.Vector3(40, 0.5, -40));
  path.push(new BABYLON.Vector3(30, 0.5, -10));
  path.push(new BABYLON.Vector3(40, 0.5, 0));
  path.push(new BABYLON.Vector3(30, 0.5, 10));
  path.push(new BABYLON.Vector3(40, 0.5, 20));
  path.push(new BABYLON.Vector3(30, 0.5, 30));
  path.push(new BABYLON.Vector3(20, 0.5, 40));
  path.push(new BABYLON.Vector3(10, 0.5, 30));
  path.push(new BABYLON.Vector3(0, 0.5, 40));
  path.push(new BABYLON.Vector3(-10, 0.5, 30));
  path.push(new BABYLON.Vector3(-20, 0.5, 40));
  path.push(new BABYLON.Vector3(-30, 0.5, 30));
  path.push(new BABYLON.Vector3(-40, 0.5, 40));
  path.push(new BABYLON.Vector3(-30, 0.5, 10));
  path.push(new BABYLON.Vector3(-40, 0.5, 0));
  path.push(new BABYLON.Vector3(-30, 0.5, -10));
  path.push(new BABYLON.Vector3(-40, 0.5, -20));
  path.push(new BABYLON.Vector3(-40, 0.5, -40));
  BABYLON.MeshBuilder.CreateLines("path", { points: path, updatable: true }, scene);
}

function followPath(vehicle) {
  let closestDistance = Number.MAX_VALUE;
  let closestPoint = null;
  let targetPoint = null;

  for (let i = 0; i < path.length; i++) {
    const start = path[i];
    const end = path[(i + 1) % path.length]; // Wrap around to create a circular path

    const closest = findNearestPointOnLine(vehicle.position, start, end);
    const distance = BABYLON.Vector3.Distance(vehicle.position, closest);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = closest;

      const segmentDirection = end.subtract(start).normalize();
      const targetDistance = Math.min(5, BABYLON.Vector3.Distance(closest, end)); // Ensure target point stays within the segment
      targetPoint = closest.add(segmentDirection.scale(targetDistance));
    }
  }

  if (targetPoint) {
    const desiredDirection = targetPoint.subtract(vehicle.position).normalize();
    vehicle.direction = BABYLON.Vector3.Lerp(vehicle.direction, desiredDirection, 0.05); // Lower lerp factor for smoother turns
  }

  vehicle.rotation.y = Math.atan2(vehicle.direction.x, vehicle.direction.z);

  // Debugging visuals
  let debugSphere = scene.getMeshByName(`debugSphere${vehicle.id}`);
  if (!debugSphere) {
    debugSphere = BABYLON.MeshBuilder.CreateSphere(`debugSphere${vehicle.id}`, { diameter: 0.5 }, scene);
    const debugMaterial = new BABYLON.StandardMaterial(`debugMaterial${vehicle.id}`, scene);
    debugMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red for the target point
    debugSphere.material = debugMaterial;
  }
  debugSphere.position = targetPoint;
}

function moveVehicleContinuously(vehicle, vehicleSegments) {
  let distanceBetweenSegments = 2; // Distance souhaitée entre les segments
  let followSpeed = 0.1; // Vitesse à laquelle les segments suivent la tête ou le segment précédent

  // La tête du serpent suit directement le sol
  vehicle.position.addInPlace(vehicle.direction.scale(vehicle.speed));

  // Boucle pour mettre à jour chaque segment à partir du premier
  for (let i = 0; i < vehicleSegments.length; i++) {
    let leader; // L'objet que ce segment est en train de suivre
    if (i === 0) {
      leader = vehicle; // Le premier segment suit la tête du serpent
    } else {
      leader = vehicleSegments[i - 1]; // Les autres segments suivent le segment précédent
    }

    // Calcule la direction vers le leader
    let directionToLeader = leader.position.subtract(vehicleSegments[i].position).normalize();
    let desiredPosition = leader.position.subtract(directionToLeader.scale(distanceBetweenSegments));

    // Déplace le segment vers la position désirée à la vitesse définie
    let moveVector = desiredPosition.subtract(vehicleSegments[i].position).scale(followSpeed);
    vehicleSegments[i].position.addInPlace(moveVector);

    vehicle.direction.normalize();
    vehicle.rotation.y = Math.atan2(vehicle.direction.x, vehicle.direction.z);

    // Oriente le segment pour qu'il regarde le leader
    vehicleSegments[i].lookAt(leader.position);
  }
}

function findNearestPointOnLine(point, start, end) {
  const ap = point.subtract(start);
  const ab = end.subtract(start);
  ab.normalize();
  const amount = BABYLON.Vector3.Dot(ap, ab);
  return start.add(ab.scale(Math.min(Math.max(amount, 0), BABYLON.Vector3.Distance(start, end))));
}

function showDebugInfo(vehicle) {
  let debugText = document.getElementById(`debugText${vehicle.id}`);
  if (!debugText) {
    debugText = document.createElement("div");
    debugText.id = `debugText${vehicle.id}`;
    debugText.style.position = "absolute";
    debugText.style.color = "white";
    debugText.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    debugText.style.padding = "5px";
    document.body.appendChild(debugText);
  }

  let closestDistance = Number.MAX_VALUE;
  let closestPoint = null;
  let targetPoint = null;

  for (let i = 0; i < path.length; i++) {
    const start = path[i];
    const end = path[(i + 1) % path.length];

    const closest = findNearestPointOnLine(vehicle.position, start, end);
    const distance = BABYLON.Vector3.Distance(vehicle.position, closest);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = closest;

      const segmentDirection = end.subtract(start).normalize();
      const targetDistance = Math.min(5, BABYLON.Vector3.Distance(closest, end));
      targetPoint = closest.add(segmentDirection.scale(targetDistance));
    }
  }

  //debugText.innerText = `Vehicle ID: ${vehicle.id}\nClosest Point: ${closestPoint}\nDesired Direction: ${vehicle.direction}`;
  //debugText.style.left = `${canvas.offsetLeft + 10}px`;
  //debugText.style.top = `${canvas.offsetTop + vehicle.id * 20}px`;
}

window.addEventListener("resize", () => {
  engine.resize();
});
