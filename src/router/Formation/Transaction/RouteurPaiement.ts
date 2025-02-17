import { Router } from "express";
import {
  creerPaiement,
  rapporterPaiements,
  rapporterPaiementsParFormationUtilisateur,
  rapporterParNumFacture,
  modifierPaiement,
  supprimerPaiement,
} from "../../../controllers/Formation/Transaction/ControleurPaiement";

const routeurPaiement = Router();

// Routes pour les opérations CRUD des administrateurs
routeurPaiement.post("/creer/", creerPaiement);
routeurPaiement.get("/", rapporterPaiements);
routeurPaiement.get("/formation-utilisateur/:code_formation/:code_utilisateur", rapporterPaiementsParFormationUtilisateur);
routeurPaiement.get("/:num_facture", rapporterParNumFacture);
routeurPaiement.put("/modifier/:num_facture", modifierPaiement);
routeurPaiement.delete("/supprimer/:num_facture", supprimerPaiement);

export default routeurPaiement;