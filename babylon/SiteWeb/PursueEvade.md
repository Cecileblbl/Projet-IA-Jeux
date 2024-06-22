# PursueEvade.js

La poursuite et l'évasion sont deux comportements complémentaires où une entité (le poursuivant) tente de suivre et d'attraper une autre entité (l'évité), qui essaie de s'échapper.
## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas7`) où la simulation sera rendue et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol, et des effets de lumière pour améliorer le rendu visuel.

### Contrôles Utilisateur
- **Ajouter un Serpent** : Appuyez sur la touche `T` pour ajouter un nouveau serpent à la scène.

### Génération et Comportement
- **boule et Sphère** : Un boule agit comme une cible mobile, tandis qu'une sphère agit comme un poursuivant.
- **Serpents** : Des serpents sont générés avec une tête et des segments qui suivent la tête en maintenant une distance fixe.
- **Poursuite et Évasion** :
    - **Poursuite** : La sphère calcule la position future du boule et ajuste sa direction pour le poursuivre.
    - **Évasion** : Le boule calcule une force d'évasion basée sur la position de la sphère et des serpents pour éviter d'être capturé.

### Mise à Jour et Rendu
- **Animation des Segments** : Chaque segment est mis à jour à chaque frame pour suivre la tête du serpent ou le segment précédent.

## Fonctions Clés

### `initializeBehavior7()`
Cette fonction principale initialise et configure la scène, le boule, la sphère, les serpents et leurs segments, puis lance la boucle de rendu.

### `startGame()`
Cette fonction démarre le jeu en initialisant le canvas, le moteur Babylon.js, et en créant la scène.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la lumière, le boule, la sphère et les segments.

### `moveBoxContinuously()`
Cette fonction déplace le boule en calculant une force d'évasion et une force aléatoire pour éviter les mouvements prévisibles.

### `updateSphere()`
Cette fonction met à jour la position de la sphère pour poursuivre le boule, et met à jour les segments pour qu'ils suivent la sphère ou le segment précédent.

### `pursue(target, pursuer)`
Cette fonction calcule la direction de poursuite du poursuivant vers la cible.

### `evade(pursuers, evader)`
Cette fonction calcule la force d'évasion de l'évader par rapport aux poursuivants.

### `updateScene()`
Cette fonction met à jour la position et la direction des serpents.

### `createSerpent()`
Cette fonction crée un nouveau serpent avec une tête et des segments, et l'ajoute à la scène.

### `resetBoxPosition()`, `resetSpherePosition()`, `resetSegmentsPosition()`, `resetSerpentPosition()`
Ces fonctions réinitialisent la position du boule, de la sphère, des segments et des serpents lorsque la sphère est proche du boule.

### `modifySettings()`
Cette fonction configure les entrées utilisateur et les événements de clic pour modifier les paramètres de la scène.

## Instructions d'Utilisation
2. **Lancer le script** : La simulation démarre automatiquement lorsque la page se charge.
3. **Ajouter des serpents** : Appuyez sur la touche `T` pour ajouter de nouveaux serpents dans la scène.
4. **Redimensionner la fenêtre** : La simulation ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.
