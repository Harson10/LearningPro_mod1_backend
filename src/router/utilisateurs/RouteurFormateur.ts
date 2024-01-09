import { Router } from "express";
import {
  creerFormateur,
  rapporterFormateurs,
  rapporterParCodeFormateur,
  modifierFormateur,
  supprimerFormateur,
  supprimerFormateurParCodeUtilisateur
} from "../../controllers/utilisateurs/ControleurFormateur";

const routeurFormateur = Router();

// Routes pour les opérations CRUD des formateurs
routeurFormateur.post("/creer/", creerFormateur);
routeurFormateur.get("/", rapporterFormateurs);
routeurFormateur.get("/:code_formateur", rapporterParCodeFormateur);
routeurFormateur.put("/modifier/:code_formateur", modifierFormateur);
routeurFormateur.delete("/supprimer/:code_formateur", supprimerFormateur);
routeurFormateur.delete("/supprimer/par_utilisateur/:code_utilisateur", supprimerFormateurParCodeUtilisateur);

export default routeurFormateur;
