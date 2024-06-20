function initializeBehavior1() {
    let canvas;
    let engine;
    let scene;
    let camera;
    let box;
    let sphere;
    let inputStates = {}; // Objet pour stocker les états des entrées
    let segments = []; // Tableau pour stocker les segments du serpent
    let serpents = []; // Tableau pour stocker les serpents

    canvas = document.getElementById("canvas1");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    modifySettings(); // Initialiser les écouteurs d'événements pour le déplacement et le verrouillage du pointeur

    engine.runRenderLoop(() => {
        moveBox(); // Déplacer le cube en fonction des entrées
        updateSphere(); // Mettre à jour la position de la sphère pour suivre le cube
        updateScene(); // Mettre à jour les serpents
        scene.render();
    });

    function createScene() {
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

        // Ajoute une skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:500}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // Pyramid
        sphere = BABYLON.MeshBuilder.CreateCylinder("myPyramid", {diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4}, scene);
        sphere.position = new BABYLON.Vector3(0, 2, 0);
        sphere.rotation.x = Math.PI / 2;

        // Movable sphere with direction keys
        box = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameter: 4}, scene);
        box.position = new BABYLON.Vector3(-2, 3, 2);
        let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2);
        box.material = boxMaterial;

        // Ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1);
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
        shadowGenerator.addShadowCaster(sphere);
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
                    if (!inputStates.t) {
                        inputStates.t = true;
                        createSerpent();
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

    function moveBox() {
        let groundSize = 100;
        let halfGroundSize = groundSize / 2;
        let boxSize = 2;
        let halfBoxSize = boxSize / 2;
        let moveSpeed = 0.3;

        if (inputStates.left && box.position.x - halfBoxSize > -halfGroundSize) box.position.x -= moveSpeed;
        if (inputStates.right && box.position.x + halfBoxSize < halfGroundSize) box.position.x += moveSpeed;
        if (inputStates.up && box.position.z - halfBoxSize > -halfGroundSize) box.position.z -= moveSpeed;
        if (inputStates.down && box.position.z + halfBoxSize < halfGroundSize) box.position.z += moveSpeed;
    }

    function updateSphere() {
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

            if (segmentDistance < desiredSegmentDistance) {
                let moveAway = toLeader.normalize().scale(desiredSegmentDistance - segmentDistance);
                segments[i].position.subtractInPlace(moveAway);
            }

            segments[i].lookAt(leader.position);
        }
    }

    function updateScene() {
        serpents.forEach(serpent => {
            updateSerpent(serpent);
        });
    }

    function updateSerpent(serpent) {
        let slowRadius = 20;
        let stopRadius = 1.5;
        let maxSpeed = 0.2;
        let toTarget = box.position.subtract(serpent.head.position);
        let distance = toTarget.length();
        let speed = maxSpeed;

        if (distance < stopRadius) {
            speed = 0;
        } else if (distance < slowRadius) {
            speed = maxSpeed * (distance / slowRadius);
        }

        let velocity = toTarget.normalize().scale(speed);
        serpent.head.position.addInPlace(velocity);
        serpent.head.rotation.y = Math.atan2(toTarget.x, toTarget.z);

        let segmentSlowRadius = 10;
        let segmentStopRadius = 2;
        let segmentMaxSpeed = 0.2;
        let desiredSegmentDistance = 2;

        for (let i = 0; i < serpent.segments.length; i++) {
            let leader = i === 0 ? serpent.head : serpent.segments[i - 1];
            let toLeader = leader.position.subtract(serpent.segments[i].position);
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
            serpent.segments[i].position.addInPlace(segmentVelocity);

            if (segmentDistance < desiredSegmentDistance) {
                let moveAway = toLeader.normalize().scale(desiredSegmentDistance - segmentDistance);
                serpent.segments[i].position.subtractInPlace(moveAway);
            }

            serpent.segments[i].lookAt(leader.position);
        }
    }

    function getRandomColor() {
        return new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }

    function createSerpent() {
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetDistance = 10;
        let initialX = box.position.x + offsetDistance * Math.cos(offsetAngle);
        let initialZ = box.position.z + offsetDistance * Math.sin(offsetAngle);

        let head = BABYLON.MeshBuilder.CreateCylinder("head" + serpents.length, {
            diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4
        }, scene);
        head.position = new BABYLON.Vector3(initialX, 3, initialZ);
        head.rotation.x = Math.PI / 2;
        let headMaterial = new BABYLON.StandardMaterial("headMat" + serpents.length, scene);
        headMaterial.diffuseColor = getRandomColor();
        head.material = headMaterial;

        let segments = [];
        for (let i = 1; i <= 5; i++) {
            let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, {diameter: 1.8 - i * 0.1}, scene);
            segment.position = new BABYLON.Vector3(head.position.x, head.position.y, head.position.z + i * 2);
            segment.material = headMaterial;
            segments.push(segment);
        }

        serpents.push({
            head: head,
            segments: segments,
            followSpeed: 0.05 + Math.random() * 0.1
        });
    }

    window.addEventListener("resize", () => {
        engine.resize();
    });
}
