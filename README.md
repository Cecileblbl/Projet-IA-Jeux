# IA_Jeux
Sujet : développer des exemples et tutoriaux sur les algorithmes utilisés pour gérer les déplacements d'entités autonomes (véhicules, PNJs etc) dans les jeux avec de l'animation à 30 ou 60 images/s (ou plus)

    
# Queuing


Ce comportement est décrit par Craig Reynolds de la façon suivante :  

La file d'attente résulte d'un comportement de direction qui produit un freinage (décélération) lorsque le véhicule détecte d'autres véhicules qui sont : à proximité, devant lui, et se déplaçant plus lentement que lui-même. De plus, ces véhicules sont attirés vers la "porte" par un comportement seek, ils évitent les murs et maintiennent une distance les uns des autres. Une contrainte cinématique empêche qu'ils se chevauchent entre véhicules ou avec les murs. 

Ce comportement a d'abord été implémenté en p5js en suivant ces instructions.  
Nous avons utilisé les exemples du cours pour les comportements de séparation et de seek. Il a fallu créer la fonction d’évitement des murs qui utilise la projection. Le détail sur les méthodes implémentées se trouvent dans le readme du dossier queueing.  

# Wall following


Le suivi de mur est une variante du suivi de chemin, où le véhicule maintient un écart constant par rapport à un mur en se déplaçant parallèlement à celui-ci.  

 
Le véhicule prédit sa position future en fonction de sa vitesse actuelle, identifiant un point de prédiction. Ce point est ensuite projeté sur le chemin pour déterminer le point le plus proche, calculé comme une projection perpendiculaire sur la surface du mur. À partir de ce point projeté, la normale du mur est calculée, ce qui permet de définir un point cible à la distance souhaitée du mur, en s'éloignant le long de cette normale. Le véhicule utilise alors un comportement de recherche pour se diriger vers ce point cible. 

# Croisement de chemin  

Le croisement de chemin se produit lorsque plusieurs trajectoires se rencontrent ou se superposent, créant des points de convergence où les entités doivent s’éviter.  
Pour gérer les croisements de chemin, plusieurs stratégies peuvent être employées. Une approche courante est l'évitement de collision non aligné, où les entités en mouvement dans des directions différentes prévoient les collisions potentielles et modifient leur direction et leur vitesse pour les éviter.  

 
Une autre technique pour gérer le croisement de chemin est le suivi de champ de flux. Cette méthode utilise un champ de vecteurs pour diriger le mouvement des entités en fonction de leur position dans l'environnement. Les entités échantillonnent la direction du flux à leur position future prévue et ajustent leur trajectoire pour s'aligner avec cette direction, minimisant ainsi les risques de collision aux points de croisement. 
Nous avons choisi d’utiliser la première technique pour simuler le croisement de chemin. 


# Génétiques

Voiture est l'apprentissage à la conduite
Le but est de simuler une évolution artificielle où les véhicules apprennent à piloter sur une piste aléatoire.  

Missilles est l'apprentissage à atteindre une cible
Le but est de simuler le comportement d'une population de fusées (rockets) cherchant à atteindre une cible en esquivant un obstacle
