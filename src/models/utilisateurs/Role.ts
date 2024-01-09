import { DataTypes, Model } from 'sequelize';
import  sequelize from "../../config/Database";

class Role extends Model {
    code_role! : number;
    role! : string;
}

Role.init(
    {
        code_role: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        role: { type: DataTypes.STRING(14) },
    },
    {
        sequelize,
        modelName: "role",
        tableName: "role",
      }
);

export default Role;