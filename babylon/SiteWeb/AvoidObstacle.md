# AvoidObstacle.js

Le comportement d'évitement d'obstacles permet à une entité de détecter et d'éviter les obstacles sur son chemin tout en se dirigeant vers sa cible.

## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas3`) où le jeu sera rendu et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol, une boîte verte contrôlable, et des effets de lumière pour améliorer le rendu visuel.

### Contrôles Utilisateur
- **Gestion des Entrées** : Les touches du clavier sont capturées pour contrôler le déplacement de la boîte et l'ajout de véhicules. Des états d'entrée (`inputStates`) sont définis pour suivre quelles touches sont pressées.
- **Événements Clavier et Souris** : Des écouteurs d'événements sont ajoutés pour détecter les pressions et relâchements de touches ainsi que les clics de souris pour ajouter des obstacles.

### Génération et Suivi des Véhicules
- **Classe Vehicle** : Les véhicules (serpents) sont définis par une classe qui gère leur position, vitesse, et comportements d'évitement.
- **Mise à Jour et Évitement** : Chaque véhicule est mis à jour pour se diriger vers la boîte, éviter les obstacles et éviter les autres véhicules.

### Mise à Jour et Rendu
- **Boucle de Rendu** : Le moteur Babylon.js exécute une boucle de rendu qui met à jour la position des objets et rend la scène en continu.
- **Visualisation de l'Évitement** : Un mode de visualisation de l'évitement peut être activé pour afficher les vecteurs d'évitement.

## Fonctions Clés

### `initializeBehavior3()`
Cette fonction principale initialise et configure la scène, les entrées utilisateur, les obstacles, et les véhicules, puis lance la boucle de rendu.

### `Vehicle`
Classe qui définit le comportement des véhicules, y compris l'application de forces, la mise à jour de la position, et les comportements d'évitement.
- **`applyForce(force)`** : Applique une force à l'accélération du véhicule.
- **`update()`** : Met à jour la position, la vitesse et la direction du véhicule et de ses segments.
- **`seek(target)`** : Dirige le véhicule vers une cible en ajustant sa vitesse.
- **`avoid(obstacles)`** : Évite les obstacles en ajustant la trajectoire.
- **`avoidVehicles(vehicles)`** : Évite les autres véhicules pour éviter les collisions.

### `createVehicle(initialPosition)`
Cette fonction crée un nouveau véhicule à une position initiale donnée et l'ajoute à la scène.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la boîte verte et la caméra.

### `createObstacles()`
Cette fonction crée des obstacles aléatoires dans la scène.

### `moveBox()`
Cette fonction déplace la boîte verte en fonction des entrées clavier.

### `modifySettings()`
Cette fonction configure les entrées utilisateur et les événements de clic pour ajouter des obstacles.

## Instructions d'Utilisation
2. **Lancer le script** : Le jeu démarre automatiquement lorsque la page se charge.
3. **Déplacer la boîte** : Utilisez les touches fléchées ou les touches `Q`, `Z`, `D`, `S` pour déplacer la boîte dans la scène.
4. **Ajouter des véhicules** : Appuyez sur la touche `T` pour ajouter de nouveaux véhicules dans la scène.
5. **Ajouter des obstacles** : Cliquez sur le sol pour ajouter de nouveaux obstacles.
6. **Activer le mode débogage** : Appuyez sur la touche `D` pour activer ou désactiver le mode de visualisation de l'évitement.
7. **Redimensionner la fenêtre** : Le jeu ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.
