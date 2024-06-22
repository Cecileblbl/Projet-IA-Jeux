# Arrival.js

Le comportement Arrival guide une entité vers une cible en réduisant progressivement sa vitesse à mesure qu'elle se rapproche, permettant une arrivée en douceur sans dépasser la cible.

## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas1`) où le jeu sera rendu et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol, une boule mobile, et des effets de lumière et d'ombre pour un rendu visuel amélioré.

### Contrôles Utilisateur
- **Gestion des Entrées** : Les touches du clavier sont capturées pour contrôler le déplacement de la boule. Des états d'entrée (`inputStates`) sont définis pour suivre quelles touches sont pressées.
- **Événements Clavier** : Des écouteurs d'événements sont ajoutés pour détecter les pressions et relâchements de touches, modifiant ainsi l'état d'entrée en conséquence.

### Mouvement et Interaction
- **Déplacement de la boule** : La position de la boule est mise à jour en fonction des états d'entrée (les touches directionnelles).
- **Création et Suivi des Serpents** : Les serpents sont des entités composées d'une tête et de segments. La tête du serpent suit la boule, tandis que chaque segment suit la tête ou le segment précédent avec des comportements de ralentissement et d'arrêt.

### Mise à Jour et Rendu
- **Boucle de Rendu** : Le moteur Babylon.js exécute une boucle de rendu qui met à jour la position des objets et rend la scène en continu.
- **Mise à Jour des Serpents** : Chaque serpent est mis à jour pour suivre sa cible (la boule ou le segment précédent) en ajustant sa position et sa rotation pour simuler un mouvement fluide.

### Principes de Suivi et d'Animation
- **Vecteur de Suivi** : La position de chaque serpent est mise à jour en calculant un vecteur dirigé vers sa cible (la boule pour la tête du serpent, le segment précédent pour les autres segments).
- **Vitesse Adaptative** : La vitesse du serpent est ajustée en fonction de la distance à sa cible. Plus il est proche, plus il ralentit, simulant un comportement de poursuite réaliste.
- **Distance de Séparation** : Les segments sont espacés de manière cohérente pour éviter le chevauchement et maintenir une apparence réaliste de serpent.
- **Visibilité des Segments** : Les segments deviennent invisibles s'ils sont trop proches de leur cible.
### Debugging et Visualisation
- **Mode Débogage** : En activant le mode débogage avec la touche `D`, des cercles sont dessinés autour des segments pour visualiser les zones de ralentissement et d'arrêt, facilitant ainsi le développement et le débogage du comportement des serpents.


## Fonctions Clés

### `initializeBehavior1()`
Cette fonction principale initialise et configure la scène, les entrées utilisateur, les serpents, et lance la boucle de rendu.

### `startGame()`
Cette fonction démarre le jeu en initialisant le canvas, le moteur Babylon.js, et en créant la scène.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la boîte, la caméra, et les effets de lumière.

### `modifySettings()`
Cette fonction configure les entrées utilisateur et les événements de clic pour modifier les paramètres de la scène.

### `moveBox()`
Cette fonction déplace la boîte en fonction des entrées clavier.

### `updateScene()`
Cette fonction met à jour la position des serpents en suivant leurs cibles respectives.

### `updateSerpent(serpent, target)`
Cette fonction met à jour la position de chaque serpent pour suivre sa cible.

### `drawDebugCircle(mesh, radius)`
Cette fonction dessine un cercle de débogage autour d'un mesh pour visualiser les zones de ralentissement et d'arrêt.

### `getRandomColor()`
Cette fonction génère une couleur aléatoire pour les serpents.

### `createSerpent()`
Cette fonction crée un nouveau serpent avec une tête et des segments, et l'ajoute à la scène.


## Instructions d'Utilisation
1. **Lancer le jeu** : Le jeu démarre automatiquement lorsque la page se charge.
2. **Déplacer la boule** : Utilisez les touches fléchées ou les touches `Q`, `Z`, `X`, `S` pour déplacer la boule dans la scène.
3. **Ajouter des serpents** : Appuyez sur la touche `T` pour ajouter de nouveaux serpents dans la scène.
4. **Mode Débogage** : Appuyez sur la touche `D` pour activer ou désactiver le mode débogage.
5. **Redimensionner la fenêtre** : Le jeu ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.
