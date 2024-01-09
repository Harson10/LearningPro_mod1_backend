import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/Database";
import Module from "./Module";

class Etape extends Model {
    num_etape!: number;
    nom_etape!: string;
    texte!: string;
    code_module!: number; // Modification de la relation avec le module

    module!: Module;

    static attributes = {
        num_etape: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nom_etape: { type: DataTypes.STRING(30) },
        texte: { type: DataTypes.STRING },
        code_module: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    };
}

Etape.init(Etape.attributes, {
    sequelize, 
    modelName: "etape",
    tableName: "etape"
});

Etape.belongsTo(Module, {
    foreignKey: "code_module",
    as: "module",
});

export default Etape;
