# Guide d'Utilisation du Projet

## Installation

1. Clonez le projet depuis GitHub et installez les dépendances :
    ```bash
    git clone https://github.com/Etablissement-Ralaivao/LearningPro_mod1_backend.git
    cd votre-projet
    yarn install
    ```

## Démarrage du Serveur

   Utilisez la commande suivante pour démarrer le serveur en mode développement :
    ```bash
    yarn start-dev
    ```

   Le serveur sera accessible à l'adresse `http://localhost:4000`.

## Accès à Swagger

   Ouvrez votre navigateur et accédez à Swagger :
    ```
    http://localhost:4000/api-docs
    ```

## Création de Rôles

   1. Créez les rôles suivants :
      - "Administrateur"
      - "Formateur"
      - "Participant"

## Création d'un Utilisateur Administrateur

   Utilisez Swagger pour créer un utilisateur Administrateur à l'endpoint `/utilisateur/creer` en utilisant le code_role de rôle fraîchement créé.

## Authentification

   1. Utilisez l'endpoint `/utilisateur/connexion` pour vous authentifier.

   2. Copiez le token fourni dans la réponse.

## Configuration de Swagger pour l'Authentification

   1. Sur la page Swagger, remontez jusqu'au bouton "Authorize".

   2. Cliquez sur le bouton et collez le token dans le champ de saisie.

Vous pouvez maintenant effectuer d'autres opérations dans Learning Pro en utilisant Swagger OpenAPI.

---

Ceci conclut le guide d'utilisation du projet. Pour toute question, veuillez contacter le developpeur concerné.
