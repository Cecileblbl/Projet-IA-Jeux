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
