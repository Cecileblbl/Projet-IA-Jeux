# Steering Behaviors en BABYLON JS

Lien : [Site Web regroupant les comportements](https://projet-ia-jeux.onrender.com)

Ce projet utilise Babylon.js pour démontrer différents comportements de direction (steering behaviors) couramment utilisés dans l'animation et la simulation de mouvements de groupe. Ces comportements incluent l'arrivée, les boids, l'évitement d'obstacles, le suivi de chemin, la projection scalaire, la poursuite et l'évasion, la recherche, l'errance, et l'algorithme A*.

## Comportements Disponibles

### 1. Comportement Arrival
Ce comportement guide une entité vers une cible en réduisant progressivement sa vitesse à mesure qu'elle se rapproche, permettant une arrivée en douceur sans dépasser la cible.

### 2. Comportement Boids
Les boids représentent un comportement de groupe où les entités se déplacent ensemble en suivant des règles de séparation, de cohésion et d'alignement, simulant ainsi le comportement des bancs de poissons ou des vols d'oiseaux.

### 3. Comportement Obstacle Avoid
L'évitement d'obstacles permet à une entité de détecter et d'éviter les obstacles sur son chemin tout en se dirigeant vers sa cible.

### 4. Comportement Path Follow
Le suivi de chemin guide une entité le long d'un chemin prédéfini, en s'assurant qu'elle reste sur le chemin et ajuste sa vitesse et sa direction en conséquence.

### 5. Comportement Path Follow Complex
Semblable au suivi de chemin, mais avec des chemins plus complexes et des comportements supplémentaires pour gérer des scénarios plus compliqués.

### 6. Comportement Scalar Projection
Ce comportement utilise la projection scalaire pour ajuster les mouvements de l'entité en fonction de vecteurs de direction et de vitesse.

### 7. Comportement Pursue Evade
La poursuite et l'évasion sont deux comportements complémentaires où une entité (le poursuivant) tente de suivre et d'attraper une autre entité (l'évité), qui essaie de s'échapper.

### 8. Comportement Seek
La recherche est un comportement simple où une entité se dirige directement vers une cible spécifique.

### 9. Comportement Wander
L'errance fait que l'entité se déplace de manière aléatoire tout en conservant une certaine direction générale, créant un mouvement plus naturel et imprévisible.

### 10. Comportement A*
L'algorithme A* est utilisé pour trouver le chemin le plus court entre deux points dans un espace discret, en prenant en compte les obstacles et le terrain.

## Remarques

- Dans les fichiers où des serpents sont créés sur la scène, il suffit de cliquer sur la touche `T` autant de fois que souhaité pour en créer de nouveaux.
- Pour le fichier Wander, il suffit de cliquer sur la touche `D` pour afficher le vecteur de direction.
