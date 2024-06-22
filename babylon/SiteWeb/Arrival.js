function initializeBehavior1() {
    let canvas;
    let engine;
    let scene;
    let camera;
    let box;
    let inputStates = {}; // Object to store input states
    let serpents = []; // Array to store all serpents
    let debugMode = false; // To toggle debug circles

    window.onload = startGame;

    function startGame() {
        canvas = document.querySelector("#canvas1");
        engine = new BABYLON.Engine(canvas, true);
        scene = createScene();

        modifySettings(); // Initialize event listeners for movement and pointer lock

        createSerpent(); // Create the first serpent at the start of the game

        engine.runRenderLoop(() => {
            moveBox(); // Move the box based on input
            updateScene(); // Update all serpents
            scene.render();
        });
    }

    function createScene() {
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Light blue background color

        // Add a skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 500 }, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // Movable box with direction keys
        box = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: 4 }, scene);
        box.position = new BABYLON.Vector3(-2, 3, 2);
        let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2);
        box.material = boxMaterial;

        // Ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1);
        ground.material = groundMaterial;

        // Arc rotate camera
        camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 75, new BABYLON.Vector3(0, 5, 0), scene);
        camera.attachControl(canvas, true);

        // Disable camera movement with arrow keys
        camera.keysUp = [];
        camera.keysDown = [];
        camera.keysLeft = [];
        camera.keysRight = [];

        // Adjust field of view
        camera.fov = 1.5;

        // Add glow effect
        var glow = new BABYLON.GlowLayer("glow", scene);
        glow.intensity = 0.3;

        // Improve lighting
        let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(20, 40, 20);
        light.intensity = 0.7;

        // Add ambient light to brighten shaded areas
        var ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
        ambientLight.intensity = 0.3;

        // Enable shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        ground.receiveShadows = true;

        return scene;
    }

    function modifySettings() {
        scene.onPointerDown = () => {
            if (!scene.alreadyLocked) {
                canvas.requestPointerLock();
            }
        };

        document.addEventListener("pointerlockchange", () => {
            let element = document.pointerLockElement || null;
            scene.alreadyLocked = !!element;
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
                case "x":
                case "X":
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
                case "d":
                case "D":
                    debugMode = !debugMode;
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
                case "x":
                case "X":
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

        let moveSpeed = 0.5;

        if (inputStates.left && box.position.x - halfBoxSize > -halfGroundSize) box.position.x -= moveSpeed;
        if (inputStates.right && box.position.x + halfBoxSize < halfGroundSize) box.position.x += moveSpeed;
        if (inputStates.up && box.position.z - halfBoxSize > -halfGroundSize) box.position.z -= moveSpeed;
        if (inputStates.down && box.position.z + halfBoxSize < halfGroundSize) box.position.z += moveSpeed;
    }

    function updateScene() {
        serpents.forEach((serpent, index) => {
            if (index === 0) {
                updateSerpent(serpent, box);
            } else {
                updateSerpent(serpent, serpents[index - 1].head);
            }
        });
    }

    function updateSerpent(serpent, target) {
        let slowRadius = 10;
        let stopRadius = 4;
        let maxSpeed = 0.2;

        let toTarget = target.position.subtract(serpent.head.position);
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

        let segmentSlowRadius = 2;
        let segmentStopRadius = 1;
        let segmentMaxSpeed = 1.0;
        let desiredSegmentDistance = 3;

        for (let i = 0; i < serpent.segments.length; i++) {
            let leader = i === 0 ? serpent.head : serpent.segments[i - 1];
            let toLeader = leader.position.subtract(serpent.segments[i].position);
            let segmentDistance = toLeader.length();
            let segmentSpeed;
            if (segmentDistance < segmentStopRadius) {
                segmentSpeed = 0;
                serpent.segments[i].isVisible = false; // Hide segment
            } else if (segmentDistance < segmentSlowRadius) {
                segmentSpeed = segmentMaxSpeed * (segmentDistance / segmentSlowRadius);
                serpent.segments[i].isVisible = true; // Show segment
            } else {
                segmentSpeed = segmentMaxSpeed;
                serpent.segments[i].isVisible = true; // Show segment
            }

            let segmentVelocity = toLeader.normalize().scale(segmentSpeed);
            serpent.segments[i].position.addInPlace(segmentVelocity);

            if (segmentDistance < desiredSegmentDistance) {
                let moveAway = toLeader.normalize().scale(desiredSegmentDistance - segmentDistance);
                serpent.segments[i].position.subtractInPlace(moveAway);
            }

            serpent.segments[i].lookAt(leader.position);

            // Draw debug circles if in debug mode
            if (debugMode && i === 0) {
                drawDebugCircle(serpent.segments[i], segmentSlowRadius);
            }

            if (speed === 0) {
                serpent.segments[i].isVisible = false;
            } else {
                serpent.segments[i].isVisible = true;
            }

        }

        if (debugMode) {
            drawDebugCircle(serpent.head, slowRadius);
        }
    }

    function drawDebugCircle(mesh, radius) {
        let circle = BABYLON.MeshBuilder.CreateDisc(`circle${mesh.name}`, { radius: radius / 2, tessellation: 30 }, scene);
        circle.position = new BABYLON.Vector3(mesh.position.x, 0.1, mesh.position.z);
        circle.rotation.x = Math.PI / 2;
        let circleMaterial = new BABYLON.StandardMaterial(`circleMat${mesh.name}`, scene);
        circleMaterial.alpha = 0.1;
        circle.material = circleMaterial;

        setTimeout(() => {
            circle.dispose();
        }, 100); // Dispose of the circle after 100ms to create a flicker effect
    }

    function getRandomColor() {
        return new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }

    function createSerpent() {
        const offsetAngle = Math.random() * Math.PI * 2;
        const offsetDistance = 20;

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
            let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, { diameter: 1.8 - i * 0.1 }, scene);
            segment.position = new BABYLON.Vector3(head.position.x, head.position.y, head.position.z + i * 2);
            segment.material = headMaterial;
            segments.push(segment);
        }

        serpents.push({
            head: head,
            segments: segments,
            followSpeed: 0.1 + Math.random() * 0.1
        });
    }

    startGame();

    window.addEventListener("resize", () => {
        engine.resize();
    });

}
