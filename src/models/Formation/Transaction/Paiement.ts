import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/Database";
import Formation from "../Contenu/Formation";
import Participant from "../../utilisateurs/Participant/Participant";
import Utilisateur from "../../utilisateurs/Utilisateur";

class Paiement extends Model {
  num_facture!: number;
  date_paiement!: Date;
  tranche_paiement!: number;
  montant!: number;
  reste!: number
  code_formation!: number;
  code_participant!: number;
  code_utilisateur!: number;

  // Relation avec les autres modèles concernés
  formation!: Formation;
  participant!: Participant;
  utilisateur!: Utilisateur;

  // Définition des attributs du modèle
  static attributes = {
    num_facture: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    date_paiement: { type: DataTypes.DATE },
    tranche_paiement: { type: DataTypes.INTEGER },
    montant: { type: DataTypes.INTEGER },
    reste: { type: DataTypes.INTEGER },

    code_formation: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    code_participant: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    code_utilisateur: { 
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  }
};

Paiement.init(Paiement.attributes, {
  sequelize,
  modelName: "paiement",
  tableName: "paiement",
});

Paiement.belongsTo(Formation, {
  foreignKey: "code_formation",
  as: "transaction_formation",
});

Paiement.belongsTo(Participant, {
  foreignKey: "code_participant",
  as: "transaction_participant",
});

Paiement.belongsTo(Utilisateur, {
  foreignKey: "code_participant",
  as: "transaction_utilisateur",
});

export default Paiement;