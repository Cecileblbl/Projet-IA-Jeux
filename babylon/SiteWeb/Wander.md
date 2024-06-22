# Wander.js

L'errance fait que l'entité se déplace de manière aléatoire tout en conservant une certaine direction générale, créant un mouvement plus naturel et imprévisible.

## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas9`) où la simulation sera rendue et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol, et des effets de lumière pour améliorer le rendu visuel.

### Contrôles Utilisateur
- **Activer/Désactiver le Mode Débogage** : Appuyez sur la touche `D` pour activer ou désactiver le mode débogage. En mode débogage, des informations supplémentaires sur les véhicules sont affichées.

### Génération et Comportement
- **Véhicules** : Des véhicules sont générés avec des positions et des vitesses aléatoires.
- **Errance** :
    - **Comportement d'Errance** : Chaque véhicule calcule une direction aléatoire à chaque intervalle de temps pour simuler un comportement d'errance.
    - **Visualisation** : En mode débogage, des éléments visuels comme des cercles et des lignes sont affichés pour montrer le chemin de l'errance et les cibles.

### Mise à Jour et Rendu
- **Mise à Jour des Véhicules** : Chaque véhicule est mis à jour à chaque frame pour suivre la direction calculée et ajuster sa position.

## Fonctions Clés

### `initializeBehavior9()`
Cette fonction principale initialise et configure la scène, les véhicules, et leurs comportements, puis lance la boucle de rendu.

### `Vehicle`

Classe qui définit le comportement des véhicules, y compris l'errance et la mise à jour de la position.
- **`toggleDebugMode()`** : Active ou désactive le mode débogage pour afficher des informations supplémentaires sur les véhicules.
- **`wander()`** : Calcule une nouvelle direction d'errance pour le véhicule.
- **`update()`** : Met à jour la position du véhicule en fonction de sa vitesse et de sa direction.
- **`edges()`** : Gère les limites de l'espace de déplacement pour empêcher les véhicules de sortir de la zone de jeu.

### `addVehicles(count)`
Cette fonction crée un nombre spécifié de véhicules et les ajoute à la scène.

### `getRandomColor()`
Cette fonction génère une couleur aléatoire pour les véhicules.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la lumière, et initialise les véhicules.

## Instructions d'Utilisation
2. **Lancer le script** : La simulation démarre automatiquement lorsque la page se charge.
3. **Activer le mode débogage** : Appuyez sur la touche `D` pour activer ou désactiver le mode débogage.
4. **Redimensionner la fenêtre** : La simulation ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.
