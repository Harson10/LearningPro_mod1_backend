import { Request, Response } from "express";
import Participant from "../../../models/utilisateurs/Participant/Participant";
import Groupe from "../../../models/utilisateurs/Participant/Groupe";



/**
 * @swagger
 * components:
 *   schemas:
 *     Participant:
 *       type: object
 *       properties:
 *         code_utilisateur:
 *           type: number
 *           example: 123
 *         code_groupe:
 *           type: number
 *           example: 456
 *         dateNaiss:
 *           type: string
 *           format: date
 *           example: "2000-01-01"
 *         lieuNaiss:
 *           type: string
 *           example: "Ville, Pays"
 *         numCIN:
 *           type: string
 *           example: "123456789"
 *         nomTuteur:
 *           type: string
 *           example: "Nom du tuteur"
 *         prenomTuteur:
 *           type: string
 *           example: "Prénom du tuteur"
 *         niveau:
 *           type: string
 *           example: "Niveau d'études"
 *         diplome:
 *           type: string
 *           example: "Diplôme obtenu"
 *         groupe:
 *           $ref: '#/components/schemas/Groupe'
 *     Groupe:
 *       type: object
 *       properties:
 *         code_groupe:
 *           type: number
 *           example: 456
 *         nom_groupe:
 *           type: string
 *           example: "Nom du groupe"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


// Création d'un nouveau participant
/**
 * @swagger
 * /participant/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'un nouveau participant
 *     description: Crée un nouveau participant associé à un groupe existant.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code_utilisateur:
 *                 type: number
 *                 description: Le code de l'utilisateur associé au participant.
 *                 example: 123
 *               code_groupe:
 *                 type: number
 *                 description: Le code du groupe associé au participant.
 *                 example: 456
 *               dateNaiss:
 *                 type: string
 *                 format: date
 *                 description: La date de naissance du participant.
 *                 example: "2000-01-01"
 *               lieuNaiss:
 *                 type: string
 *                 description: Le lieu de naissance du participant.
 *                 example: "Ville, Pays"
 *               numCIN:
 *                 type: string
 *                 description: Le numéro de CIN du participant.
 *                 example: "123456789"
 *               nomTuteur:
 *                 type: string
 *                 description: Le nom du tuteur du participant.
 *                 example: "Nom du tuteur"
 *               prenomTuteur:
 *                 type: string
 *                 description: Le prénom du tuteur du participant.
 *                 example: "Prénom du tuteur"
 *               niveau:
 *                 type: string
 *                 description: Le niveau d'études du participant.
 *                 example: "Niveau d'études"
 *               diplome:
 *                 type: string
 *                 description: Le diplôme obtenu par le participant.
 *                 example: "Diplôme obtenu"
 *     responses:
 *       200:
 *         description: Participant créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 *       500:
 *         description: Erreur serveur lors de la création du participant
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création du participant.
 */

export const creerParticipant = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code_utilisateur, code_groupe, dateNaiss, lieuNaiss, numCIN, nomTuteur, prenomTuteur, niveau, diplome } = req.body;
    const nouveau_participant = await Participant.create({
      code_utilisateur,
      code_groupe,
      dateNaiss,
      lieuNaiss,
      numCIN,
      nomTuteur,
      prenomTuteur,
      niveau,
      diplome,
    });
    res.json(nouveau_participant);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la création du participant.`);
  }
};




// Rapport de tous les participants
/**
 * @swagger
 * /participant/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de tous les participants
 *     description: Liste contenant des informations sur tous les participants.
 *     responses:
 *       200:
 *         description: Liste des participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Participant'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const participants_a_rapporter = await Participant.findAll({
      include: [{
        model: Groupe,
        as: 'groupe',
        attributes: ['code_groupe', 'nom_groupe'], // Ajouter les attributs du modèle Groupe que vous souhaitez inclure
      }],
    });

    res.json(participants_a_rapporter);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération des participants.`);
  }
};


// Rapport d'un participant par son code
/**
 * @swagger
 * /participant/{code_participant}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur un participant à partir de son code
 *     description: Recherche d'un participant par son code
 *     parameters:
 *       - in: path
 *         name: code_participant
 *         required: true
 *         description: ID du participant à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participant trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 *       404:
 *         description: Participant introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParCodeParticipant = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_participant = Number(req.params.code_participant);
    const participant_a_rapporter = await Participant.findByPk(code_participant, {
      include: [{
        model: Groupe,
        as: 'groupe',
        attributes: ['code_groupe', 'nom_groupe'], // Ajouter les attributs du modèle Groupe que vous souhaitez inclure
      }],
    });

    if (!participant_a_rapporter) {
      res.status(404).send(`Participant non trouvé`);
    } else {
      res.json(participant_a_rapporter);
    }

  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du participant.`);
  }
}



// Modifier les informations d'un participant
/**
 * @swagger
 * /participant/modifier/{code_participant}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'un participant
 *     description: Modifier les informations d'un participant une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_participant
 *         required: true
 *         description: Code du participant à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Participant'
 *     responses:
 *       200:
 *         description: Participant à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Participant'
 *       404:
 *         description: Participant introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierParticipant = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_participant = Number(req.params.code_participant);
    const { code_utilisateur, code_groupe, dateNaiss, lieuNaiss, numCIN, nomTuteur, prenomTuteur, niveau, diplome } = req.body;
    const participant_a_modifier = await Participant.findByPk(code_participant);

    if (!participant_a_modifier) {
      res.status(404).send(`Participant non trouvé.`);
    } else {
      participant_a_modifier.code_utilisateur = code_utilisateur;
      participant_a_modifier.code_groupe = code_groupe;
      participant_a_modifier.dateNaiss = dateNaiss;
      participant_a_modifier.lieuNaiss = lieuNaiss;
      participant_a_modifier.numCIN = numCIN;
      participant_a_modifier.nomTuteur = nomTuteur;
      participant_a_modifier.prenomTuteur = prenomTuteur;
      participant_a_modifier.niveau = niveau;
      participant_a_modifier.diplome = diplome;

      await participant_a_modifier.save();
      res.json(participant_a_modifier);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la modification du participant.`);
  }
};




/**
 * @swagger
 * /participant/supprimer/{code_participant}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un participant
 *     description: Supprimer un participant une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_participant
 *         required: true
 *         description: Code du participant à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participant supprimé
 *       404:
 *         description: Participant introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerParticipant = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_participant = Number(req.params.code_participant);
    const participant = await Participant.findByPk(code_participant);

    if (!participant) {
      res.status(404).send(`Participant non trouvé.`);
    } else {
      await participant.destroy();
      res.send(`Participant supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression du participant.`);
  }
};



// Suppression par code utilisateur
/**
 * @swagger
 * /participant/supprimer/par_utilisateur/{code_utilisateur}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un participant par code utilisateur
 *     description: Supprimer un participant en utilisant le code utilisateur associé
 *     parameters:
 *       - in: path
 *         name: code_utilisateur
 *         required: true
 *         description: Code de l'utilisateur associé au participant à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participant supprimé
 *       404:
 *         description: Participant introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerParticipantParCodeUtilisateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_utilisateur = Number(req.params.code_utilisateur);
    const participant = await Participant.findOne({
      where: {
        code_utilisateur: code_utilisateur
      }
    });

    if (!participant) {
      res.status(404).send(`Participant non trouvé.`);
    } else {
      await participant.destroy();
      res.send(`Participant supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression du participant.`);
  }
};
