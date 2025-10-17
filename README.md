# Infra_house

To deploy an infrastrcuture auto via a web interface

### TODO

- Network config after user choice
- Generate SSH keys
- Permettre une config avancé VM
  - sous menu de config
- Mecanisme de logout coté front
- Gestion des network coté backend
  - gerer les differents réseau nat
    - ne pas créer deux fois le meme
    - permetrre de se connecter a un NAT existant ?

### TODO GENERAL

* Gérer le logout
  * Sécuriser le token

- ISOLER LES VMS

  - un réseau nat par VM
  - ameliorer la config reseau pour le user
- Geer les erreur de control des form et retour erreur (affichage)
- Gerer les états  systeme lors des changements d'infra
- <b>Gérer le monitoring des ressources</b>
- Gérer le visu du tableau de bord infra
- Gérer les états du shell au cours de son cycle de vie
- Gérer le dispplay des erreurs des forms (deploy vm)
- Visualiser un schéma d'infra réalisé
- Créer une page profil
- Gérer les states des VMs pour ajouter des options
- PERMETTRE la modification d'un VM, changer sa ram etc ...

  - suffit de changer les var et relancer le main.tf avec apply ?
  - eteindre une VM "running = false   # VM éteinte"

TODO ADMIN

* Générer un pannel admin  pour voir les ressources serveur
  * tailles des volumes
  * nombres de vm
  * ressources utilisée
  * nombre de disk (tailles etc)
