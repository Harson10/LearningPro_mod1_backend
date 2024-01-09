// Database.ts

import { Sequelize } from "sequelize";
import { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST } from "./env";

// Authentifier l'instance Sequelize après la création de la base de données
const Database = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: "postgres",
  }
);

// Fonction pour créer la base de données si elle n'existe pas
export const createDatabaseIfNotExists = async () => {
  try {
    // Créer l'instance Sequelize à l'intérieur de la fonction
    const sequelize = new Sequelize({
      host: DB_HOST,
      username: DB_USER,
      password: DB_PASSWORD,
      dialect: "postgres",
      logging: false,
    });

    // Vérifier si la base de données existe déjà
    const databaseExists = await sequelize.getQueryInterface().sequelize.query(
      `SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`
    );

    if (databaseExists[0].length === 0) {
      // Créer la base de données si elle n'existe pas
      await sequelize.getQueryInterface().createDatabase(DB_NAME);
      console.log(`Base de données '${DB_NAME}' créée avec succès.`);
    } else {
      console.log(`La base de données '${DB_NAME}' existe déjà.`);
    }

    

    await Database.authenticate();
    console.log(`Connexion à la base de données établie avec succès.`);

    // Ajouter le code de synchronisation de la base de données ici si nécessaire

    // Fermer l'instance Sequelize
    await sequelize.close();

  } catch (error) {
    console.error(`Erreur lors de la création de la base de données:`, error);
  }
};


export default  Database;
