# Guide d'Utilisation du Projet

## Installation

1. Clonez le projet depuis GitHub et installez les dépendances :
    ```bash
    git clone https://github.com/Etablissement-Ralaivao/LearningPro_mod1_backend.git
    cd LearningPro_mod1_backend
    ```
    
2. Installez les dépendances nécessaires :
    ```bash
    yarn install
    ```

## Créez le fichier ".env" à la racine du projet avec les valeurs suivantes:
    POSTGRES_HOST='0.0.0.0'
    POSTGRES_PORT=5432
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=pga
    POSTGRES_DB=learning_pro_mod1
    JWT_SECRET=test_jwt2


## Démarrage du Serveur

   Utilisez la commande suivante pour démarrer le serveur :
    ```bash
    yarn start-dev
    ```

   Ouvrez une invite de commande en tant qu'administrateur sur windows et cherchez l'adresse IP de l'ordinateur qui va servir de serveur (adresse Ipv4):
    ```bash
    ipconfig
    ```
    
   Le serveur sera accessible à l'adresse `http://{ADR_IP_PC_SERVEUR}:4000`.

## Accès à Swagger

   Ouvrez votre navigateur et accédez à Swagger :
    ```
    http://{ADR_IP_PC_SERVEUR}:4000/api-docs
    ```

## Création de Rôles

   1. Créez respectivement et strictement les rôles suivants :
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

Ceci conclut le guide d'utilisation du backend. Pour toute question, veuillez contacter le developpeur concerné.
