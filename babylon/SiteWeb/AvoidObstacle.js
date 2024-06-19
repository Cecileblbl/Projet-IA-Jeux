function initializeBehavior3() {
    let canvas;
    let engine;
    let scene;
    let camera;
    let box; // La boule verte
    let inputStates = {}; // États des entrées
    let obstacles = []; // Tableau pour stocker les obstacles
    let slowDownRadius = 10; // Rayon pour ralentir progressivement le véhicule
    let avoidRadius = 10; // Rayon pour éviter les obstacles
    let vehicles = []; // Tableau pour stocker les véhicules (serpents)

    class Vehicle {
        constructor(scene, initialPosition, target) {
            this.scene = scene;
            this.position = initialPosition.clone();
            this.velocity = new BABYLON.Vector3.Zero();
            this.acceleration = new BABYLON.Vector3.Zero();
            this.maxSpeed = 0.2; // Vitesse maximale du véhicule
            this.maxForce = 0.1; // Force maximale appliquée pour changer de direction
            this.target = target;
            this.segments = [];

            let color = getRandomColor();
            let material = new BABYLON.StandardMaterial("vehicleMaterial", scene);
            material.diffuseColor = color;

            this.mesh = BABYLON.MeshBuilder.CreateCylinder("vehicle", {
                diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4
            }, scene);
            this.mesh.position = this.position;
            this.mesh.rotation.x = Math.PI / 2;
            this.mesh.material = material;

            for (let i = 1; i <= 5; i++) {
                let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, { diameter: 1.8 - i * 0.1 }, scene);
                segment.position = new BABYLON.Vector3(this.position.x, this.position.y, this.position.z + i * 2);
                segment.material = material;
                this.segments.push(segment);
            }
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
            this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);

            let prev = this.mesh;
            for (let i = 0; i < this.segments.length; i++) {
                let segment = this.segments[i];
                let toPrev = prev.position.subtract(segment.position);
                let dist = toPrev.length();
                let desiredDist = 2;

                if (dist > desiredDist) {
                    toPrev.normalize().scaleInPlace(dist - desiredDist);
                    segment.position.addInPlace(toPrev);
                }

                this.avoidObstacle(segment);

                segment.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(
                    BABYLON.Matrix.LookAtLH(segment.position, prev.position, BABYLON.Vector3.Up())
                );

                prev = segment;
            }
        }

        seek(target) {
            let desired = target.subtract(this.position);
            let dist = desired.length();
            if (dist < 1) {
                this.velocity = BABYLON.Vector3.Zero();
                this.acceleration = BABYLON.Vector3.Zero();
                return;
            }
            if (dist < slowDownRadius) {
                desired = desired.normalize().scale(this.maxSpeed * (dist / slowDownRadius));
            } else {
                desired = desired.normalize().scale(this.maxSpeed);
            }
            let steer = desired.subtract(this.velocity);
            if (steer.length() > this.maxForce) {
                steer = steer.normalize().scale(this.maxForce);
            }
            this.applyForce(steer);
        }

        avoid(obstacles) {
            let avoidanceForce = new BABYLON.Vector3(0, 0, 0);
            obstacles.forEach(obstacle => {
                let futurePosition = this.position.add(this.velocity);
                let dir = futurePosition.subtract(obstacle.mesh.position);
                dir.y = 0;
                let dist = dir.length();
                if (dist < obstacle.safeDistance) {
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

        avoidObstacle(segment) {
            let avoidanceForce = new BABYLON.Vector3(0, 0, 0);
            obstacles.forEach(obstacle => {
                let dir = segment.position.subtract(obstacle.mesh.position);
                dir.y = 0;
                let dist = dir.length();
                if (dist < obstacle.safeDistance) {
                    let strength = (obstacle.safeDistance - dist) / obstacle.safeDistance;
                    dir.normalize().scaleInPlace(strength);
                    avoidanceForce.addInPlace(dir);
                }
            });
            if (!avoidanceForce.equals(BABYLON.Vector3.Zero())) {
                avoidanceForce.normalize().scaleInPlace(this.maxForce / 10); // Moins de force pour les segments
                segment.position.addInPlace(avoidanceForce);
            }
        }
    }

    function createVehicle(initialPosition) {
        let newVehicle = new Vehicle(scene, initialPosition, box.position);
        vehicles.push(newVehicle);
    }

    function createScene() {
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

        // Ajoute une skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        box = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: 4 }, scene);
        box.position = new BABYLON.Vector3(-2, 2, 2);
        let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
        box.material = boxMaterial;

        // Ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
        ground.material = groundMaterial;

        // Caméra arc-rotate
        camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 75, new BABYLON.Vector3(0, 5, 0), scene);
        camera.attachControl(canvas, true);
        camera.keysUp = [];
        camera.keysDown = [];
        camera.keysLeft = [];
        camera.keysRight = [];
        camera.fov = 1.5;

        // Ajout d'un effet de post-processing (glow effect)
        var glow = new BABYLON.GlowLayer("glow", scene);
        glow.intensity = 0.3;

        // Améliore l'éclairage
        let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(20, 40, 20);
        light.intensity = 0.7;

        // Ajout d'une lumière ambiante
        var ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
        ambientLight.intensity = 0.3;

        // Activer les ombres
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.addShadowCaster(box); // La sphère projette des ombres
        ground.receiveShadows = true; // Le sol reçoit des ombres

        return scene;
    }

    function createObstacles() {
        for (let i = 0; i < 15; i++) {
            let size = Math.random() * 2 + 2; // Taille aléatoire entre 2 et 4
            let obstacle = BABYLON.MeshBuilder.CreateBox("obstacle", { size: size }, scene);
            let xPosition = Math.random() * 80 - 40; // Position aléatoire sur X
            let zPosition = Math.random() * 80 - 40; // Position aléatoire sur Z
            obstacle.position = new BABYLON.Vector3(xPosition, size / 2, zPosition);
            let obstacleMaterial = new BABYLON.StandardMaterial("obstacleMat", scene);
            obstacleMaterial.diffuseColor = getRandomColor(); // Couleur aléatoire
            obstacle.material = obstacleMaterial;

            // Ajouter l'obstacle à la liste des obstacles avec une distance de sécurité
            obstacles.push({ mesh: obstacle, safeDistance: size / 2 + 3 });
        }
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
            if (pickResult.hit && pickResult.pickedMesh.name === "ground") {
                let size = 4; // Taille fixe pour les nouveaux obstacles
                let newObstacle = BABYLON.MeshBuilder.CreateBox("newObstacle", { size: size }, scene);
                newObstacle.position = pickResult.pickedPoint.add(new BABYLON.Vector3(0, size / 2, 0));
                let obstacleMaterial = new BABYLON.StandardMaterial("newObstacleMat", scene);
                obstacleMaterial.diffuseColor = getRandomColor(); // Couleur aléatoire
                newObstacle.material = obstacleMaterial;
                obstacles.push({ mesh: newObstacle, safeDistance: size / 2 + 3 });
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
                    if (event.key === "t" || event.key === "T") {
                        let initialPosition = new BABYLON.Vector3(Math.random() * 40 - 20, 2, Math.random() * 40 - 20);
                        createVehicle(initialPosition);
                    }
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
                case "t":
                case "T":
                    inputStates.t = false;
                    break;
            }
            event.preventDefault();
        }, false);
    }

    function getRandomColor() {
        return new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }

    canvas = document.getElementById("canvas3");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();
    createObstacles(); // Créer des obstacles initiaux

    createVehicle(new BABYLON.Vector3(0, 2, -10));

    modifySettings(); // Configurer les entrées

    engine.runRenderLoop(() => {
        moveBox();
        vehicles.forEach(vehicle => {
            vehicle.seek(box.position);
            vehicle.avoid(obstacles);
            vehicle.update();
        });
        scene.render();
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}
