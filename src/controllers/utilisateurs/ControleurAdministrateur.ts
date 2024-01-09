import { Request, Response } from "express";
import Administrateur from "../../models/utilisateurs/Administrateur";
import Utilisateur from "../../models/utilisateurs/Utilisateur";



/**
 * @swagger
 * components:
 *   schemas:
 *     Administrateur:
 *       type: object
 *       properties:
 *         code_utilisateur:
 *           type: number
 *           example: 123
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


// Création d'un nouvel administrateur
/**
 * @swagger
 * /administrateur/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'un nouvel administrateur
 *     description: Crée un nouvel administrateur associé à un utilisateur existant.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Administrateur'
 *     responses:
 *       200:
 *         description: Administrateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Administrateur'
 *       500:
 *         description: Erreur serveur lors de la création de l'administrateur
 */
export const creerAdministrateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code_utilisateur } = req.body;
    const nouvel_administrateur = await Administrateur.create({
      code_utilisateur,
    });
    res.json(nouvel_administrateur);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la création de l'administrateur.`);
  }
};



// Rapport de tous les administrateurs
/**
 * @swagger
 * /administrateur/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de tous les administrateurs
 *     description: Liste contenant des informations sur tous les administrateurs.
 *     responses:
 *       200:
 *         description: Liste des administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Administrateur'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterAdministrateurs = async (req: Request, res: Response): Promise<void> => {
  try {
    const administrateurs_a_rapporter = await Administrateur.findAll();
    res.json(administrateurs_a_rapporter);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération des administrateurs.`);
  }
};




// Rapport d'un administrateur par son code
/**
 * @swagger
 * /administrateur/{code_administrateur}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur un administrateur à partir de son code
 *     description: Recherche d'un administrateur par son code
 *     parameters:
 *       - in: path
 *         name: code_administrateur
 *         required: true
 *         description: ID de l'administrateur à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Administrateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Administrateur'
 *       404:
 *         description: Administrateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParCodeAdministrateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_administrateur = Number(req.params.code_administrateur);
    const administrateur_a_rapporter = await Administrateur.findByPk(code_administrateur, {
        include: {
          model: Utilisateur,
          as: 'utilisateur'
        }
    });

    if (!administrateur_a_rapporter) {
      res.status(404).send(`Administrateur non trouvé`);
    } else {
      res.json(administrateur_a_rapporter);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération de l'administrateur.`);
  }
}



// Modifier les informations d'un administrateur
/**
 * @swagger
 * /administrateur/modifier/{code_administrateur}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'un administrateur
 *     description: Modifier les informations d'un administrateur une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_administrateur
 *         required: true
 *         description: Code de l'administrateur à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Administrateur'
 *     responses:
 *       200:
 *         description: Administrateur à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Administrateur'
 *       404:
 *         description: Administrateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierAdministrateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_administrateur = Number(req.params.code_administrateur);
    const { code_utilisateur } = req.body;
    const administrateur_a_modifier = await Administrateur.findByPk(code_administrateur);

    if (!administrateur_a_modifier) {
      res.status(404).send(`Administrateur non trouvé.`);
    } else {
      administrateur_a_modifier.code_utilisateur = code_utilisateur;
      await administrateur_a_modifier.save();
      res.json(administrateur_a_modifier);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la modification de l'administrateur.`);
  }
};



// Suppression d'un administrateur
/**
 * @swagger
 * /administrateur/supprimer/{code_administrateur}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un administrateur
 *     description: Supprimer un administrateur une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_administrateur
 *         required: true
 *         description: Code de l'administrateur à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Administrateur supprimé
 *       404:
 *         description: Administrateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerAdministrateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_administrateur = Number(req.params.code_administrateur);
    const administrateur = await Administrateur.findByPk(code_administrateur);

    if (!administrateur) {
      res.status(404).send(`Administrateur non trouvé.`);
    } else {
      await administrateur.destroy();
      res.send(`Administrateur supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression de l'administrateur.`);
  }
};



// Suppression par code utilisateur
/**
 * @swagger
 * /administrateur/supprimer/par_utilisateur/{code_utilisateur}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un administrateur par code utilisateur
 *     description: Supprimer un administrateur en utilisant le code utilisateur associé
 *     parameters:
 *       - in: path
 *         name: code_utilisateur
 *         required: true
 *         description: Code de l'utilisateur associé à l'administrateur à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Administrateur supprimé
 *       404:
 *         description: Administrateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerAdministrateurtParCodeUtilisateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_utilisateur = Number(req.params.code_utilisateur);
    const administrateur = await Administrateur.findOne({
      where: {
        code_utilisateur: code_utilisateur
      }
    });

    if (!administrateur) {
      res.status(404).send(`Administrateur non trouvé.`);
    } else {
      await administrateur.destroy();
      res.send(`Administrateur supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression de l'administrateur.`);
  }
};
