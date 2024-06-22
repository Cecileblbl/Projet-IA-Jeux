
# AStar.js

L'algorithme A* est utilisé pour trouver le chemin le plus court entre deux points dans un espace discret, en prenant en compte les obstacles et le terrain.

## Principe de Fonctionnement

### Initialisation et Configuration
- **Canvas et Moteur** : Le script sélectionne le canvas HTML (ID `canvas10`) où le jeu sera rendu et initialise le moteur Babylon.js.
- **Scène** : Une scène est créée avec un ciel, un sol en grille représentant le terrain, et des effets de lumière pour améliorer le rendu visuel.

### Contrôles Utilisateur
- **Sélection des Points** : En cliquant sur le terrain, l'utilisateur peut sélectionner un point de départ et un point d'arrivée. Le chemin entre ces points est ensuite calculé en utilisant l'algorithme A*.
- **Événements Souris** : Des écouteurs d'événements sont ajoutés pour détecter les clics de souris et identifier les cellules du terrain cliquées.

### Génération et Suivi du Chemin
- **Algorithme A*** : L'algorithme A* est utilisé pour trouver le chemin le plus court entre le point de départ et le point d'arrivée sur le terrain en tenant compte des obstacles et des coûts de déplacement.
- **Visualisation du Chemin** : Le chemin trouvé est mis en évidence sur le terrain, et une "chenille" animée peut être visualisée suivant ce chemin.

### Mise à Jour et Rendu
- **Animation de la Chenille** : Une chenille est animée pour suivre le chemin trouvé.

### Sélection et Visualisation
- **Création du Terrain** : Le terrain est généré comme une grille de cellules avec des hauteurs selon son poid, chaque cellule étant représentée par une boîte 3D.
- **Points de Sélection** : Les points de départ et d'arrivée sont visualisés par des sphères colorées, et le chemin est mis en évidence par une couleur spécifique sur les cellules du terrain.


## Fonctions Clés

### `initializeBehavior10()`
Cette fonction principale initialise et configure la scène, le terrain, les points de départ et d'arrivée, et lance la boucle de rendu.

### `createScene()`
Cette fonction configure la scène Babylon.js, y compris le ciel, le sol, la lumière, et initialise le terrain.

### `createTerrainMesh()`
Cette fonction génère le terrain en créant une grille de cellules avec des hauteurs aléatoires.

### `selectPoints(event)`
Cette fonction gère la sélection des points de départ et d'arrivée sur le terrain.

### `createPointMesh(position, color)`
Cette fonction crée une sphère pour visualiser un point de départ ou d'arrivée.

### `highlightPath(path)`
Cette fonction met en évidence le chemin trouvé sur le terrain.

### `drawSnake()`
Cette fonction anime une chenille pour suivre le chemin trouvé.

### `A_star(G, depart, arrivee)`
Cette fonction implémente l'algorithme A* pour trouver le chemin le plus court sur le terrain.

### `enfiler(queue, element)`
Cette fonction ajoute un élément à la file de priorité utilisée par l'algorithme A*.

### `defiler(queue)`
Cette fonction retire et retourne le premier élément de la file de priorité.

### `indice_voisin(G, sommet)`
Cette fonction trouve les voisins d'un sommet donné sur le terrain.

### `dist(x1, y1, x2, y2)`
Cette fonction calcule la distance manhattan entre deux points.

## Instructions d'Utilisation
1. **Lancer le script** : Le jeu démarre automatiquement lorsque la page se charge.
2. **Sélectionner les points** : Cliquez sur le terrain pour sélectionner un point de départ (rouge) et un point d'arrivée (bleu).
3. **Visualiser le chemin** : Une fois les points sélectionnés, le chemin calculé sera mis en évidence et une chenille animée suivra ce chemin.
4. **Redimensionner la fenêtre** : Le jeu ajuste automatiquement la taille du canvas lorsque la fenêtre est redimensionnée.


