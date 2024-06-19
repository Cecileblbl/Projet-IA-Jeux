function initializeBehavior7() {
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
    let serpents = []; // Liste des serpents
    let inputStates = {}; // États d'entrée

    // Fonction pour démarrer le jeu
    function startGame() {
        canvas = document.querySelector("#canvas7");
        engine = new BABYLON.Engine(canvas, true);
        scene = createScene();

        engine.runRenderLoop(() => {
            moveBoxContinuously(); // Déplace le cube continuellement
            updateSphere(); // Met à jour la position de la sphère pour poursuivre le cube
            if (isSphereCloseToBox() || serpents.some(isSerpentCloseToBox)) {
                resetBoxPosition(); // Réinitialise la position du cube si la sphère est proche
                resetSpherePosition(); // Réinitialise la position de la sphère
                resetSegmentsPosition(); // Réinitialise la position des segments du serpent
                resetSerpentPosition(); // Réinitialise la position du serpent
            }
            updateScene(); // Met à jour la position des serpents
            modifySettings(); // Modifie les paramètres de la scène
            scene.render();
        });
    }

    function createScene() {
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

        // Ajoute une skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;

        // Pyramid
        sphere = BABYLON.MeshBuilder.CreateCylinder("myPyramid", { diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4 }, scene);
        sphere.position = new BABYLON.Vector3(0, 1 + 2, 0);
        sphere.rotation.x = Math.PI / 2;

        // Boule cible
        box = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: 4 }, scene);
        box.position = new BABYLON.Vector3(-2, 1 + 2, 2);
        let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Une couleur de boîte plus vive
        box.material = boxMaterial;

        // Ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
        ground.material = groundMaterial;

        // Caméra arc-rotate
        camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 75, new BABYLON.Vector3(0, 5, 0), scene);
        camera.attachControl(canvas, true);

        // Configuration pour éviter le mouvement de la caméra avec les flèches du clavier
        camera.keysUp = [];
        camera.keysDown = [];
        camera.keysLeft = [];
        camera.keysRight = [];

        // Ajustement du champ de vision
        camera.fov = 1.5;

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
        shadowGenerator.addShadowCaster(sphere); // La sphère projette des ombres
        ground.receiveShadows = true; // Le sol reçoit des ombres

        // Création des segments du serpent
        for (let i = 1; i <= 5; i++) {
            let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, { diameter: 1.8 - i * 0.1 }, scene);
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

    function isSerpentCloseToBox(serpent) {
        // Vérifie si la tête du serpent est proche du cube
        return serpent.head.position.subtract(box.position).length() < 3; // Seuil de proximité
    }

    function resetBoxPosition() {
        box.position.x = Math.random() * groundSize - groundSize / 2;
        box.position.z = Math.random() * groundSize - groundSize / 2;
        boxDirection = new BABYLON.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize(); // Réinitialise la direction
    }

    function resetSpherePosition() {
        sphere.position = new BABYLON.Vector3(0, 1, 0); // Placer la sphère au centre
    }

    function resetSegmentsPosition() {
        // Parcour chaque segment
        for (let i = 0; i < segments.length; i++) {
            // Place le segment à la position de la tête du serpent
            segments[i].position = new BABYLON.Vector3(sphere.position.x, sphere.position.y, sphere.position.z + (i + 1) * 2);
        }
    }

    function resetSerpentPosition() {
        // Parcour chaque serpent
        for (let serpent of serpents) {
            // Place la tête du serpent au centre
            serpent.head.position = new BABYLON.Vector3(0, 1 + 2, 0);
            // Place les segments du serpent à la position de la tête
            for (let i = 0; i < serpent.segments.length; i++) {
                serpent.segments[i].position = new BABYLON.Vector3(serpent.head.position.x, serpent.head.position.y, serpent.head.position.z + (i + 1) * 2);
            }
        }
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
                case "t":
                case "T":
                    if (!inputStates.t) {  // Empêche la création multiple si la touche reste enfoncée
                        inputStates.t = true;
                        createSerpent();  // Créer un serpent quand la touche 'T' est pressée
                    }
                    break;
            }
            event.preventDefault();  // Empêche les actions par défaut des touches
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
                    inputStates.t = false;  // Réinitialiser l'état lorsque la touche est relâchée
                    break;
            }
            event.preventDefault();
        }, false);
    }

    function getRandomColor() {
        // Générer des composantes de couleur RGB aléatoires
        return new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }

    function createSerpent() {
        const offsetAngle = Math.random() * Math.PI * 2; // Angle aléatoire pour la dispersion
        const offsetDistance = 10; // Distance fixe du centre

        // Position initiale basée sur un décalage circulaire autour de la balle
        let initialX = box.position.x + offsetDistance * Math.cos(offsetAngle);
        let initialZ = box.position.z + offsetDistance * Math.sin(offsetAngle);

        // Création de la tête du serpent avec une couleur aléatoire
        let head = BABYLON.MeshBuilder.CreateCylinder("head" + serpents.length, {
            diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4
        }, scene);
        head.position = new BABYLON.Vector3(initialX, 1 + 2, initialZ);
        head.rotation.x = Math.PI / 2;
        let headMaterial = new BABYLON.StandardMaterial("headMat" + serpents.length, scene);
        headMaterial.diffuseColor = getRandomColor();
        head.material = headMaterial;

        let segments = [];
        // Création des segments du serpent
        for (let i = 1; i <= 5; i++) {
            let segment = BABYLON.MeshBuilder.CreateSphere(`segment${i}`, { diameter: 1.8 - i * 0.1 }, scene);
            segment.position = new BABYLON.Vector3(head.position.x, head.position.y, head.position.z + i * 2);
            segment.material = headMaterial;  // Utiliser la même couleur que la tête pour tout le corps
            segments.push(segment);
        }

        // Ajoute le nouveau serpent à la liste des serpents avec une vitesse de suivi variée
        serpents.push({
            head: head,
            segments: segments,
            followSpeed: 0.05 + Math.random() * 0.1  // Vitesse de suivi aléatoire entre 0.05 et 0.15
        });
    }

    function updateScene() {
        serpents.forEach(serpent => {
            updateSerpent(serpent);
        });
    }

    function updateSerpent(serpent) {
        let speed = 0.3; // Vitesse de déplacement de la tête du serpent

        // Calcule la direction de la tête du serpent pour poursuivre la boîte
        let direction = box.position.subtract(serpent.head.position).normalize().scale(speed);
        serpent.head.position.addInPlace(direction);
        serpent.head.rotation.y = Math.atan2(direction.x, direction.z);

        let followSpeed = 0.1; // Vitesse à laquelle les segments suivent la tête ou le segment précédent
        let distanceBetweenSegments = 2; // Distance souhaitée entre les segments

        // Mise à jour de la position des segments pour suivre la tête ou le segment précédent
        for (let i = 0; i < serpent.segments.length; i++) {
            let leader = i === 0 ? serpent.head : serpent.segments[i - 1]; // Le leader est soit la tête soit le segment précédent
            let leaderPos = leader.position;

            // Calcule la direction et la distance idéale du segment actuel vers son leader
            let directionToLeader = leaderPos.subtract(serpent.segments[i].position).normalize();
            let desiredPosition = leaderPos.subtract(directionToLeader.scale(distanceBetweenSegments));

            // Calcule le vecteur de déplacement nécessaire pour atteindre la position idéale
            let moveVector = desiredPosition.subtract(serpent.segments[i].position).scale(followSpeed);
            serpent.segments[i].position.addInPlace(moveVector);

            // Oriente chaque segment pour regarder vers son leader
            serpent.segments[i].lookAt(leader.position);
        }
    }

    // Initialisation de la scène et du moteur
    startGame();

    // Ajout de l'événement de redimensionnement
    window.addEventListener("resize", () => {
        engine.resize();
    });
}
