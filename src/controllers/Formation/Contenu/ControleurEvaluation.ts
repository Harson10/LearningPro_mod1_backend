import { Request, Response } from "express";
import Evaluation from "../../../models/Formation/Contenu/Evaluation";

/**
 * @swagger
 * components:
 *   schemas:
 *     Evaluation:
 *       type: object
 *       properties:
 *         date_evaluation:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         observation:
 *           type: string
 *           example: "Bonne participation"
 *         note:
 *           type: number
 *           example: 85
 *         code_participant:
 *           type: number
 *           example: 123
 *         code_module:
 *           type: number
 *           example: 456
 *         code_formateur:
 *           type: number
 *           example: 789
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */ 


// Creation d'une evaluation
/**
 * @swagger
 * /evaluation/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'une nouvelle évaluation
 *     description: Crée une nouvelle évaluation associée à un participant, un module et un formateur existants.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_evaluation:
 *                 type: string
 *                 format: date
 *                 description: La date de l'évaluation.
 *                 example: "2023-01-01"
 *               observation:
 *                 type: string
 *                 description: Les observations sur l'évaluation.
 *                 example: "Bonne participation"
 *               note:
 *                 type: number
 *                 description: La note attribuée lors de l'évaluation.
 *                 example: 85
 *               code_participant:
 *                 type: number
 *                 description: Le code du participant associé à l'évaluation.
 *                 example: 123
 *               code_module:
 *                 type: number
 *                 description: Le code du module associé à l'évaluation.
 *                 example: 456
 *               code_formateur:
 *                 type: number
 *                 description: Le code du formateur associé à l'évaluation.
 *                 example: 789
 *     responses:
 *       200:
 *         description: Évaluation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluation'
 *       500:
 *         description: Erreur serveur lors de la création de l'évaluation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création de l'évaluation.
 */
export const creerEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { date_evaluation, observation, note, code_participant, code_module, code_formateur } = req.body;
        const nouvelle_evaluation = await Evaluation.create({
            date_evaluation, observation, note, code_participant, code_module, code_formateur,
        });
        res.json(nouvelle_evaluation);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la création de la nouvelle évaluation.`);
    }
};

// Rapport de tous les évaluations
/**
 * @swagger
 * /evaluation/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de toutes les évaluations
 *     description: Liste contenant des informations sur toutes les évaluations.
 *     responses:
 *       200:
 *         description: Liste des évaluations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Evaluation'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterEvaluations = async (req: Request, res: Response): Promise<void> => {
    try {
        const evaluation_a_rapporter = await Evaluation.findAll();
        res.json(evaluation_a_rapporter);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération des évaluations.`);
    }
};

// Rapport d'une evaluation par son code
/**
 * @swagger
 * /evaluation/{num_evaluation}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur une évaluation à partir de son numéro
 *     description: Recherche d'une évaluation par son numéro
 *     parameters:
 *       - in: path
 *         name: num_evaluation
 *         required: true
 *         description: Numéro de l'évaluation à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Évaluation trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluation'
 *       404:
 *         description: Évaluation introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParNumEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
      const num_evaluation = Number(req.params.num_evaluation);
      const evaluation_a_rapporter = await Evaluation.findByPk(num_evaluation);
  
      if (!evaluation_a_rapporter) {
        res.status(404).send(`Evaluation non trouvé`);
      } else {
        res.json(evaluation_a_rapporter);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Une erreur s'est produite lors de la récupération de l'évaluation.`);
    }
  }
  
// Modification des informations d'un evaluation
/**
 * @swagger
 * /evaluation/modifier/{num_evaluation}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'une évaluation
 *     description: Modifier les informations d'une évaluation une fois trouvée par son numéro
 *     parameters:
 *       - in: path
 *         name: num_evaluation
 *         required: true
 *         description: Numéro de l'évaluation à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evaluation'
 *     responses:
 *       200:
 *         description: Évaluation à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Evaluation'
 *       404:
 *         description: Évaluation introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
        const num_evaluation = Number(req.params.num_evaluation);
        const { date_evaluation, observation, note, code_participant, code_module, code_formateur } = req.body;
        const evaluation_a_modifier = await Evaluation.findByPk(num_evaluation);

        if (!evaluation_a_modifier) {
            res.status(404).send(`Evaluation non trouvé.`);
        } else {
            evaluation_a_modifier.date_evaluation = date_evaluation;
            evaluation_a_modifier.observation = observation;
            evaluation_a_modifier.note = note;
            await evaluation_a_modifier.save();
            res.json(evaluation_a_modifier);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la modification de l'évaluation.`);
    }
};


// Suppression d'une évaluation
/**
 * @swagger
 * /evaluation/supprimer/{num_evaluation}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une évaluation
 *     description: Supprimer une évaluation une fois trouvée par son numéro
 *     parameters:
 *       - in: path
 *         name: num_evaluation
 *         required: true
 *         description: Numéro de l'évaluation à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Évaluation supprimée
 *       404:
 *         description: Évaluation introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerEvaluation = async (req: Request, res: Response): Promise<void> => {
    try {
      const num_evaluation = Number(req.params.num_evaluation);
      const evaluation = await Evaluation.findByPk(num_evaluation);
  
      if (!evaluation) {
        res.status(404).send(`Evaluation non trouvé.`);
      } else {
        await evaluation.destroy();
        res.send(`Evalution supprimé avec succès.`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Une erreur s'est produite lors de la suppression du model.`);
    }
  };
