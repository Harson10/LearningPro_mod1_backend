// models/Evaluation.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../../../config/Database";
import Participant from "../../utilisateurs/Participant/Participant";
import Module from "./Module";
import Formateur from "../../utilisateurs/Formateur";

class Evaluation extends Model {
    num_evaluation!: number;
    date_evaluation!: Date;
    observation!: string;
    note!: number;
    code_participant!: number;
    code_module!: number; // Modification de la relation avec le module
    code_formateur!: number;

    participant!: Participant;
    module!: Module;
    formateur!: Formateur;

    static attributes = {
        num_evaluation: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date_evaluation: { type: DataTypes.DATE },
        observation: { type: DataTypes.STRING },
        note: { type: DataTypes.FLOAT },
        code_participant: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        code_module: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        code_formateur: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }
};

Evaluation.init(Evaluation.attributes, {
    sequelize,
    modelName: "evaluation",
    tableName: "evaluation",
});

Evaluation.belongsTo(Participant, {
    foreignKey: "code_participant",
    as: "contenu_participant",
});

Evaluation.belongsTo(Module, {
    foreignKey: "code_module",
    as: "contenu_module",
});

Evaluation.belongsTo(Formateur, {
    foreignKey: "code_formateur",
    as: "contenu_formateur",
});

export default Evaluation;
