import { Router } from "express";
import {
  creerEvaluation,
  rapporterEvaluations,
  rapporterParNumEvaluation,
  modifierEvaluation,
  supprimerEvaluation,
} from "../../../controllers/Formation/Contenu/ControleurEvaluation";

const routeurEvaluation = Router();

// Routes pour les opérations CRUD des administrateurs
routeurEvaluation.post("/creer/", creerEvaluation);
routeurEvaluation.get("/", rapporterEvaluations);
routeurEvaluation.get("/:num_evaluation", rapporterParNumEvaluation);
routeurEvaluation.put("/modifier/:num_evaluation", modifierEvaluation);
routeurEvaluation.delete("/supprimer/:num_evaluation", supprimerEvaluation);

export default routeurEvaluation;