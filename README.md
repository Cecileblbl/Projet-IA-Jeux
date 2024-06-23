# IA_Jeux

## Sujet

Développer des exemples et des tutoriels sur les algorithmes utilisés pour gérer les déplacements d'entités autonomes (véhicules, PNJs, etc.) dans les jeux avec de l'animation à 30 ou 60 images/s (ou plus).

## Auteurs

- ROBIN Léo
- BAROUK Cécile
- FERNANDES DE FARIA Patrick

## Contenu du Repository

### Algorithmes

#### Queuing

Comportement simulant une file d'attente. La file d'attente résulte d'un comportement de direction qui produit un freinage (décélération) lorsque le véhicule détecte d'autres véhicules qui sont : à proximité, devant lui, et se déplaçant plus lentement que lui-même.

#### Wall Following

Comportement simulant le suivi d'un mur. Le suivi de mur est une variante du suivi de chemin, où le véhicule maintient un écart constant par rapport à un mur en se déplaçant parallèlement à celui-ci.

#### Croisement de Chemin

Simulation d'un groupe d'entités qui "Wander" sans entrer en collision. Le croisement de chemin se produit lorsque plusieurs trajectoires se rencontrent ou se superposent, créant des points de convergence où les entités doivent s’éviter. Pour gérer les croisements de chemin, plusieurs stratégies peuvent être employées. Une approche courante est l'évitement de collision non aligné, où les entités en mouvement dans des directions différentes prévoient les collisions potentielles et modifient leur direction et leur vitesse pour les éviter.

#### AStar

Algorithme de recherche du chemin le plus court entre deux points.

#### Vector Field

Champ de vecteurs pour simuler des déplacements de foule.

#### Génétiques

- **Voitures** : Apprentissage à la conduite. Le but est de simuler une évolution artificielle où les véhicules apprennent à piloter sur une piste aléatoire.
- **Missiles** : Apprentissage pour atteindre une cible. Le but est de simuler le comportement d'une population de fusées cherchant à atteindre une cible en esquivant des obstacles.

### Visualisateur

Permet de visualiser les différents steering behaviors sur un site.

### Babylon

Adaptation des steering behaviors en 3D avec Babylon.js.

### algoP5

Adaptation des steering behaviors en 2D avec p5.js.

## Remarque

Chaque dossier contient un README propre au dossier avec des explications.
