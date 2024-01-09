import { Router } from "express";
import {
  creerAdministrateur,
  rapporterAdministrateurs,
  rapporterParCodeAdministrateur,
  modifierAdministrateur,
  supprimerAdministrateur,
  supprimerAdministrateurtParCodeUtilisateur
} from "../../controllers/utilisateurs/ControleurAdministrateur";

const routeurAdministrateur = Router();

// Routes pour les opérations CRUD des administrateurs
routeurAdministrateur.post("/creer/", creerAdministrateur);
routeurAdministrateur.get("/", rapporterAdministrateurs);
routeurAdministrateur.get("/code_administrateur", rapporterParCodeAdministrateur);
routeurAdministrateur.put("/modifier/:code_administrateur", modifierAdministrateur);
routeurAdministrateur.delete("/supprimer/:code_administrateur", supprimerAdministrateur);
routeurAdministrateur.delete("/supprimer/par_utilisateur/:code_utilisateur", supprimerAdministrateurtParCodeUtilisateur);

export default routeurAdministrateur;
