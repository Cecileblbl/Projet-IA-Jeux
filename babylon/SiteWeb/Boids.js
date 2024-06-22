function initializeBehavior2() {
    let canvas;
    let engine;
    let scene;
    let boids = [];
    let groundSize = 100; // Assuming the ground is a 100x100 square
    const MIN_SPEED = 0.2; // Minimum speed to ensure boids are always moving

    // Get sliders
    let alignSlider = document.getElementById("alignSlider");
    let cohesionSlider = document.getElementById("cohesionSlider");
    let separationSlider = document.getElementById("separationSlider");

    // Ensure sliders are not null
    if (!alignSlider || !cohesionSlider || !separationSlider) {
        console.error("Sliders not found");
        return;
    }

    // Fonction pour limiter la magnitude d'un vecteur
    BABYLON.Vector3.prototype.limit = function (max) {
        if (this.length() > max) {
            this.normalize().scaleInPlace(max);
        }
    };

    class Boid {
        constructor(scene) {
            this.scene = scene;
            this.position = new BABYLON.Vector3(Math.random() * groundSize - groundSize / 2, 1, Math.random() * groundSize - groundSize / 2);
            this.velocity = new BABYLON.Vector3(Math.random() * 2 - 1, 0, Math.random() * 2 - 1);
            this.velocity.normalize().scaleInPlace(Math.random() * 1 + 1); // Reduced speed
            this.acceleration = new BABYLON.Vector3();
            this.maxForce = 0.5; // Reduced force
            this.maxSpeed = 1; // Reduced max speed

            // Create a mesh for the boid
            this.mesh = BABYLON.MeshBuilder.CreateSphere("boid", { diameter: 1 }, scene);
            this.mesh.position = this.position.clone();
        }

        edges() {
            if (this.position.x > groundSize / 2) this.position.x = groundSize / 2;
            else if (this.position.x < -groundSize / 2) this.position.x = -groundSize / 2;

            if (this.position.z > groundSize / 2) this.position.z = groundSize / 2;
            else if (this.position.z < -groundSize / 2) this.position.z = -groundSize / 2;
        }

        align(boids) {
            let perceptionRadius = 25;
            let steering = new BABYLON.Vector3();
            let total = 0;
            for (let other of boids) {
                let d = BABYLON.Vector3.Distance(this.position, other.position);
                if (other !== this && d < perceptionRadius) {
                    steering.addInPlace(other.velocity);
                    total++;
                }
            }
            if (total > 0) {
                steering.scaleInPlace(1 / total);
                steering.normalize().scaleInPlace(this.maxSpeed);
                steering.subtractInPlace(this.velocity);
                steering.limit(this.maxForce);
            }
            return steering;
        }

        separation(boids) {
            let perceptionRadius = 25;
            let steering = new BABYLON.Vector3();
            let total = 0;
            for (let other of boids) {
                let d = BABYLON.Vector3.Distance(this.position, other.position);
                if (other !== this && d < perceptionRadius) {
                    let diff = this.position.subtract(other.position);
                    diff.scaleInPlace(1 / (d * d));
                    steering.addInPlace(diff);
                    total++;
                }
            }
            if (total > 0) {
                steering.scaleInPlace(1 / total);
                steering.normalize().scaleInPlace(this.maxSpeed);
                steering.subtractInPlace(this.velocity);
                steering.limit(this.maxForce);
            }
            return steering;
        }

        cohesion(boids) {
            let perceptionRadius = 25;
            let steering = new BABYLON.Vector3();
            let total = 0;
            for (let other of boids) {
                let d = BABYLON.Vector3.Distance(this.position, other.position);
                if (other !== this && d < perceptionRadius) {
                    steering.addInPlace(other.position);
                    total++;
                }
            }
            if (total > 0) {
                steering.scaleInPlace(1 / total);
                steering.subtractInPlace(this.position);
                steering.normalize().scaleInPlace(this.maxSpeed);
                steering.subtractInPlace(this.velocity);
                steering.limit(this.maxForce);
            }
            return steering;
        }

        flock(boids) {
            let alignment = this.align(boids).scaleInPlace(parseFloat(alignSlider.value));
            let cohesion = this.cohesion(boids).scaleInPlace(parseFloat(cohesionSlider.value));
            let separation = this.separation(boids).scaleInPlace(parseFloat(separationSlider.value));

            this.acceleration.addInPlace(alignment);
            this.acceleration.addInPlace(cohesion);
            this.acceleration.addInPlace(separation);
        }

        update() {
            this.velocity.addInPlace(this.acceleration);
            this.velocity.limit(this.maxSpeed);

            // Ensure the boid has a minimum speed
            if (this.velocity.length() < MIN_SPEED) {
                this.velocity.normalize().scaleInPlace(MIN_SPEED);
            }

            this.position.addInPlace(this.velocity);
            this.acceleration.scaleInPlace(0);

            this.position.y = 1; // Keep the boid on the ground at a constant height

            this.edges();

            this.mesh.position = this.position.clone();
        }
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
        skybox.material = skyboxMaterial;

        // Ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", { width: groundSize, height: groundSize }, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
        ground.material = groundMaterial;

        // Caméra arc-rotate
        let camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 75, new BABYLON.Vector3(0, 5, 0), scene);
        camera.attachControl(canvas, true);
        camera.keysUp = [];
        camera.keysDown = [];
        camera.keysLeft = [];
        camera.keysRight = [];
        camera.fov = 1.5;

        var glow = new BABYLON.GlowLayer("glow", scene);
        glow.intensity = 0.6;

        // Light
        let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
        light.position = new BABYLON.Vector3(50, 100, 50);
        light.intensity = 0.7;

        var ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(1, 1, 0), scene);
        ambientLight.intensity = 0.5;

        var shadowGenerator = new BABYLON.ShadowGenerator(2048, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        ground.receiveShadows = true;

        // Initialize boids
        for (let i = 0; i < 200; i++) {
            boids.push(new Boid(scene));
        }

        // Animation loop
        engine.runRenderLoop(() => {
            scene.render();
            boids.forEach(boid => {
                boid.flock(boids);
                boid.update();
            });
        });

        return scene;
    }

    canvas = document.getElementById("canvas2");
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene();

    window.addEventListener("resize", function () {
        engine.resize();
    });
}
