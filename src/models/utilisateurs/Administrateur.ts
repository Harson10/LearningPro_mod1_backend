import { DataTypes, Model } from 'sequelize';
import  sequelize  from '../../config/Database';
import Utilisateur  from './Utilisateur';

class Administrateur extends Model {
  code_admin!: number;
  code_utilisateur!: number;

  // Relation avec Utilisateur
  utilisateur!: Utilisateur;

  // Définition des attributs du modèle
  static attributes = {
    code_admin: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  };
}

// Initialisation du modèle avec Sequelize
Administrateur.init(Administrateur.attributes, {
  sequelize,
  modelName: "administrateur",
  tableName: "administrateur", 
});

// Définition de la relation avec Utilisateur
Administrateur.belongsTo(Utilisateur, {
  foreignKey: "code_utilisateur",
  as: "administrateur",
});


export default Administrateur;
