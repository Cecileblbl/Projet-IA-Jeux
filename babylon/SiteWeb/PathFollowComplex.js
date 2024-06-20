function initializeBehavior5() {
    const groundSize = 100; // La taille du sol
    let vehicle; // Le véhicule
    let segments = []; // Les segments du serpent
    let scene; // La scène
    let camera; // La caméra
    let canvas; // Le canvas
    let engine; // Le moteur

    let path = []; // Chemin complexe

    // Fonction pour démarrer le jeu
    function startGame() {
        canvas = document.querySelector("#canvas5");
        engine = new BABYLON.Engine(canvas, true);

        scene = createScene();

        engine.runRenderLoop(() => {
            scene.render();
        });
    }

    // Fonction pour créer la scène
    const createScene = function() {
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

        // Ajoute une skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // Create the vehicle (cylinder for simplicity)
        vehicle = BABYLON.MeshBuilder.CreateCylinder("vehicle", { diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4 }, scene);
        vehicle.position = new BABYLON.Vector3(0, 2, 0);
        vehicle.direction = new BABYLON.Vector3(1, 0, 0).normalize();
        vehicle.rotation.x = Math.PI / 2;
        vehicle.speed = 0.5; // Increased speed for clarity

        // Création des segments du serpent
        for (let i = 1; i <= 5; i++) {
            let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, { diameter: 1.8 - i * 0.1 }, scene);
            segment.position = new BABYLON.Vector3(vehicle.position.x, vehicle.position.y, vehicle.position.z + i * 2);
            segments.push(segment);
        }

        let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Une couleur de boîte plus vive
        vehicle.material = boxMaterial;

        // Ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
        ground.material = groundMaterial;

        // Caméra arc-rotate
        camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 75, new BABYLON.Vector3(0, 5, 0), scene);
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
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.addShadowCaster(vehicle); // La tête du serpent projette des ombres
        ground.receiveShadows = true; // Le sol reçoit des ombres

        // Create the complex path
        createPath();

        // Add a function to be executed before each render of the scene
        scene.onBeforeRenderObservable.add(() => {
            followPath();
            moveVehicleContinuously();
        });

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

        function followPath() {
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
                vehicle.direction = BABYLON.Vector3.Lerp(vehicle.direction, desiredDirection, 0.3); // Increase lerp factor for quicker turns
            }

            // Debugging visuals
            let debugSphere = scene.getMeshByName("debugSphere");
            if (!debugSphere) {
                debugSphere = BABYLON.MeshBuilder.CreateSphere("debugSphere", { diameter: 0.5 }, scene);
                const debugMaterial = new BABYLON.StandardMaterial("debugMaterial", scene);
                debugMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red for the target point
                debugSphere.material = debugMaterial;
            }
            debugSphere.position = targetPoint;
        }

        function moveVehicleContinuously() {
            let distanceBetweenSegments = 2; // Distance souhaitée entre les segments
            let followSpeed = 0.1; // Vitesse à laquelle les segments suivent la tête ou le segment précédent

            // La tête du serpent suit directement le sol
            vehicle.position.addInPlace(vehicle.direction.scale(vehicle.speed));

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

                vehicle.direction.normalize();
                vehicle.rotation.y = Math.atan2(vehicle.direction.x, vehicle.direction.z);

                // Oriente le segment pour qu'il regarde le leader
                segments[i].lookAt(leader.position);
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

    // Initialisation de la scène et du moteur
    startGame();

    // Ajout de l'événement de redimensionnement
    window.addEventListener("resize", () => {
        engine.resize();
    });
}
