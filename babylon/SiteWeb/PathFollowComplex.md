# PathFollowComplex.js

PathFollowComplex.js Semblable au suivi de chemin, mais avec des chemins plus complexes et des comportements supplémentaires pour gérer des scénarios plus compliqués.

## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas5`) où la simulation sera rendue et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol, et des effets de lumière pour améliorer le rendu visuel. Un chemin complexe est défini pour que les véhicules puissent le suivre.

### Contrôles Utilisateur
- **Ajouter un Véhicule** : Appuyez sur la touche `T` pour ajouter un nouveau véhicule à la scène.
- **Mode Débogage** : Appuyez sur la touche `D` pour activer ou désactiver le mode débogage, qui affiche des informations supplémentaires sur les véhicules.

### Génération et Comportement des Véhicules
- **Création de Véhicules** : Des véhicules sont créés sous la forme de cylindres, chacun avec des segments qui suivent le véhicule principal pour simuler un serpent.
- **Suivi du Chemin** :
    - **Direction et Vitesse** : Les véhicules se déplacent le long d'un chemin prédéfini, ajustant leur direction pour suivre les points du chemin.
    - **Suivi des Segments** : Les segments suivent le véhicule principal en maintenant une distance fixe.

### Visualisation des Indicateurs
- **Mode Débogage** : Lorsque le mode débogage est activé, des informations sur la position et la direction des véhicules sont affichées à l'écran.

### Mise à Jour et Rendu
- **Boucle de Rendu** : Le moteur Babylon.js exécute une boucle de rendu qui met à jour la position des véhicules et des segments, et rend la scène en continu.
- **Animation des Segments** : Chaque segment est mis à jour à chaque frame pour suivre le véhicule ou le segment précédent.

## Fonctions Clés

### `initializeBehavior5()`
Cette fonction principale initialise et configure la scène, les véhicules, les segments, et le chemin, puis lance la boucle de rendu.

### `startGame()`
Cette fonction démarre le jeu en initialisant le canvas, le moteur Babylon.js, et en créant la scène.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la lumière, les véhicules, les segments, et le chemin à suivre.

### `createNewVehicle()`
Cette fonction crée un nouveau véhicule et ses segments associés, les ajoute à la scène, et les configure pour suivre le chemin.

### `createPath()`
Cette fonction définit un chemin complexe en créant plusieurs points connectés pour que les véhicules puissent les suivre.

### `followPath(vehicle)`
Cette fonction ajuste la direction du véhicule pour qu'il suive le chemin défini.

### `moveVehicleContinuously(vehicle, vehicleSegments)`
Cette fonction met à jour la position du véhicule et des segments pour simuler un mouvement continu en suivant le chemin défini.

### `findNearestPointOnLine(point, start, end)`
Cette fonction trouve le point le plus proche sur une ligne donnée à partir d'un point spécifié, utilisée pour garder le véhicule proche du chemin.

### `showDebugInfo(vehicle)`
Cette fonction affiche des informations de débogage sur la position et la direction des véhicules.

## Instructions d'Utilisation
2. **Lancer le script** : La simulation démarre automatiquement lorsque la page se charge.
3. **Ajouter des véhicules** : Appuyez sur la touche `T` pour ajouter de nouveaux véhicules dans la scène.
4. **Activer le mode débogage** : Appuyez sur la touche `D` pour activer ou désactiver le mode de débogage.
5. **Redimensionner la fenêtre** : La simulation ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.

