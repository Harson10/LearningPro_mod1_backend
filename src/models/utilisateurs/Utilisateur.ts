import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/Database";
import Role from "./Role";

class Utilisateur extends Model {
  code_utilisateur!: number;
  code_role!: number;
  nom!: string;
  prenom!: string;
  adresse!: string;
  sexe!: string;
  profession!: string;
  mot_de_passe!: string;
}

Utilisateur.init(
  {
    code_utilisateur: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code_role: { type: DataTypes.INTEGER },
    nom: { type: DataTypes.STRING(50) },
    prenom: { type: DataTypes.STRING(30) },
    adresse: { type: DataTypes.STRING(70) },
    sexe: { type: DataTypes.STRING(9) },
    profession: { type: DataTypes.STRING(15) },
    mot_de_passe: { type: DataTypes.STRING(8) },
  },
  {
    sequelize,
    modelName: "utilisateur",
    tableName: "utilisateur",
  }
);

Utilisateur.belongsTo(Role, {
  foreignKey: "code_role",
  as: "role",
})

export default Utilisateur;
