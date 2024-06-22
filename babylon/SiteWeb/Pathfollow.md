# PathFollow.js

Le suivi de chemin guide une entité le long d'un chemin lorsquelle le trouve.

## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas4`) où la simulation sera rendue et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol, et des effets de lumière pour améliorer le rendu visuel. Un chemin est défini pour que le véhicule puisse le suivre.

### Contrôles Utilisateur
- **Aucun contrôle utilisateur spécifique** : La simulation se déroule automatiquement une fois lancée.

### Génération et Comportement du Véhicule
- **Création du Véhicule** : Un véhicule est créé sous la forme d'un cylindre, ainsi que des segments qui suivent le véhicule pour simuler un serpent.
- **Mouvement et Suivi du Chemin** :
    - **Direction et Vitesse** : Le véhicule se déplace dans une direction définie et ajuste sa trajectoire pour suivre le chemin.
    - **Suivi des Segments** : Les segments suivent le véhicule principal en maintenant une distance fixe.

### Mise à Jour et Rendu
- **Animation des Segments** : Chaque segment est mis à jour à chaque frame pour suivre le véhicule ou le segment précédent.

## Fonctions Clés

### `initializeBehavior4()`
Cette fonction principale initialise et configure la scène, le véhicule, et les segments, puis lance la boucle de rendu.

### `startGame()`
Cette fonction démarre le jeu en initialisant le canvas, le moteur Babylon.js, et en créant la scène.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la lumière, le véhicule, les segments, et le chemin à suivre.

### `moveVehicleContinuously()`
Cette fonction met à jour la position du véhicule et des segments pour simuler un mouvement continu en suivant le chemin défini.

### `findNearestPointOnLine(point, start, end)`
Cette fonction trouve le point le plus proche sur une ligne donnée à partir d'un point spécifié, utilisée pour garder le véhicule proche du chemin.

## Instructions d'Utilisation
2. **Lancer le script** : La simulation démarre automatiquement lorsque la page se charge.
3. **Visualiser la simulation** : Observez le véhicule suivre le chemin et les segments suivre le véhicule.
4. **Redimensionner la fenêtre** : La simulation ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.
