// models/Formation.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/Database";

class Formation extends Model {
    code_formation!: number;
    nom_formation!: string;
    cout_formation!: number;
    publication!: boolean;
}

Formation.init(
    {
        code_formation: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom_formation: { type: DataTypes.STRING(30) },
        cout_formation: { type: DataTypes.INTEGER },
        publication: { type: DataTypes.STRING(3) }
    },
    {
        sequelize,
        modelName: "formation",
        tableName: "formation",
    }
);

export default Formation;
