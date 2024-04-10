

window.onload = function () {
  const canvas = document.getElementById("myCanvas");
  const engine = new BABYLON.Engine(canvas, true);

  const createScene = function () {
    let scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

    // Ajoute une skybox
    var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;

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
    shadowGenerator.addShadowCaster(box);
    ground.receiveShadows = true; // Le sol reçoit des ombres

    const projectionDirection = vectorProjection(new BABYLON.Vector3(1, 1, 1), new BABYLON.Vector3(0, 1, 0));

    // Création de la sphère de projection sur le sol
    let projectionSphere = BABYLON.MeshBuilder.CreateSphere("projectionSphere", { diameter: 4 }, scene);
    // Position initiale de la sphère de projection
    projectionSphere.position = new BABYLON.Vector3(-2, 1 + 2, 2);

    // Création initiale de la ligne de projection
    let projectionLine = BABYLON.MeshBuilder.CreateLines("projectionLine", {
      points: [box.position, projectionSphere.position],
      updatable: true
    }, scene);

    // Fonction pour calculer la projection horizontale de la sphère sur le sol
    function calculateHorizontalProjection() {
      // Calcule la position projetée le long de la direction donnée
      let projectedPosition = box.position.add(projectionDirection);
      // Ajuste la hauteur Y pour que la projection soit sur le sol
      projectedPosition.y = 0;

      return projectedPosition;
    }

    // Fonction de projection vectorielle
    function vectorProjection(a, b) {
      const bNorm = b.normalize();
      const scalarProjection = BABYLON.Vector3.Dot(a, bNorm);
      return bNorm.scale(scalarProjection);
    }

    // Fonction de mise à jour de la scène pour ajuster la projection sur le sol
    function updateScene() {
      let projectionPosition = calculateHorizontalProjection();
      projectionSphere.position = projectionPosition;
      projectionLine = BABYLON.MeshBuilder.CreateLines("projectionLine", {
        points: [box.position, projectionSphere.position],
        updatable: true,
        instance: projectionLine
      }, scene);
    }

    // Gestionnaire d'événements pour le déplacement de la sphère mobile
    window.addEventListener("keydown", (event) => {
      // Logique de déplacement de la sphère mobile
      switch (event.key) {
        case "z": box.position.y += 1; break;
        case "s": box.position.y -= 1; break;
        case "q": box.position.x -= 1; break;
        case "d": box.position.x += 1; break;

        case "ArrowUp": box.position.z += 1; break;
        case "ArrowDown": box.position.z -= 1; break;
        case "ArrowLeft": box.position.x -= 1; break;
        case "ArrowRight": box.position.x += 1; break;
      }
      event.preventDefault();
      updateScene();
    });

    return scene;
  };

  const scene = createScene();
  engine.runRenderLoop(() => scene.render());
  window.addEventListener("resize", () => engine.resize());
};
