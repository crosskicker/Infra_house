# Infra_house

To deploy an infrastrcuture auto via a web interface

### TODO

- Network config after user choice
- Generate SSH keys
- Sign up page
- Infra view page
  - Bouton destroy
  - Shell ssh to control
    - je vais installer tty-share sur mes vms via le cloud init et recuperer l'url afin que les users de mon appli puisse avoir un terminal, meme si jke pense que je ferais mieux de me connecter en ssh a ma vm via un script pour lancer la commande tty-share et recuperer la sortie depuis mon appli, j'install depuis le cloud init et je lance le terminal depuis mon backend je pense c'ets mieux comme ca je pourrais réitérer l'operation
  - Pannel view about VM
- Modify infra
  - Separate VM ; network
  - Add VM in an infra
- Permettre une config avancé VM
  - sous menu de config
- Mecanisme de logout coté front
- Gestion des network coté backend
  - gerer les differents réseau nat
    - ne pas créer deux fois le meme
    - permetrre de se connecter a un NAT existant ?

### TODO GENERAL


-
- ISOLER LES VMS

  - un réseau nat par VM
  - ameliorer la config reseau pour le user
- Gerer les états  systeme lors des changements d'infra
- <b>Gérer le monitoring des ressources</b>
- Générer des logs pour les différentes activités via logging module !!!!
- Gérer les erreurs front et back !!!!!!!!!
-
-
-
