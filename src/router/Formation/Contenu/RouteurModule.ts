import { Router } from "express";
import {
    creerModule,
    rapporterModulesParCodeFormation,
    rapporterModules,
    rapporterParCodeModule,
    modifierModule,
    supprimerModule,
    nombreModulesParCodeFormation,
    sommeCoutModulesParCodeFormation
} from "../../../controllers/Formation/Contenu/ControleurModule";

const routeurModule = Router();

routeurModule.post("/creer/", creerModule);
routeurModule.get("/par_formation/:code_formation", rapporterModulesParCodeFormation);
routeurModule.get("/", rapporterModules);
routeurModule.get("/:code_module", rapporterParCodeModule);
routeurModule.put("/modifier/:code_module", modifierModule);
routeurModule.delete("/supprimer/:code_module", supprimerModule);
routeurModule.get("/nombre_par_formation/:code_formation", nombreModulesParCodeFormation);
routeurModule.get("/somme_cout_par_formation/:code_formation", sommeCoutModulesParCodeFormation);

export default routeurModule;
                                                                        