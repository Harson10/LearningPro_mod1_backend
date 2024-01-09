import { Router } from "express";
import {
    creerFormation,
    rapporterFormations,
    rapporterParCodeFormation,
    modifierFormation, 
    supprimerFormation,
} from "../../../controllers/Formation/Contenu/ControleurFormation";

const routeurFormation = Router();

routeurFormation.post("/creer/", creerFormation);
routeurFormation.get("/", rapporterFormations);
routeurFormation.get("/:code_formation", rapporterParCodeFormation);
routeurFormation.put("/modifier/:code_formation", modifierFormation);
routeurFormation.delete("/supprimer/:code_formation", supprimerFormation);

export default routeurFormation;