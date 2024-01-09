import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/Database";
import Utilisateur from "../Utilisateur";
import Groupe from "./Groupe";
class Participant extends Model {
  code_participant!: number;
  code_utilisateur!: number;
  code_groupe!: number;
  dateNaiss!: Date;
  lieuNaiss!: string;
  numCIN!: string;
  nomTuteur!: string;
  prenomTuteur!: string;
  niveau!: string;
  diplome!: string;
  utilisateur!: Utilisateur;
  groupe!: Groupe;

  
  static attributes = {
    code_participant: {
      type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true,
    },
    code_utilisateur: { type: DataTypes.INTEGER, allowNull: false },
    code_groupe: { type: DataTypes.INTEGER, allowNull: false },
    dateNaiss: { type: DataTypes.DATE, allowNull: false },
    lieuNaiss: { type: DataTypes.STRING(15), allowNull: false },
    numCIN: { type: DataTypes.STRING(15), allowNull: false },
    nomTuteur: { type: DataTypes.STRING(50), allowNull: false },
    prenomTuteur: { type: DataTypes.STRING(30), allowNull: false },
    niveau: { type: DataTypes.STRING(15), allowNull: false },
    diplome: { type: DataTypes.STRING(30), allowNull: false },
  };
}
Participant.init(Participant.attributes, {
  sequelize,
  modelName: "participant",
  tableName: "participant",
});
Participant.belongsTo(Utilisateur, {
  foreignKey: "code_utilisateur",
  as: "utilisateur",
});
Participant.belongsTo(Groupe, {
  foreignKey: "code_groupe",
  as: "groupe",
});
export default Participant;
