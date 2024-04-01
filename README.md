# IA_Jeux
Sujet : développer des exemples et tutoriaux sur les algorithmes utilisés pour gérer les déplacements d'entités autonomes (véhicules, PNJs etc) dans les jeux avec de l'animation à 30 ou 60 images/s (ou plus)

    Steering Behaviors (suivre une cible, fuir, eviter les obstacles, arriver quelque part, suivre un chemin, suivre un leader etc.) J'ai déjà de nombreux prototypes et vidéos sur le sujet. Pour cette partie il faudra implémenter et expliquer les comportements manquants (suivre un mur, faire la queue, se croiser sur une route en essayant de s'éviter)
    Algorithme A* (utilisé par les jeux de stratégie temps réel)
    Algorithmes génétiques (apprendre à suivre une route, apprendre à des missiles à atteindre leur cible, apprendre à survivre en milieu hostile)
    Bien entendu tous ces comportements sont cumulables (c'est la beauté de ces algorithmes) et il faudra aussi montrer des exemples mettant en oeuvre simultanément plusieurs comportements (suivre un circuit en évitant les obstacles et en ayant un but lointain également), ou en mettant en oeuvre des arbres de décision (ma vie est basse, je fuis et je cherche à manger, ma vie est haute, je me transforme en prédateur et j'essaie de tuer les ennemis, ou bien je suis la piste car je suis pilote de course, je n'ai plus d'essence je dois m'arrêter au stand)
    L'implémentation se fera en P5 (JavaScript adapté à l'animation et au creative coding) mais vous montrerez aussi sur un exemple ou deux qu'il est très simple de le faire en pur JavaScript.
        Vous utiliserez dataGUI par exemple pour qu'on puisse facilement changer les paramètres des comportements et voir en live ce que cela change.
    Et j'aimerais aussi ajouter mon grain de sel, puisque vous êtes quatre :

        Des exemples 3D mais avec déplacements 2D dans des mini jeux BabylonJS (que vous pourrez développer pour le concours Games on Web) : course avec IA pour les autres joueurs etc, arène de survie etc.
        Des ambiances sonores contextuelles 100% synthétisées par du code (avec WebAudio API je vous expliquerai) : l'ennemi qui me cherche se rapproche, je veux que les sons deviennent plus aigus, ma vie est basse je veux entrendre un coeur qui bat, on approche de la fin de la course, le tempo des sons générés augmente etc.

        Sur les steering behaviors :

    Regarder mon cours et les exemples du repo github : http://miageprojet2.unice.fr/Intranet_de_Michel_Buffa/Master_IA2_Casablanca_2023-2024%3a_IA_pour_les_jeux
    Je vais vous passer une version de ce repo "augmentée" par du live coding que j'ai fait en classe lorsque j'ai donné le cours....
    Travail à faire : lire l'article de Craig Reynolds qui est référencé dans les slides du Google doc du cours, et après avoir étudié les autres exemples de mes repos et du cours, essayer d'implémenter les comportements manquants:
        Wall Following
        Queuing
        Vector Fields (il y a des implémentations dans des exemples du Coding Train, voir en-dessous des vidéos les contributions des utilisateurs)

Pour BabylonJS :

    Prendre les steering behaviors (commencer par quelques-uns des simples) et les implémenter dans le plan XZ (en 2D), avec la classe Vector3 de babylonJS, des véhicules simples (pyramides)

Sur le pathFinding :

    Expliquer l'algo A* et démo de A* + steering behaviors. Explications de A* ici: https://thecodingtrain.com/challenges/51-a-pathfinding-algorithm
    Regarder par exemple https://github.com/matheuslrsouza/particle-filter-js

    Tu peux tester ici : https://matheuslrsouza.github.io/particle-filter-js/

Pour algo génétique :

    Regarder le livre The Nature of Code 2, chapitre sur les algos génétiques (chapitre 9): https://thecodingtrain.com/tracks/the-nature-of-code-2 
    Regarder coding challenge sur flappy bird neuroevolutif https://www.youtube.com/watch?v=c6y21FkaUqw
    Regarder video sur véhicules qui suivent la piste : https://www.youtube.com/watch?v=mXDrH0wStHs
