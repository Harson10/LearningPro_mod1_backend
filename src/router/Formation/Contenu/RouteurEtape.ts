import { Router } from "express";
import {
    creerEtape, 
    rapporterEtapes,
    rapporterParNumEtape,
    rapporteEtapeParCodeModule,
    rapporteNbEtapeParCodeModule,
    modifierEtape,
    supprimerEtape,
    supprimerEtapeParCodeModule
} from "../../../controllers/Formation/Contenu/ControleurEtape";

const routeurEtape = Router();

routeurEtape.post("/creer/", creerEtape);
routeurEtape.get("/", rapporterEtapes);
routeurEtape.get("/:num_etape", rapporterParNumEtape);
routeurEtape.get("/rapporter_par_module/:code_module", rapporteEtapeParCodeModule);
routeurEtape.get("/nombre_par_module/:code_module", rapporteNbEtapeParCodeModule);
routeurEtape.put("/modifier/:num_etape", modifierEtape);
routeurEtape.delete("/supprimer/:num_etape", supprimerEtape);
routeurEtape.delete("/supprimer/par_module/:code_module", supprimerEtapeParCodeModule);

export default routeurEtape;