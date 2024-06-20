function initializeBehavior9() {
    let canvas;
    let engine;
    let scene;
    let camera;
    let vehicles = []; // Tableau pour stocker nos véhicules

    class Vehicle {
        constructor(scene, position) {
            this.scene = scene;
            // Initialiser la position du véhicule
            this.position = new BABYLON.Vector3(position.x, position.y, position.z);
            // Définir une vélocité initiale aléatoire
            this.velocity = new BABYLON.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize();
            // Définir la vitesse de déplacement du véhicule
            this.speed = 0.09;
            // Angle utilisé pour le comportement wander
            this.wanderAngle = 3;

            // Couleur aléatoire pour chaque véhicule
            let color = getRandomColor();

            // Matériel avec couleur aléatoire
            let material = new BABYLON.StandardMaterial("vehicleMaterial", scene);
            material.diffuseColor = color;

            // Créer la représentation graphique du véhicule
            this.mesh = BABYLON.MeshBuilder.CreateCylinder("vehicle", {
                diameterTop: 0, diameterBottom: 4, height: 4, tessellation: 4
            }, this.scene);

            this.mesh.position = this.position;
            // Orienter la pyramide pour qu'elle ressemble à une flèche
            this.mesh.rotation.x = Math.PI / 2;

            this.mesh.material = material; // Appliquer le matériau

            // Activer ou désactiver le mode de débogage
            this.debugMode = false;
            // Paramètres pour le comportement wander
            this.wanderCircleRadius = 3; // Rayon du cercle de wander
            this.wanderCircleDistance = 5; // Distance du cercle devant le véhicule

            // Créer la sphère cible pour visualiser le point cible du wander
            this.wanderTargetMesh = BABYLON.MeshBuilder.CreateSphere("wanderTarget", { diameter: 1 }, this.scene);
            this.wanderTargetMesh.isVisible = this.debugMode; // Visible seulement en mode débogage

            // Créer un cercle pour visualiser le chemin de wander
            this.wanderCircleMesh = BABYLON.MeshBuilder.CreateTorus("wanderCircle", {
                diameter: this.wanderCircleRadius * 2,
                thickness: 0.1
            }, this.scene);
            this.wanderCircleMesh.isVisible = this.debugMode; // Visible seulement en mode débogage

            // Créer une ligne pour connecter le véhicule au point cible du wander
            this.wanderLineMesh = BABYLON.MeshBuilder.CreateLines("wanderLine", {
                points: [this.position, this.position],
                updatable: true
            }, this.scene);
            this.wanderLineMesh.isVisible = this.debugMode; // Visible seulement en mode débogage
            this.wanderLineMesh.color = new BABYLON.Color3(0, 0, 0); // Couleur noire pour la ligne
        }

        toggleDebugMode() {
            this.debugMode = !this.debugMode;
            this.wanderTargetMesh.isVisible = this.debugMode;
            this.wanderCircleMesh.isVisible = this.debugMode;
            this.wanderLineMesh.isVisible = this.debugMode;
        }

        wander() {
            let change = 0.6; // Variation maximale de l'angle
            this.wanderAngle += (Math.random() * 2 * change - change); // Changement aléatoire de l'angle

            // Calcul du centre du cercle de wander devant le véhicule
            let circleCenter = this.velocity.clone().normalize().scale(this.wanderCircleDistance).add(this.position);

            // Calcul du point cible de wander sur le cercle
            let wanderTargetX = circleCenter.x + this.wanderCircleRadius * Math.cos(this.wanderAngle);
            let wanderTargetZ = circleCenter.z + this.wanderCircleRadius * Math.sin(this.wanderAngle);
            let wanderTargetPosition = new BABYLON.Vector3(wanderTargetX, this.position.y, wanderTargetZ);

            // Mise à jour de la position de la sphère cible de wander
            this.wanderTargetMesh.position = wanderTargetPosition;
            // Visualisation optionnelle en mode debug
            this.wanderTargetMesh.isVisible = this.debugMode;

            // Mise à jour de la position du cercle de wander pour visualisation
            this.wanderCircleMesh.position = circleCenter;
            // Visualisation optionnelle en mode debug
            this.wanderCircleMesh.isVisible = this.debugMode;

            // Mise à jour des points de la ligne, réutilisation ou création si nécessaire
            if (!this.wanderLineMesh) {
                // Création d'une ligne si elle n'existe pas déjà
                this.wanderLineMesh = BABYLON.MeshBuilder.CreateLines("wanderLine", {
                    points: [this.position, wanderTargetPosition],
                    updatable: true
                }, this.scene);
                this.wanderLineMesh.color = new BABYLON.Color3(0, 0, 0); // Définition de la couleur de la ligne
            } else {
                // Mise à jour de la ligne existante
                BABYLON.MeshBuilder.CreateLines("wanderLine", {
                    points: [this.position, wanderTargetPosition],
                    instance: this.wanderLineMesh
                });
            }
            this.wanderLineMesh.isVisible = this.debugMode; // Visualisation optionnelle en mode debug

            // Calcul de la direction vers le point cible et mise à jour de la vélocité
            let directionToTarget = wanderTargetPosition.subtract(this.position);
            this.velocity = directionToTarget.scale(this.speed);
        }

        update() {
            // Met à jour la position du véhicule en fonction de sa vélocité
            this.position.addInPlace(this.velocity);
            this.mesh.position = this.position;

            this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);

            // Gère les limites de l'espace de déplacement
            this.edges();
        }

        edges() {
            const groundSize = 100; // Utilisation de `const` pour les valeurs qui ne changent pas
            const halfGroundSize = groundSize / 2;
            const edgeBuffer = 1; // Tampon pour prévenir la sortie visuelle du véhicule de la zone de jeu

            // Vérification et gestion des bords sur l'axe X
            if (this.position.x > halfGroundSize - edgeBuffer) {
                this.position.x = halfGroundSize - edgeBuffer;
                this.velocity.x *= -1; // Inversement de la direction horizontalement pour "rebondir"
            } else if (this.position.x < -halfGroundSize + edgeBuffer) {
                this.position.x = -halfGroundSize + edgeBuffer;
                this.velocity.x *= -1;
            }

            // Vérification et gestion des bords sur l'axe Z
            if (this.position.z > halfGroundSize - edgeBuffer) {
                this.position.z = halfGroundSize - edgeBuffer;
                this.velocity.z *= -1; // Inversement de la direction verticalement pour "rebondir"
            } else if (this.position.z < -halfGroundSize + edgeBuffer) {
                this.position.z = -halfGroundSize + edgeBuffer;
                this.velocity.z *= -1;
            }
        }
    }

    function addVehicles(count) {
        for (let i = 0; i < count; i++) {
            let vehicle = new Vehicle(scene, {
                x: Math.random() * 40 - 20, // Valeurs aléatoires entre -20 et 20
                y: 1,
                z: Math.random() * 40 - 20,
            });
            vehicles.push(vehicle);
        }
    }

    function getRandomColor() {
        // Générer des composantes de couleur RGB aléatoires
        return new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }

    function createScene() {
        let scene = new BABYLON.Scene(engine);
        scene.clearColor = new BABYLON.Color3(0.8, 0.9, 1); // Couleur de fond bleu clair

        // Ajoute une skybox
        var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, scene);
        var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
        skyboxMaterial.diffuseTexture = new BABYLON.Texture("img/Wallv1.jpg");
        skyboxMaterial.backFaceCulling = false;
        //skyboxMaterial.diffuseColor = new BABYLON.Color3(0.9, 0.5, 0.3);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;

        // Ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
        //groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1); // Un sol plus clair et plus accueillant
        ground.material = groundMaterial;

        // Caméra arc-rotate
        camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 100, new BABYLON.Vector3(0, 5, 0), scene);
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

        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        ground.receiveShadows = true; // Le sol reçoit des ombres

        return scene;
    }

    canvas = document.getElementById("canvas9");
    engine = new BABYLON.Engine(canvas, true);

    scene = createScene();

    // Ajout des véhicules
    addVehicles(25);

    engine.runRenderLoop(() => {
        vehicles.forEach(vehicle => {
            vehicle.wander(); // Appliquer le comportement d'errance
            vehicle.update(); // Mettre à jour la position en fonction de la vitesse et de la direction
        });
        scene.render();
    });

    window.addEventListener('keydown', function(event) {
        if (event.key === 'd' || event.key === 'D') {
            vehicles.forEach(vehicle => {
                vehicle.toggleDebugMode();
            });
        }
    });

    window.addEventListener("resize", () => {
        engine.resize();
    });
}
