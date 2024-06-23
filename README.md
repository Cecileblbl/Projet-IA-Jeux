# IA_Jeux
Sujet : développer des exemples et tutoriaux sur les algorithmes utilisés pour gérer les déplacements d'entités autonomes (véhicules, PNJs etc) dans les jeux avec de l'animation à 30 ou 60 images/s (ou plus)

# Algorithmes
    
# Queuing

Comportement simulant une file d'attente
La file d'attente résulte d'un comportement de direction qui produit un freinage (décélération) lorsque le véhicule détecte d'autres véhicules qui sont : à proximité, devant lui, et se déplaçant plus lentement que lui-même.

# Wall following

Comportement simulant le suivant d'un mur

Le suivi de mur est une variante du suivi de chemin, où le véhicule maintient un écart constant par rapport à un mur en se déplaçant parallèlement à celui-ci.  


# Croisement de chemin  

Simuler un groupe d'entités qui "Wander" sans entrer en collisions

Le croisement de chemin se produit lorsque plusieurs trajectoires se rencontrent ou se superposent, créant des points de convergence où les entités doivent s’éviter.  
Pour gérer les croisements de chemin, plusieurs stratégies peuvent être employées. Une approche courante est l'évitement de collision non aligné, où les entités en mouvement dans des directions différentes prévoient les collisions potentielles et modifient leur direction et leur vitesse pour les éviter.  




# Génétiques

Voiture est l'apprentissage à la conduite
Le but est de simuler une évolution artificielle où les véhicules apprennent à piloter sur une piste aléatoire.  

Missilles est l'apprentissage à atteindre une cible
Le but est de simuler le comportement d'une population de fusées (rockets) cherchant à atteindre une cible en esquivant un obstacle

# Visualisateur

Permet de visualiser les différents steering behaviors sur un site

# Babylon

Adaptation des steering behavior en 3D avec BabylonJs
