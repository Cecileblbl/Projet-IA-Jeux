let canvas;
let engine;
let scene;
let camera;
let box; // La boule verte
let vehicle; // La pyramide qui suit la boule verte
let inputStates = {}; // États des entrées
let obstacles = []; // Tableau pour stocker les obstacles
let segments = []; // Tableau pour stocker les segments du serpent
let slowDownRadius = 10; // Rayon pour ralentir progressivement le véhicule
let avoidRadius = 10; // Rayon pour éviter les obstacles



window.onload = startGame;

function startGame() {
  canvas = document.querySelector("#myCanvas");
  engine = new BABYLON.Engine(canvas, true);
  scene = createScene();

  modifySettings();

  engine.runRenderLoop(() => {
    moveBox(); // Déplace la boule verte en fonction des entrées
    vehicle.seek(box.position); // Faire suivre la pyramide la boule verte
    vehicle.avoid(obstacles); // Ajoute la logique d'évitement
    vehicle.update(); // Met à jour le véhicule (pyramide)
    scene.render();
  });
}

function createScene() {
  scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

  // Ajoute une skybox
  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;


  box = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 4}, scene);
  box.position = new BABYLON.Vector3(-2, 2, 2);
  let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
  boxMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
  box.material = boxMaterial;

  // Ground
  let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
  let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1); // Un sol plus clair
  ground.material = groundMaterial;

  // Création du véhicule (pyramide)
  vehicle = new Vehicle(scene, new BABYLON.Vector3(0, 2, -10), box.position);


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

// Ajout d'un effet de post-processing pour améliorer l'apparence
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
  shadowGenerator.addShadowCaster(box); // La sphère projette des ombres
  ground.receiveShadows = true; // Le sol reçoit des ombres


  // Création des segments du serpent
  for (let i = 1; i <= 5; i++) {
    let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, {diameter: 1.8 - i * 0.1}, scene);
    segment.position = new BABYLON.Vector3(vehicle.position.x, vehicle.position.y, vehicle.position.z + i * 2);
    segments.push(segment);
  }

  // Ajout d'obstacles pour tester la logique d'évitement
  createObstacles();

  return scene;
}

// Fonction pour créer des obstacles
function createObstacles() {
  // Exemple d'ajout d'un obstacle
  let obstacle = BABYLON.MeshBuilder.CreateBox("obstacle", {size: 3}, scene);
  obstacle.position = new BABYLON.Vector3(5, 2.5, 5);
  let obstacleMaterial = new BABYLON.StandardMaterial("obstacleMat", scene);
  obstacleMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Couleur rouge pour les obstacles
  obstacle.material = obstacleMaterial;

  // Ajout l'obstacle à la liste des obstacles avec une distance de sécurité
  obstacles.push({ mesh: obstacle, safeDistance: 6 });

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

function modifySettings() {
  scene.onPointerDown = function (evt, pickResult) {
    // Vérifie si le clic est sur le sol
    if (pickResult.hit && pickResult.pickedMesh.name === "ground") {
      // Crée un nouvel obstacle à l'emplacement du clic
      let newObstacle = BABYLON.MeshBuilder.CreateBox("obstacle", {size: 3}, scene);
      newObstacle.position = pickResult.pickedPoint;
      // sur eleve le nouvel obstacle pour éviter les collisions avec le sol
      newObstacle.position.y += 2;

      let obstacleMaterial = new BABYLON.StandardMaterial("obstacleMat", scene);
      obstacleMaterial.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random()); // Couleur aléatoire
      newObstacle.material = obstacleMaterial;

      // Ajoute l'obstacle à la liste des obstacles avec une distance de sécurité
      obstacles.push({ mesh: newObstacle, safeDistance: 6 });
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

class Vehicle {
  constructor(scene, initialPosition, target) {
    this.scene = scene;
    this.position = initialPosition.clone();
    this.velocity = new BABYLON.Vector3.Zero();
    this.acceleration = new BABYLON.Vector3.Zero();
    this.maxSpeed = 0.2; // Vitesse maximale du véhicule
    this.maxForce = 0.1; // Force maximale appliquée pour changer de direction
    this.target = target;

    this.mesh = BABYLON.MeshBuilder.CreateCylinder("vehicle", {
      diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4
    }, scene);
    this.mesh.position = this.position;
    this.mesh.rotation.x = Math.PI / 2;
  }

  applyForce(force) {
    this.acceleration.addInPlace(force);
  }

  update() {
    this.velocity.addInPlace(this.acceleration);
    this.position.addInPlace(this.velocity);

    if (this.velocity.length() > this.maxSpeed) {
      this.velocity.normalize().scaleInPlace(this.maxSpeed);
    }

    this.mesh.position.copyFrom(this.position);
    this.acceleration.scaleInPlace(0);

    // Tourne le véhicule pour faire face à la direction du mouvement
    this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);

    // Logique d'arrivée pour la tête du serpent
    let toTarget = box.position.subtract(this.position);
    let distance = toTarget.length();
    let slowRadius = 20;
    let stopRadius = 1.5;
    let maxSpeed = 0.1;

    let speed;
    if (distance < stopRadius) {
      speed = 0;
    } else if (distance < slowRadius) {
      speed = maxSpeed * (distance / slowRadius);
    } else {
      speed = maxSpeed;
    }

    let velocity = toTarget.normalize().scale(speed);
    this.position.addInPlace(velocity);

    // Applique la rotation pour faire face à la direction du mouvement
    //this.mesh.lookAt(box.position);

    // Logique d'arrivée pour les segments du serpent
    let segmentSlowRadius = 10;
    let segmentStopRadius = 2;
    let segmentMaxSpeed = 0.2;
    let desiredSegmentDistance = 2;

    for (let i = 0; i < segments.length; i++) {
      let leader = i === 0 ? this : segments[i - 1];
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

      // Ajuster la rotation pour que le segment regarde vers le leader
      segments[i].lookAt(leader.position);
    }

    // Applique la logique d'évitement des obstacles
    //this.avoid(obstacles);


  }

  seek(target) {
    let desired = target.subtract(this.position); // Vecteur pointant de la position actuelle vers la cible
    let distance = desired.length(); // Calcul de la distance entre le véhicule et la cible

    // Si le véhicule est extrêmement proche de la cible, arrêtez-le complètement
    if (distance < 1) { // La distance d'arrêt peut être ajustée selon le besoin
      this.velocity = BABYLON.Vector3.Zero();
      this.acceleration = BABYLON.Vector3.Zero();
      return; // Arrête l'exécution de la fonction ici
    }

    if (distance < slowDownRadius) {
      // Ajuste la vitesse maximale en fonction de la distance (réduction progressive de la vitesse)
      let m = this.maxSpeed * (distance / slowDownRadius);
      desired = desired.normalize().scale(m);
    } else {
      desired = desired.normalize().scale(this.maxSpeed);
    }

    // Calcul de la force de direction pour ajuster le mouvement du véhicule
    let steer = desired.subtract(this.velocity);

    if (steer.length() > this.maxForce) {
      steer = steer.normalize().scale(this.maxForce);
    }

    this.applyForce(steer);
  }



  avoid(obstacles) {
    let avoidanceForce = new BABYLON.Vector3(0, 0, 0);
    obstacles.forEach(obstacle => {
      let futurePosition = this.position.add(this.velocity); // Prédit la position future du véhicule
      let dir = futurePosition.subtract(obstacle.mesh.position);
      dir.y = 0; // Maintient l'évitement sur le plan horizontal

      let dist = dir.length();
      if (dist < obstacle.safeDistance) {
        // Calcul d'une force d'évitement proportionnelle à la distance à l'obstacle
        let strength = (obstacle.safeDistance - dist) / obstacle.safeDistance;
        dir.normalize().scaleInPlace(strength);
        avoidanceForce.addInPlace(dir);
      }
    });

    if (!avoidanceForce.equals(BABYLON.Vector3.Zero())) {
      avoidanceForce.normalize().scaleInPlace(this.maxForce);
      this.applyForce(avoidanceForce);
    }
  }



  findProjection(pos, a, b) {
    let v1 = a.subtract(pos);
    let v2 = b.subtract(pos);
    let projection = v2.scale(BABYLON.Vector3.Dot(v1, v2) / v2.lengthSquared());
    return pos.add(projection);
  }

  static limit(vector, max) {
    if (vector.length() > max) {
      vector.normalize();
      vector.scaleInPlace(max);
    }
  }
}

window.addEventListener("resize", () => {
  engine.resize();
});
