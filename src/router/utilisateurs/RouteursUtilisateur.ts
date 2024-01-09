import { Router } from "express";
// import Authentification from "../../middlewares/Authentification";
import {
  AuthUtilisateur,
  creerUtilisateur,
  rapporterUtilisateurs,
  rapporterParCodeUtilisateur,
  rapporterUtilisateursParRole,
  modifierUtilisateur,
  supprimerUtilisateur,
  nombreTotalUtilisateur,
  nombreAdministrateurs,
  nombreFormateurs,
  nombreParticipants,
  dernierUtilisateurCree

} from "../../controllers/utilisateurs/ControleurUtilisateur";

const routeurUtilisateur = Router();

routeurUtilisateur.post('/connexion/', AuthUtilisateur);
routeurUtilisateur.post("/creer/", creerUtilisateur);
routeurUtilisateur.post("/dernier_utilisateur", dernierUtilisateurCree);
routeurUtilisateur.put("/modifier/:code_utilisateur",  modifierUtilisateur);
routeurUtilisateur.delete("/supprimer/:code_utilisateur",  supprimerUtilisateur);
routeurUtilisateur.get("/", rapporterUtilisateurs);
routeurUtilisateur.get("/:code_utilisateur", rapporterParCodeUtilisateur);
routeurUtilisateur.get("/role/participants", rapporterUtilisateursParRole);
routeurUtilisateur.get("/nombre/total", nombreTotalUtilisateur);
routeurUtilisateur.get("/nombre/administrateur", nombreAdministrateurs);
routeurUtilisateur.get("/nombre/formateur", nombreFormateurs);
routeurUtilisateur.get("/nombre/participant", nombreParticipants);

export default routeurUtilisateur;