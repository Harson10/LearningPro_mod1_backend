import { Router } from "express";
import {
  creerParticipant,
  rapporterParticipants,
  rapporterParCodeParticipant,
  modifierParticipant,
  supprimerParticipant,
  supprimerParticipantParCodeUtilisateur,
} from "../../../controllers/utilisateurs/Participant/ControleurParticipant";

const routeurParticipant = Router();

// Routes pour les opérations CRUD des participants
routeurParticipant.post("/creer/", creerParticipant);
routeurParticipant.get("/", rapporterParticipants);
routeurParticipant.get("/:code_participant", rapporterParCodeParticipant);
routeurParticipant.put("/modifier/:code_participant", modifierParticipant);
routeurParticipant.delete("/supprimer/:code_participant", supprimerParticipant);
routeurParticipant.delete("/supprimer/par_utilisateur/:code_utilisateur",  supprimerParticipantParCodeUtilisateur);

export default routeurParticipant;