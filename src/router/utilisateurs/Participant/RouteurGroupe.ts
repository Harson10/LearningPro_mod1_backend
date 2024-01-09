import { Router } from "express";
import {
  creerGroupe,
  rapporterGroupes,
  rapporterParCodeGroupe,
  modifierGroupe,
  supprimerGroupe,
} from "../../../controllers/utilisateurs/Participant/ControleurGroupe";

const routeurGroupe = Router();

// Route pour les opérations CRUD
routeurGroupe.post("/creer/", creerGroupe);
routeurGroupe.get("/", rapporterGroupes);
routeurGroupe.get("/:code_groupe", rapporterParCodeGroupe);
routeurGroupe.put("/modifier/:code_groupe", modifierGroupe);
routeurGroupe.delete("/supprimer/:code_groupe", supprimerGroupe);

export default routeurGroupe;
