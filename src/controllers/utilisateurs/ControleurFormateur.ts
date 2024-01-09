import { Request, Response } from "express";
import Formateur from "../../models/utilisateurs/Formateur";


/**
 * @swagger
 * components:
 *   schemas:
 *     Formateur:
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


// Création d'un nouveau formateur
/**
 * @swagger
 * /formateur/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'un nouveau formateur
 *     description: Crée un nouveau formateur associé à un utilisateur existant.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code_utilisateur:
 *                 type: number
 *                 description: Le code de l'utilisateur associé au formateur.
 *                 example: 123
 *     responses:
 *       200:
 *         description: Formateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code_utilisateur:
 *                   type: number
 *                   example: 123
 *       500:
 *         description: Erreur serveur lors de la création du formateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création du formateur.
 */

export const creerFormateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code_utilisateur } = req.body;
    const nouveau_formateur = await Formateur.create({
      code_utilisateur,
    });
    res.json(nouveau_formateur);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la création du formateur.`);
  }
};



// Rapport de tous les formateurs
/**
 * @swagger
 * /formateur/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de tous les formateurs
 *     description: Liste contenant des informations sur tous les formateurs.
 *     responses:
 *       200:
 *         description: Liste des formateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Formateur'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterFormateurs = async (req: Request, res: Response): Promise<void> => {
  try {
    const formateurs_a_rapporter = await Formateur.findAll();
    res.json(formateurs_a_rapporter);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération des formateurs.`);
  }
};



// Rapport d'un formateur par son code
/**
 * @swagger
 * /formateur/{code_formateur}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur un formateur à partir de son code
 *     description: Recherche d'un formateur par son code
 *     parameters:
 *       - in: path
 *         name: code_formateur
 *         required: true
 *         description: ID du formateur à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formateur'
 *       404:
 *         description: Formateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParCodeFormateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_formateur = Number(req.params.code_formateur);
    const formateur_a_rapporter = await Formateur.findByPk(code_formateur, {
        include: {
          model: Formateur,
          as: 'formateur'
        }
    });

    if (!formateur_a_rapporter) {
      res.status(404).send(`Formateur non trouvé`);
    } else {
      res.json(formateur_a_rapporter);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du formateur.`);
  }
}

// Modifier les informations d'un formateur
/**
 * @swagger
 * /formateur/modifier/{code_formateur}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'un formateur
 *     description: Modifier les informations d'un formateur une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_formateur
 *         required: true
 *         description: Code du formateur à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code_utilisateur:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Formateur à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Formateur'
 *       404:
 *         description: Formateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierFormateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_formateur = Number(req.params.code_formateur);
    const { code_utilisateur } = req.body;
    const formateur_a_modifier = await Formateur.findByPk(code_formateur);

    if (!formateur_a_modifier) {
      res.status(404).send(`Formateur non trouvé.`);
    } else {
      formateur_a_modifier.code_utilisateur = code_utilisateur;
      await formateur_a_modifier.save();
      res.json(formateur_a_modifier);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la modification du formateur.`);
  }
};

// Suppression d'un formateur
/**
 * @swagger
 * /formateur/supprimer/{code_formateur}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un formateur
 *     description: Supprimer un formateur une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_formateur
 *         required: true
 *         description: Code du formateur à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formateur supprimé
 *       404:
 *         description: Formateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerFormateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_formateur = Number(req.params.code_formateur);
    const formateur = await Formateur.findByPk(code_formateur);

    if (!formateur) {
      res.status(404).send(`Formateur non trouvé.`);
    } else {
      await formateur.destroy();
      res.send(`Formateur supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression du formateur.`);
  }
};


// Suppression par code utilisateur
/**
 * @swagger
 * /formateur/supprimer/par_utilisateur/{code_utilisateur}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un formateur par code utilisateur
 *     description: Supprimer un formateur en utilisant le code utilisateur associé
 *     parameters:
 *       - in: path
 *         name: code_utilisateur
 *         required: true
 *         description: Code de l'utilisateur associé au formateur à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Formateur supprimé
 *       404:
 *         description: Formateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerFormateurParCodeUtilisateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_utilisateur = Number(req.params.code_utilisateur);
    const formateur = await Formateur.findOne({
      where: {
        code_utilisateur: code_utilisateur
      }
    });

    if (!formateur) {
      res.status(404).send(`Formateur non trouvé.`);
    } else {
      await formateur.destroy();
      res.send(`Formateur supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression du formateur.`);
  }
};