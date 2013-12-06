Workbook
========

Workbook est un intranet relationnel. Il permet aux employés d’une entreprise de rechercher et consulter rapidement une fiche d’un collègue. Un tableau d’activité lui permet également de se tenir au courant des différents événements programmés par l’entreprise ou par les collaborateurs.

----------

Table of contents
-----------------

You can insert a table of contents using the marker:

[TOC]


Présentation fonctionnelle
--------------------------
- Identification requise
- Accès à quatre pages
  - Tableaux d’activités
    - Liste des messages des utilisateurs et administrateurs
    - Possibilité d’écrire un message
    - Possibilité de commenter et de liker
  - Recherche profil
    - Recherche sur tous les critères d’informations personnels
  - Mapping collaborateurs
    - carte gmap pour l’affichage du lieu de toutes les missions ou résidences
  - Edition de ses informations personnels
    - Photo
    - Prénom
    - Nom
    - Adresse de la mission
    - Adresse de résidence (facultative)
    - Technologies de prédilection
    - Liens sociaux (github, facebook, viadeo,...)

Directive technique
--------------------------
- Développement d’un front et d’un back (api)
- Application Front
  - Framework AngularJs
  - Framework css Bootstrap
  - Cadre de développement structuré et par scaffolding pour l’architecture principale (yeoman => grunt et bower)
- Application Back (api)
  - serveur http node.js
  - framework express.js
  - Base de données en MongoDb (mais possibilité de se diriger également par la suite sur des bases de graph comme
  - neo4j et de full text search comme elasticsearch)
  - Authentification par passport.js
  - Gestion des photos profil par jQuery-File-Upload
  - Mapping des adresses avec GMaps Api
- Gestion de projet sur Github
- Déploiement et test en ligne via Heroku
