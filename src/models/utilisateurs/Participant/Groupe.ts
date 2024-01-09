import { DataTypes, Model } from 'sequelize';
import sequelize from '../../../config/Database';

class Groupe extends Model {
  code_groupe!: number;
  nom_groupe!: string;
}

Groupe.init(
  {
    code_groupe: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nom_groupe: { type: DataTypes.STRING(30) },
  },
  {
    sequelize,
    modelName: 'groupe',
    tableName: 'groupe',
  }
);

export default Groupe;
