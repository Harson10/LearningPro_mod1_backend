import { Request, Response } from "express";
import Role from "../../models/utilisateurs/Role";


/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         role:
 *           type: string
 *           example: "Administrateur | Formateur | Participant"
 */


// Création d'un nouveau rôle
/**
 * @swagger
 * /role/creer:
 *   post:
 *     summary: Création d'un nouveau rôle
 *     description: Crée un nouveau rôle.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: Le nom du rôle à créer.
 *                 example: "Admin"
 *     responses:
 *       200:
 *         description: Rôle créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role:
 *                   type: string
 *                   example: "Admin"
 *       500:
 *         description: Erreur serveur lors de la création du rôle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création du rôle.
 */

export const creerRole = async (req: Request, res: Response): Promise<void> => {
  try {

    const { role } = req.body;
    const nouveau_role = await Role.create({
      role
    });
    res.json(nouveau_role);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la création du role.`);
  }

};



// Rapport de tous les rôles
/**
 * @swagger
 * /role/:
 *   get:
 *     summary: Obtenir une liste de tous les rôles
 *     description: Liste contenant des informations sur tous les rôles.
 *     responses:
 *       200:
 *         description: Liste des rôles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterRoles = async (req: Request, res: Response): Promise<void> => {
  try {
    const role_a_rapporter = await Role.findAll();
    res.json(role_a_rapporter);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération des Roles.`);
  }
};



// Rapport d'un rôle par son code
/**
 * @swagger
 * /role/{code_role}:
 *   get:
 *     summary: Obtenir des informations sur un rôle à partir de son code
 *     description: Recherche d'un rôle par son code
 *     parameters:
 *       - in: path
 *         name: code_role
 *         required: true
 *         description: ID du rôle à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rôle trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rôle introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParCodeRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_role = Number(req.params.code_role);
    const role = await Role.findByPk(code_role);

    if (!role) {
      res.status(404).send(`role non trouvé.`);
    } else {
      res.json(role);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du role.`);
  }
};



// Modifier les informations d'un rôle
/**
 * @swagger
 * /role/modifier/{code_role}:
 *   put:
 *     summary: Modification d'information d'un rôle
 *     description: Modifier les informations d'un rôle une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_role
 *         required: true
 *         description: Code du rôle à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rôle à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Rôle introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_role = Number(req.params.code_role);
    const { role } = req.body;
    const role_a_modifier = await role.findByPk(code_role);

    if (!role_a_modifier) {
      res.status(404).send(`role non trouvé.`);
    } else {
      role_a_modifier.role = role;
      await role_a_modifier.save();
      res.json(role_a_modifier);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la modification du role.`);
  }
};



// Suppression d'un rôle
/**
 * @swagger
 * /role/supprimer/{code_role}:
 *   delete:
 *     summary: Supprimer un rôle
 *     description: Supprimer un rôle une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_role
 *         required: true
 *         description: Code du rôle à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rôle supprimé
 *       404:
 *         description: Rôle introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_role = Number(req.params.code_role);
    const role = await Role.findByPk(code_role);

    if (!role) {
      res.status(404).send(`role non trouvé.`);
    } else {
      await role.destroy();
      res.send(`role supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression du role.`);
  }
};
