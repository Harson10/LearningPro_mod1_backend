// export default Module;


import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/Database";
import Formation from "./Formation";

class Module extends Model {
    code_module!: number;
    nom_module!: string;
    cout_module!: number;
    code_formation!: number;
    formation!: Formation
}

Module.init(
    {
        code_module: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nom_module: { type: DataTypes.STRING(30) },
        cout_module: { type: DataTypes.INTEGER },
        code_formation: { type: DataTypes.INTEGER },
    },
    {
        sequelize,
        modelName: "module",
        tableName: "module",
    }
);


Module.belongsTo(Formation, {
    foreignKey: "code_formation",
    as: "formation",
});

export default Module;