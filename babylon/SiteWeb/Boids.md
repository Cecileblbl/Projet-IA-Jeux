# Boids.js

Les boids représentent un comportement de groupe où les entités se déplacent ensemble en suivant des règles de séparation, de cohésion et d'alignement.
## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas2`) où la simulation sera rendue et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol, et des effets de lumière pour améliorer le rendu visuel. Des sliders sont utilisés pour ajuster les paramètres des comportements des boids (alignement, cohésion, séparation).

### Contrôles Utilisateur
- **Sliders** : Les sliders permettent de modifier les paramètres des comportements des boids en temps réel, influençant leur alignement, cohésion et séparation.

### Génération et Comportement des Boids
- **Classe Boid** : Les boids sont définis par une classe qui gère leur position, vitesse, accélération et comportements.
- **Mise à Jour et Comportements** :
    - **Alignement** : Les boids ajustent leur direction pour s'aligner avec leurs voisins proches.
    - **Cohésion** : Les boids se déplacent vers le centre de masse de leurs voisins proches.
    - **Séparation** : Les boids évitent de se rapprocher trop de leurs voisins pour éviter les collisions.
    - **Limitation de la Vitesse** : La vitesse des boids est limitée pour maintenir des mouvements réalistes.

### Mise à Jour et Rendu
- **Boucle de Rendu** : Le moteur Babylon.js exécute une boucle de rendu qui met à jour la position des boids et rend la scène en continu.
- **Animation des Boids** : Chaque boid est mis à jour à chaque frame pour suivre les règles de comportement et se déplacer dans la scène.

## Fonctions Clés

### `initializeBehavior2()`
Cette fonction principale initialise et configure la scène, les boids, les sliders pour les comportements, et lance la boucle de rendu.

### `Boid`
Classe qui définit le comportement des boids, y compris l'alignement, la cohésion, la séparation, et la mise à jour de la position.
- **`edges()`** : Gère le déplacement des boids en assurant qu'ils restent à l'intérieur des limites de la scène.
- **`align(boids)`** : Calcule la force d'alignement pour ajuster la direction du boid en fonction de ses voisins proches.
- **`separation(boids)`** : Calcule la force de séparation pour éviter les collisions avec les voisins proches.
- **`cohesion(boids)`** : Calcule la force de cohésion pour diriger le boid vers le centre de masse de ses voisins proches.
- **`flock(boids)`** : Applique les forces d'alignement, de cohésion et de séparation pour déterminer la nouvelle accélération du boid.
- **`update()`** : Met à jour la position et la vitesse du boid en fonction des forces appliquées et des règles de comportement.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la lumière et initialise les boids.

## Instructions d'Utilisation
2. **Lancer le script** : La simulation démarre automatiquement lorsque la page se charge.
3. **Ajuster les paramètres** : Utilisez les sliders pour ajuster les comportements d'alignement, de cohésion et de séparation des boids en temps réel.
4. **Redimensionner la fenêtre** : La simulation ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.

