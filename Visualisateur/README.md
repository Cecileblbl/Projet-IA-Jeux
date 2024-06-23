# Visualisateur de Comportements - Steering Behaviors

Ce projet est un visualisateur interactif pour explorer et comprendre les "steering behaviors" appliqués à des véhicules simulés sur un canvas. Les utilisateurs peuvent ajouter, ajuster et combiner différents comportements pour observer leurs interactions en temps réel.

## Technologies Utilisées

Ce projet utilise plusieurs technologies clés pour son fonctionnement :

    HTML, CSS, JavaScript : Ces technologies de base sont utilisées pour la structure, la présentation et la fonctionnalité générale de l'application web. HTML définit la structure des pages web, CSS est utilisé pour le style et la mise en page, tandis que JavaScript assure l'interactivité et la manipulation dynamique des éléments.

    p5.js : Cette bibliothèque JavaScript est spécifiquement utilisée pour la création d'animations et de visualisations interactives sur le canevas HTML5. p5.js simplifie le processus de dessin et d'animation, permettant une intégration fluide des comportements de véhicules et des interactions utilisateur.

## Fonctionnalités

- **Ajout de Véhicules et d'Obstacles**

  - Permet d'ajouter plusieurs véhicules et obstacles sur le canvas.

- **Application de Comportements**

  - Applique dynamiquement les comportements sélectionnés à chaque véhicule.
  - Les comportements disponibles incluent : Flee, Seek, Arrival, Wander, Obstacle avoidance, Bordures, Evade, Pursue, Separation.

- **Personnalisation des Comportements**

  - Les utilisateurs peuvent ajuster les paramètres de chaque comportement via une interface utilisateur dédiée.

- **Architecture Orientée Objet**
  - Utilisation de classes pour chaque type de comportement, favorisant l'encapsulation et la réutilisation.

## Fonction Debug des Comportements

La fonction debug est une fonctionnalité clé qui permet de visualiser et de comprendre plus en détail les comportements appliqués aux véhicules dans cette simulation. Elle est utilisée pour afficher des informations visuelles supplémentaires directement sur le canevas, ce qui aide à analyser le fonctionnement des comportements en temps réel.
Exemple de Fonction Debug

Voici un exemple illustrant comment la fonction debug peut être implémentée pour un comportement spécifique, comme Flee (Fuir) :

```
drawDebug(entity) {
// Dessine une ligne entre la position de la cible et la position de l'entité
stroke(255, 0, 0); // Rouge
line(this.target.pos.x, this.target.pos.y, entity.pos.x, entity.pos.y);

// Dessine un cercle autour de la cible pour indiquer la zone d'action du comportement
noFill();
stroke(255, 0, 0, 100); // Rouge avec transparence
ellipse(this.target.pos.x, this.target.pos.y, 20);

// Dessine une ligne représentant la direction dans laquelle l'entité fuit par rapport à la cible
let fleeingDirection = p5.Vector.sub(entity.pos, this.target.pos);
fleeingDirection.setMag(30);
stroke(0, 255, 0); // Vert
line(
entity.pos.x,
entity.pos.y,
entity.pos.x + fleeingDirection.x,
entity.pos.y + fleeingDirection.y
);
}
```

Explication de l'Exemple

    Ligne de la Cible : Dessine une ligne rouge entre la position de la cible et la position de l'entité pour visualiser la direction de la fuite.

    Zone d'Action : Dessine un cercle rouge semi-transparent autour de la cible pour montrer la zone d'action du comportement de fuite.

    Direction de Fuite : Trace une ligne verte à partir de l'entité dans la direction opposée à la cible, indiquant ainsi la direction dans laquelle l'entité tente de s'éloigner de la cible.

Utilisation et Avantages

La fonction debug permet aux développeurs et aux utilisateurs de comprendre visuellement comment chaque comportement affecte le mouvement des véhicules dans la simulation. Cela facilite le débogage, l'optimisation et la compréhension des interactions complexes entre les comportements appliqués.

## Comment Utiliser

1. **Ajout de Comportements**

   - Sélectionnez un comportement dans la liste déroulante pour l'ajouter à la simulation.
   - Les comportements peuvent être retirés à tout moment en cliquant sur le bouton "Remove" à côté de chaque comportement affiché.

2. **Contrôles de Simulation**

   - Utilisez le bouton "Pause/Resume" pour interrompre ou reprendre la simulation.
   - Les sliders permettent de modifier la vitesse maximale et la force maximale des véhicules en temps réel.

3. **Types de Cibles**
   - Différents types de cibles sont disponibles pour chaque comportement : cible fixe, cible errante et cible souris.
   - Ces cibles peuvent être sélectionnées et ajustées pour observer différentes interactions.

## Développement Futur

Ce projet est évolutif et prévoit d'ajouter les fonctionnalités suivantes à l'avenir :

- **Groupes de Véhicules**

  - Possibilité d'appliquer des comportements différents à des groupes distincts de véhicules.

- **Interface Utilisateur Améliorée**

  - Amélioration de l'interface utilisateur pour une expérience plus intuitive et interactive.

- **Visualisation Avancée**
  - Intégration de visualisations avancées pour une meilleure compréhension des interactions entre les comportements.

## Exemple de Code

L'application utilise une architecture basée sur des classes pour gérer les "steering behaviors", rendant le code flexible et facile à étendre. Voici un exemple de code illustrant l'application d'un comportement Arrival :

```javascript
// Exemple de code pour le comportement Arrival
class ArrivalB {
  constructor(target, distance = 100, slowdown = 0.2) {
    this.target = target;
    this.magnitude = 1;
    this.distance = distance;
    this.slowdown = slowdown;
    // Autres paramètres et méthodes...
  }

  calculateForce(entity) {
    // Calcul de la force appliquée à l'entité
  }

  draw() {
    // Dessine la cible sur le canvas
  }

  // Autres méthodes de visualisation et d'interface utilisateur...
}
```
