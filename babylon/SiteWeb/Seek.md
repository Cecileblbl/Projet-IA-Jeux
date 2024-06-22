
# Seek.js

Seek  est un comportement simple où une entité se dirige directement vers une cible spécifique.

## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas8`) où la simulation sera rendue et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol, et des effets de lumière pour améliorer le rendu visuel.

### Contrôles Utilisateur
- **Ajouter un Serpent** : Appuyez sur la touche `T` pour ajouter un nouveau serpent à la scène.
- **Déplacer la Sphère** : Utilisez les touches `Z`, `Q`, `S`, `D` et les flèches directionnelles pour déplacer la sphère dans l'espace 3D.

### Génération et Comportement
- **Pyramide et Sphère** : Une pyramide agit comme un poursuivant, tandis qu'une sphère agit comme une cible mobile.
- **Serpents** : Des serpents sont générés avec une tête et des segments qui suivent la tête en maintenant une distance fixe.
- **Suivi** :
    - **Suivi de la Sphère** : La pyramide calcule la direction pour suivre la sphère.
    - **Suivi des Segments** : Les segments suivent la pyramide ou le segment précédent en maintenant une distance fixe.

### Mise à Jour et Rendu
- **Animation des Segments** : Chaque segment est mis à jour à chaque frame pour suivre la tête du serpent ou le segment précédent.

## Fonctions Clés

### `initializeBehavior8()`
Cette fonction principale initialise et configure la scène, la sphère, la pyramide, les serpents et leurs segments, puis lance la boucle de rendu.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la lumière, la sphère, la pyramide et les segments.

### `modifySettings()`
Cette fonction configure les entrées utilisateur et les événements de clic pour modifier les paramètres de la scène.

### `moveBox()`
Cette fonction déplace la sphère en fonction des entrées utilisateur.

### `updateSphere()`
Cette fonction met à jour la position de la pyramide pour suivre la sphère, et met à jour les segments pour qu'ils suivent la pyramide ou le segment précédent.

### `updateScene()`
Cette fonction met à jour la position et la direction des serpents.

### `createSerpent()`
Cette fonction crée un nouveau serpent avec une tête et des segments, et l'ajoute à la scène.

### `avoidVehicles(currentSerpent)`
Cette fonction calcule une force d'évitement pour que les serpents évitent les collisions entre eux.

## Instructions d'Utilisation
2. **Lancer le script** : La simulation démarre automatiquement lorsque la page se charge.
3. **Déplacer la sphère** : Utilisez les touches `Z`, `Q`, `S`, `D` et les flèches directionnelles pour déplacer la sphère.
4. **Ajouter des serpents** : Appuyez sur la touche `T` pour ajouter de nouveaux serpents dans la scène.
5. **Redimensionner la fenêtre** : La simulation ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.
