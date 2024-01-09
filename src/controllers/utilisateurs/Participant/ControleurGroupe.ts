import { Request, Response } from "express";
import Groupe from "../../../models/utilisateurs/Participant/Groupe";



/**
 * @swagger
 * components:
 *   schemas:
 *     Groupe:
 *       type: object
 *       properties:
 *         nom_groupe:
 *           type: string
 *           example: "Groupe A"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Création d'un nouveau groupe
/**
 * @swagger
 * /groupe/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'un nouveau groupe
 *     description: Crée un nouveau groupe.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_groupe:
 *                 type: string
 *                 description: Le nom du groupe à créer.
 *                 example: "Groupe A"
 *     responses:
 *       200:
 *         description: Groupe créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Groupe'
 *       500:
 *         description: Erreur serveur lors de la création du groupe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création du groupe.
 */

export const creerGroupe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom_groupe } = req.body;
    const nouveau_groupe = await Groupe.create({ nom_groupe });
    res.json(nouveau_groupe);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la création du groupe.`);
  }
};




// Rapport de tous les groupes
/**
 * @swagger
 * /groupe/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de tous les groupes
 *     description: Liste contenant des informations sur tous les groupes.
 *     responses:
 *       200:
 *         description: Liste des groupes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Groupe'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterGroupes = async (req: Request, res: Response): Promise<void> => {
  try {
    const groupes_a_rapporter = await Groupe.findAll();
    res.json(groupes_a_rapporter);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération des groupes.`);
  }
};



// Rapport par code_groupe
/**
 * @swagger
 * /groupe/{code_groupe}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur un groupe à partir de son code
 *     description: Recherche d'un groupe par son code
 *     parameters:
 *       - in: path
 *         name: code_groupe
 *         required: true
 *         description: ID du groupe à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Groupe trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Groupe'
 *       404:
 *         description: Groupe introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParCodeGroupe = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_groupe = Number(req.params.code_groupe);
    const groupe_a_rapporter = await Groupe.findByPk(code_groupe);

    if (!groupe_a_rapporter) {
      res.status(404).send(`Groupe non trouvé`);
    } else {
      res.json(groupe_a_rapporter);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du groupe.`);
  }
}




// Modification des informations d'un groupe
/**
 * @swagger
 * /groupe/modifier/{code_groupe}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'un groupe
 *     description: Modifier les informations d'un groupe une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_groupe
 *         required: true
 *         description: Code du groupe à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_groupe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Groupe à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Groupe'
 *       404:
 *         description: Groupe introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierGroupe = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_groupe = Number(req.params.code_groupe);
    const { nom_groupe } = req.body;
    const groupe_a_modifier = await Groupe.findByPk(code_groupe);

    if (!groupe_a_modifier) {
      res.status(404).send(`Groupe non trouvé.`);
    } else {
      groupe_a_modifier.nom_groupe = nom_groupe;
      await groupe_a_modifier.save();
      res.json(groupe_a_modifier);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la mise à jour du groupe.`);
  }
};





// Suppression d'un groupe
/**
 * @swagger
 * /groupe/supprimer/{code_groupe}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un groupe
 *     description: Supprimer un groupe une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_groupe
 *         required: true
 *         description: Code du groupe à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Groupe supprimé
 *       404:
 *         description: Groupe introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerGroupe = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_groupe = Number(req.params.code_groupe);
    const groupe = await Groupe.findByPk(code_groupe);

    if (!groupe) {
      res.status(404).send(`Groupe non trouvé.`);
    } else {
      await groupe.destroy();
      res.send(`Groupe supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression du groupe.`);
  }
};