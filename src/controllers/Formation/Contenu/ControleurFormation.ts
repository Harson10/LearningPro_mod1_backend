import { Request, Response } from "express";
import Formation from "../../../models/Formation/Contenu/Formation";


/**
 * @swagger
 * components:
 *   schemas:
 *     Formation:
 *       type: object
 *       properties:
 *         code_formation:
 *           type: number
 *           example: 123
 *         nom_formation:
 *           type: string
 *           example: "Formation en informatique"
 *         cout_formation:
 *           type: number
 *           example: 5000
 *         publication:
 *           type: string
 *           example: "Non ou Oui"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


// Création d'une nouvelle formation
/**
 * @swagger
 * /formation/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'une nouvelle formation
 *     description: Crée une nouvelle formation avec un code, un nom, un coût et un statut de publication.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_formation:
 *                 type: string
 *                 description: Nom de la formation.
 *                 example: "Formation en informatique"
 *               cout_formation:
 *                 type: number
 *                 description: Coût de la formation.
 *                 example: 5000
 *               publication:
 *                 type: string
 *                 description: Statut de publication de la formation.
 *                 example: "Oui ou Non"
 *     responses:
 *       200:
 *         description: Formation créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formation'
 *       500:
 *         description: Erreur serveur lors de la création de la formation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création de la formation.
 */
export const creerFormation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nom_formation, cout_formation, publication } = req.body;
        const nouvelle_formation = await Formation.create({
            nom_formation, cout_formation, publication
        });
        res.json(nouvelle_formation);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la création de la formation`);
    }
};

// Rapport de toutes les formations
/**
 * @swagger
 * /formation/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de toutes les formations
 *     description: Liste contenant des informations sur toutes les formations.
 *     responses:
 *       200:
 *         description: Liste des formations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Formation'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterFormations = async (req: Request, res: Response): Promise<void> => {
    try {
        const formation_a_rapporter = await Formation.findAll();
        res.json(formation_a_rapporter);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération des formations.`);
    }
};

// Rapport d'une formation par son code
/**
 * @swagger
 * /formation/{code_formation}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur une formation à partir de son code
 *     description: Recherche d'une formation par son code
 *     parameters:
 *       - in: path
 *         name: code_formation
 *         required: true
 *         description: Code de la formation à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formation trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formation'
 *       404:
 *         description: Formation introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParCodeFormation = async (req: Request, res: Response): Promise<void> => {
    try {
      const code_formation = Number(req.params.code_formation);
      const formation_a_rapporter = await Formation.findByPk(code_formation);
  
      if (!formation_a_rapporter) {
        res.status(404).send(`Formation non trouvé`);
      } else {
        res.json(formation_a_rapporter);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Une erreur s'est produite lors de la récupération de la formation.`);
    }
  }
  
// Modification des informations d'une formation
/**
 * @swagger
 * /formation/modifier/{code_formation}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'une formation
 *     description: Modifier les informations d'une formation une fois trouvée par son code
 *     parameters:
 *       - in: path
 *         name: code_formation
 *         required: true
 *         description: Code de la formation à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Formation'
 *     responses:
 *       200:
 *         description: Formation à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formation'
 *       404:
 *         description: Formation introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierFormation = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_formation = Number(req.params.code_formation);
        const { nom_formation, cout_formation, publication } = req.body;
        const formation_a_modifier = await Formation.findByPk(code_formation);

        if (!formation_a_modifier) {
            res.status(404).send(`Formation non trouvée.`);
        } else {
            formation_a_modifier.nom_formation = nom_formation;
            formation_a_modifier.cout_formation = cout_formation;
            formation_a_modifier.publication = publication;
            await formation_a_modifier.save();
            res.json(formation_a_modifier);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la modification de la formation.`);
    }
};

// Suppression d'une formation
/**
 * @swagger
 * /formation/supprimer/{code_formation}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une formation
 *     description: Supprimer une formation une fois trouvée par son code
 *     parameters:
 *       - in: path
 *         name: code_formation
 *         required: true
 *         description: Code de la formation à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formation supprimée
 *       404:
 *         description: Formation introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerFormation = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_formation = Number(req.params.code_formation);
        const formation = await Formation.findByPk(code_formation);

        if (!formation) {
            res.status(404).send(`Formation non trouvé.`);
        } else {
            await formation.destroy();
            res.send(`Une erreur s'est produite lors de la suppression de la formation.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la suppression de la formation.`);
    }
}