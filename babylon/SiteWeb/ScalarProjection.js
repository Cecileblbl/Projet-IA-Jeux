function initializeBehavior6() {
    const canvas = document.getElementById("canvas6");
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function () {
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

        // Movable sphere with direction keys
        let box = BABYLON.MeshBuilder.CreateSphere("mySphere", { diameter: 4 }, scene);
        box.position = new BABYLON.Vector3(-2, 1 + 2, 2);
        let boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
        boxMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.8, 0.2); // Une couleur de boîte plus vive
        box.material = boxMaterial;

        // Ground
        let ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 100, height: 100}, scene);
        let groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
        groundMaterial.diffuseTexture = new BABYLON.Texture("img/Wall.jpg");
        groundMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1); // Un sol plus clair et plus accueillant
        ground.material = groundMaterial;

        // Camera
        let camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 4, 75, new BABYLON.Vector3(0, 5, 0), scene);
        camera.attachControl(canvas, true);
        camera.fov = 1.5;

        // Post-processing (glow effect)
        var glow = new BABYLON.GlowLayer("glow", scene);
        glow.intensity = 0.3;

        // Lighting
        let light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(-1, -2, -1), scene);
        light.position = new BABYLON.Vector3(20, 40, 20);
        light.intensity = 0.7;

        var ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
        ambientLight.intensity = 0.3;

        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.addShadowCaster(box);
        ground.receiveShadows = true; // Le sol reçoit des ombres

        // Target path vector
        let pathVector = new BABYLON.Vector3(200, 0, 60);
        let pathEnd = BABYLON.MeshBuilder.CreateSphere("pathEnd", { diameter: 4 }, scene);
        pathEnd.position = pathVector;
        pathEnd.material = new BABYLON.StandardMaterial("pathEndMaterial", scene);
        pathEnd.material.diffuseColor = new BABYLON.Color3(1, 0, 0); // Red

        // Projection sphere
        let projectionSphere = BABYLON.MeshBuilder.CreateSphere("projectionSphere", { diameter: 4 }, scene);
        projectionSphere.position = new BABYLON.Vector3(0, 0, 0);
        projectionSphere.material = new BABYLON.StandardMaterial("projectionMaterial", scene);
        projectionSphere.material.diffuseColor = new BABYLON.Color3(0, 0, 1); // Blue

        // Lines for visualization
        let mainLine = BABYLON.MeshBuilder.CreateLines("mainLine", {
            points: [box.position, box.position.add(pathVector)],
            updatable: true
        }, scene);

        let projectionLine = BABYLON.MeshBuilder.CreateLines("projectionLine", {
            points: [box.position, projectionSphere.position],
            updatable: true
        }, scene);

        // Function for vector projection
        function vectorProjection(a, b) {
            const bNorm = b.normalize();
            const scalarProjection = BABYLON.Vector3.Dot(a, bNorm);
            return bNorm.scale(scalarProjection);
        }

        // Function to update the scene
        function updateScene() {
            let a = box.position;
            let v = vectorProjection(a, pathVector);
            projectionSphere.position = v;

            mainLine = BABYLON.MeshBuilder.CreateLines("mainLine", {
                points: [box.position, pathVector],
                updatable: true,
                instance: mainLine
            }, scene);

            projectionLine = BABYLON.MeshBuilder.CreateLines("projectionLine", {
                points: [box.position, projectionSphere.position],
                updatable: true,
                instance: projectionLine
            }, scene);
        }

        // Define boundaries for the ground
        const groundSize = 100;
        const minX = -groundSize / 2;
        const maxX = groundSize / 2;
        const minZ = -groundSize / 2;
        const maxZ = groundSize / 2;

        // Event listener for sphere movement
        window.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "z":
                    if (box.position.y < maxZ) box.position.y += 1;
                    break;
                case "s":
                    if (box.position.y > minZ) box.position.y -= 1;
                    break;
                case "q":
                    if (box.position.x > minX) box.position.x -= 1;
                    break;
                case "d":
                    if (box.position.x < maxX) box.position.x += 1;
                    break;

                case "ArrowUp":
                    if (box.position.z < maxZ) box.position.z += 1;
                    break;
                case "ArrowDown":
                    if (box.position.z > minZ) box.position.z -= 1;
                    break;
                case "ArrowLeft":
                    if (box.position.x > minX) box.position.x -= 1;
                    break;
                case "ArrowRight":
                    if (box.position.x < maxX) box.position.x += 1;
                    break;
            }
            event.preventDefault();
            updateScene();
        });

        updateScene();
        return scene;
    };

    const scene = createScene();
    engine.runRenderLoop(() => scene.render());
    window.addEventListener("resize", () => engine.resize());
}
