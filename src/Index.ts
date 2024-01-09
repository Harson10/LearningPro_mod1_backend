import express from "express";
import bodyParser from "body-parser";
import { createDatabaseIfNotExists } from "./config/Database";
import Database from "./config/Database";
import RouteurUtilisateur from "./router/utilisateurs/RouteursUtilisateur";
import RouteurGroupe from "./router/utilisateurs/Participant/RouteurGroupe";
import RouteurAdministrateur from "./router/utilisateurs/RouteurAdministrateur";
import RouteurFormateur from "./router/utilisateurs/RouteurFormateur";
import RouteurParticipant from "./router/utilisateurs/Participant/RouteurParticipant";
import RouteurModule from "./router/Formation/Contenu/RouteurModule";
import RouteurEtape from "./router/Formation/Contenu/RouteurEtape";
import RouteurFormation from "./router/Formation/Contenu/RouteurFormation";
import RouteurPaiement from "./router/Formation/Transaction/RouteurPaiement";
import RouteurEvaluation from "./router/Formation/Contenu/RouteurEvaluation";
import { Authentification } from "./middlewares/Authentification";
import RouteurRole from "./router/utilisateurs/RouteurRole";
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const cors = require("cors");
const App = express();
const port = process.env.PORT || 4000;

/**
 * 1. Creer la base de données avec l'invite de commande shell de postgres:
 * CREATE DATABASE learning_pro_mod1
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'French_France.1252'
    LC_CTYPE = 'French_France.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

    2. Lancer l'application avec la commande: `yarn start-dev`
 */

// Adresse de l'application React en front-end
// App.use(cors({ origin: 'http://localhost:3000' }));
App.use(cors());
App.use(bodyParser.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rest API LearningPro',
      version: '1.0.0',
      description: 'Documentation pour le côté back-end de LearningPro',
    },
  },
  apis: ['./src/controllers/**/*.ts', './src/router/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Liaison des routes
App
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  .use("/role", RouteurRole)
  .use("/utilisateur", RouteurUtilisateur)
  .use(Authentification)
  .use("/groupe", RouteurGroupe)
  .use("/administrateur", RouteurAdministrateur)
  .use("/formateur", RouteurFormateur)
  .use("/participant", RouteurParticipant)
  .use("/module", RouteurModule)
  .use("/etape", RouteurEtape)
  .use("/formation", RouteurFormation)
  .use("/paiement", RouteurPaiement)
  .use("/evaluation", RouteurEvaluation);

  
  createDatabaseIfNotExists().then(() => {
    return Database.sync();
  }).then(() => {
    console.log(`Base de données synchronisée.`);

    App.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur le port ${port}`);
    });
  }).catch((error) => {
    console.error(`Erreur lors de l'initialisation de la base de données et du serveur:`, error);
  });

