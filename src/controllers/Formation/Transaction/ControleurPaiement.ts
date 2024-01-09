import { Request, Response } from "express";
import Paiement from "../../../models/Formation/Transaction/Paiement";
import Formation from "../../../models/Formation/Contenu/Formation";
import Participant from "../../../models/utilisateurs/Participant/Participant";
import Utilisateur from "../../../models/utilisateurs/Utilisateur";

/**
 * @swagger
 * components:
 *   schemas:
 *     Paiement:
 *       type: object
 *       properties:
 *         num_facture:
 *           type: number
 *         date_paiement:
 *           type: string
 *           format: date
 *           example: "2023-01-01"
 *         tranche_paiement:
 *           type: number
 *         montant:
 *           type: number
 *         reste:
 *           type: number
 *         code_formation:
 *           type: number
 *         code_participant:
 *           type: number
 *         code_utilisateur:
 *           type: number
 *         formation:
 *           $ref: '#/components/schemas/Formation'
 *         participant:
 *           $ref: '#/components/schemas/Participant'
 *         utilisateur:
 *           $ref: '#/components/schemas/Utilisateur'
 *     Formation:
 *       type: object
 *       properties:
 *         code_formation:
 *           type: number
 *         nom_formation:
 *           type: string
 *     Participant:
 *       type: object
 *       properties:
 *         code_participant:
 *           type: number
 *         code_utilisateur:
 *           type: string
 *     Utilisateur:
 *       type: object
 *       properties:
 *         code_utilisateur:
 *           type: number
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */ 

// Création d'un nouveau paiement
/**
 * @swagger
 * /paiement/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'un nouveau paiement
 *     description: Crée un nouveau paiement avec un numéro de facture, une date, une tranche, un montant, un code de formation et un code de participant.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               num_facture:
 *                 type: number
 *                 description: Numéro de facture du paiement.
 *                 example: 123
 *               date_paiement:
 *                 type: string
 *                 format: date
 *                 description: Date du paiement.
 *                 example: "2023-01-01"
 *               tranche_paiement:
 *                 type: number
 *                 description: Tranche du paiement.
 *                 example: 1
 *               montant:
 *                 type: number
 *                 description: Montant du paiement.
 *                 example: 500
 *               reste:
 *                 type: number
 *                 description: Montant du paiement.
 *                 example: 300
 *               code_formation:
 *                 type: number
 *                 description: Code de formation associé au paiement.
 *                 example: 456
 *               code_participant:
 *                 type: number
 *                 description: Code du participant associé au paiement.
 *                 example: 789
 *               code_utilisateur:
 *                 type: number
 *                 description: Code du participant associé au paiement.
 *                 example: 789
 *     responses:
 *       200:
 *         description: Paiement créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paiement'
 *       500:
 *         description: Erreur serveur lors de la création du paiement
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création du paiement.
 */
export const creerPaiement = async (req: Request, res: Response): Promise<void> => {
    try {
        const { num_facture, date_paiement, tranche_paiement, montant, reste, code_formation, code_participant, code_utilisateur } = req.body;
        const nouveau_paiement = await Paiement.create({
            num_facture, 
            date_paiement, 
            tranche_paiement, 
            montant, 
            reste, 
            code_formation, 
            code_participant,
            code_utilisateur,
        });
        res.json(nouveau_paiement);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la création du nouveau paiement.`);
    }
}

// Rapport de tous les paiements
/**
 * @swagger
 * /paiement/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de tous les paiements
 *     description: Liste contenant des informations sur tous les paiements.
 *     responses:
 *       200:
 *         description: Liste des paiements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Paiement'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterPaiements = async (req: Request, res: Response): Promise<void> => {
    try {
        const paiement_a_rapporter = await Paiement.findAll({
          include: [{
            model: Formation,
            as: 'formation',
            attributes: ['code_formation', 'nom_formation', 'cout_formation', 'publication'],
          } &&
          {
            model: Participant,
            as: 'participant',
            attributes: ['code_participant','code_utilisateur'],
          } &&
          {
            model: Utilisateur,
            as: 'utilisateur',
            attributes: ['code_utilisateur','nom','prenom'],
          }]
        });
        res.json(paiement_a_rapporter);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération des paiements.`);
    }
};

// Rapport de paiement par nnuméro de facture
/**
 * @swagger
 * /paiement/{num_facture}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur un paiement à partir de son numéro de facture
 *     description: Recherche d'un paiement par son numéro de facture
 *     parameters:
 *       - in: path
 *         name: num_facture
 *         required: true
 *         description: Numéro de facture du paiement à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paiement trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paiement'
 *       404:
 *         description: Paiement introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParNumFacture = async (req: Request, res: Response): Promise<void> => {
    try {
      const num_facture = Number(req.params.num_facture);
      const paiement_a_rapporter = await Paiement.findByPk(num_facture, {
        include: [{
          model: Formation,
          as: 'formation',
          attributes: ['code_formation','nom_formation'],
        },
        {
          model: Participant && Utilisateur,
          as: 'participant',
          attributes: ['code_participant','code_utilisateur','nom','prenom'],
        }]
      });
  
      if (!paiement_a_rapporter) {
        res.status(404).send(`Paiement non trouvé`);
      } else {
        res.json(paiement_a_rapporter);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Une erreur s'est produite lors de la récupération du paiement.`);
    }
  }
  
// Modification des informations d'un paiement
/**
 * @swagger
 * /paiement/modifier/{num_facture}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'un paiement
 *     description: Modifier les informations d'un paiement une fois trouvé par son numéro de facture
 *     parameters:
 *       - in: path
 *         name: num_facture
 *         required: true
 *         description: Numéro de facture du paiement à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Paiement'
 *     responses:
 *       200:
 *         description: Paiement à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Paiement'
 *       404:
 *         description: Paiement introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierPaiement = async (req: Request, res: Response): Promise<void> => {
    try {
        const num_facture = Number(req.params.num_facture);
        const { date_paiement, tranche_paiement, montant, reste, code_formation, code_participant } = req.body;
        const paiement_a_modifier = await Paiement.findByPk(num_facture);

        if (!paiement_a_modifier) {
            res.status(404).send(`Paiement non trouvé.`);
        } else {
            paiement_a_modifier.date_paiement = date_paiement;
            paiement_a_modifier.tranche_paiement = tranche_paiement;
            paiement_a_modifier.montant = montant;
            paiement_a_modifier.reste = reste;
            paiement_a_modifier.code_formation = code_formation;
            paiement_a_modifier.code_participant = code_participant;
            await paiement_a_modifier.save();
            res.json(paiement_a_modifier);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la modification de paiement.`);
    }
};

// Suppression d'un paiement
/**
 * @swagger
 * /paiement/supprimer/{num_facture}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un paiement
 *     description: Supprimer un paiement une fois trouvé par son numéro de facture
 *     parameters:
 *       - in: path
 *         name: num_facture
 *         required: true
 *         description: Numéro de facture du paiement à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paiement supprimé
 *       404:
 *         description: Paiement introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerPaiement = async (req: Request, res: Response): Promise<void> => {
    try {
      const num_facture = Number(req.params.num_facture);
      const paiement = await Paiement.findByPk(num_facture);
  
      if (!paiement) {
        res.status(404).send(`Paiement non trouvé.`);
      } else {
        await paiement.destroy();
        res.send(`Paiement supprimé avec succès.`);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Une erreur s'est produite lors de la suppression du model.`);
    }
  };