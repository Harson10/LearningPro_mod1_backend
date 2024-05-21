import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/Database";
import Module from "./Module";



class Etape extends Model {
    public num_etape!: number;
    public nom_etape!: string;
    public texte!: string;
    public code_module!: number;
    public pdf_path?: string;  // Nouvelle colonne pour le chemin du fichier PDF

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public module!: Module;
}

Etape.init(
    {
        num_etape: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nom_etape: { type: DataTypes.STRING(30), allowNull: false },
        texte: { type: DataTypes.TEXT, allowNull: false },
        code_module: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Module,
                key: 'code_module',
            },
        },
        pdf_path: {  // Définition de la colonne pdf_path
            type: DataTypes.STRING,
            allowNull: true,  // Permet d'être null si pas de fichier PDF
        },
    },
    {
        sequelize,
        modelName: "etape",
        tableName: "etape",
    }
);

Etape.belongsTo(Module, {
    foreignKey: "code_module",
    as: "module",
});

export default Etape;

