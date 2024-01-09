import { Router } from "express";
import {
  creerRole,
  rapporterRoles,
  rapporterParCodeRole,
  modifierRole,
  supprimerRole,
} from "../../controllers/utilisateurs/ControleurRole";

const routeurRole = Router();

// Route pour les opérations CRUD
routeurRole.post("/creer/", creerRole);
routeurRole.get("/", rapporterRoles);
routeurRole.get("/:code_role", rapporterParCodeRole);
routeurRole.put("/modifier/:code_Role", modifierRole);
routeurRole.delete("/supprimer/:code_Role", supprimerRole);


export default routeurRole;