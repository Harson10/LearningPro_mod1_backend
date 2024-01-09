import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/Database';
import Utilisateur from './Utilisateur';

class Formateur extends Model {
  code_formateur!: number;
  code_utilisateur!: number;

  // Relation avec Utilisateur
  utilisateur!: Utilisateur;

  // Définir les attributs du modèle
  static attributes = {
    code_formateur: {
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

// Initialiser le modèle avec Sequelize
Formateur.init(Formateur.attributes, {
  sequelize,
  modelName: 'formateur',
  tableName: 'formateur', 
});

// Définir la relation avec Utilisateur
Formateur.belongsTo(Utilisateur, {
  foreignKey: 'code_utilisateur',
  as: 'formateur', 
});

export default Formateur;
