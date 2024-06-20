# Queueing

## Description du comportement

The queuing results from a steering behavior which produces braking (deceleration) when the vehicle detects other vehicles which are: nearby, in front of, and moving slower than itself.

In addition these vehicles are drawn toward the "doorway" by seek behavior, they avoid the gray walls, and maintain separation from each other.

A kinematic interpenetration constraint prevents them from overlapping with each other or the walls.

## Description du sketch

Le canvas est composé de 2 murs espacés pour laisser une ouverture. Une target est placée sur le bord droit du canvas.
30 vehicules sont ajoutés a la gauche du canvas.

### Les comportements

- Seek: Les vehicules sont attrés par la target
- Evitement des murs: Les vehicules evitent les murs grace a une force de répultion qui est activée lors que le vehicule risque la collision avec le mur.
- Evitement d'obstacle: Les vehicules evitent les obstacles circulaires suivant le meme principe.
- Separation des vehicules: Les vehicules restent a distance les uns des autres.
