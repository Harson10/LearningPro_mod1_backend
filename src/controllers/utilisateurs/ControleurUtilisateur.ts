import { Request, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import Utilisateur from "../../models/utilisateurs/Utilisateur";
import Role from "../../models/utilisateurs/Role";
import { JWT_SECRET } from "../../config/env";
// import sequelize from "../../config/Database"; 
// import bcrypt from "bcrypt";


/**
 * @swagger
 * components:
 *   schemas:
 *     UtilisateurAvecRoles:
 *       type: object
 *       properties:
 *         code_utilisateur:
 *           type: integer
 *         nom:
 *           type: string
 *         prenom:
 *           type: string
 *         adresse:
 *           type: string
 *         sexe:
 *           type: string
 *         profession:
 *           type: string
 *         mot_de_passe:
 *           type: string
 *         code_role:
 *           type: integer
 *         role:
 *           type: string
 */



/**
 * @swagger
 * /utilisateur/connexion:
 *   post:
 *     summary: Autentification d'un utilisateur
 *     description: Authentification de l'utilisateur par rapport à son identité et son mot de passe.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Informations correctes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 roleUtilisateur:
 *                   type: number
 *       401:
 *         description: Informations incorrectes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
/**************************************Auth*********************************************/
// export const AuthUtilisateur = async (req: Request, res: Response): Promise<void> => {
//   const { nom, prenom, mot_de_passe } = req.body;

//   try {
//     // Cherchez l'utilisateur dans la base de données par nom d'utilisateur
//     const utilisateur = await Utilisateur.findOne({
//       where: {
//         nom: nom,
//         prenom: prenom
//       },
//     });

//     if (utilisateur) {
//       // Vérifiez si le mot de passe correspond au hash stocké
//       const motDePasseValide = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
//       if (motDePasseValide) {
//         const roleUtilisateur = utilisateur.code_role;
//         const codeUtilisateur = utilisateur.code_utilisateur;
//         // Générer un token JWT
//         const token = jwt.sign({ nom: utilisateur.nom }, JWT_SECRET, { expiresIn: '24h' });

//         res.json({ token, roleUtilisateur, codeUtilisateur });
//       } else {
//         res.status(401).json({ message: `Nom d'utilisateur ou mot de passe incorrect` });
//       }
//     } else {
//       res.status(401).json({ message: `Nom d'utilisateur ou mot de passe incorrect` });
//     }
//   } catch (error) {
//     console.error(`Erreur lors de la vérification des informations d'identification :`, error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// }
export const AuthUtilisateur = async (req: Request, res: Response): Promise<void> => {
  const { nom, prenom, mot_de_passe } = req.body;

  try {
    // Cherchez l'utilisateur dans la base de données par nom d'utilisateur
    const utilisateur = await Utilisateur.findOne({
      where: {
        nom: nom,
        prenom: prenom,
        mot_de_passe: mot_de_passe
      },
    });

    if (utilisateur) {
      // Vérifiez si le mot de passe correspond
      if (utilisateur.mot_de_passe === mot_de_passe) {
        const roleUtilisateur = utilisateur.code_role;
        const codeUtilisateur = utilisateur.code_utilisateur;
        // Générer un token JWT
        const token = jwt.sign({ nom: utilisateur.nom }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ token, roleUtilisateur, codeUtilisateur });
      } else {
        res.status(401).json({ message: `Nom d'utilisateur ou mot de passe incorrect` });
      }
    } else {
      res.status(401).json({ message: `Nom d'utilisateur ou mot de passe incorrect` });
    }
  } catch (error) {
    console.error(`Erreur lors de la vérification des informations d'identification :`, error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}
/**************************************Auth*********************************************/






// Création d'un nouvel utilisateur
/**
 * @swagger
 * /utilisateur/creer:
 *   post:
 *     summary: Création d'un nouvel utilisateur
 *     description: Crée un nouvel utilisateur avec les informations fournies.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code_role:
 *                 type: number
 *               mot_de_passe:
 *                 type: string
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               adresse:
 *                 type: string
 *               sexe:
 *                 type: string
 *               profession:
 *                 type: string
 *     responses:
 *       200:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code_role:
 *                   type: number
 *                 nom:
 *                   type: string
 *                 prenom:
 *                   type: string
 *                 adresse:
 *                   type: string
 *                 sexe:
 *                   type: string
 *                 profession:
 *                   type: string
 *                 mot_de_passe:
 *                   type: string
 *       500:
 *         description: Erreur serveur lors de la création de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
// export const creerUtilisateur = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { code_role, mot_de_passe, nom, prenom, adresse, sexe, profession } = req.body;
//     const motDePasseHash = await bcrypt.hash(mot_de_passe, 10); // 10 est le coût de calcul (plus il est élevé, plus c'est sécurisé mais lent)

//     const nouvel_utilisateur = await Utilisateur.create({
//       code_role,
//       nom,
//       prenom,
//       adresse,
//       sexe,
//       profession,
//       mot_de_passe: motDePasseHash// Stocker le hash du mot de passe
//     });

//     console.log("Nouvel utilisateur créé :", nouvel_utilisateur);
//     res.json(nouvel_utilisateur);
//   } catch (error) {
//     console.error("Erreur lors de la création de l'utilisateur :", error);
//     res.status(500).send(`Une erreur s'est produite lors de la création de l'utilisateur.`);
//   }
// };
export const creerUtilisateur = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("Requête de création d'utilisateur reçue :", req.body);
    const { code_role, mot_de_passe, nom, prenom, adresse, sexe, profession } = req.body;
    const nouvel_utilisateur = await Utilisateur.create({
      code_role, mot_de_passe, nom, prenom, adresse, sexe, profession
    });

    console.log("Nouvel utilisateur créé :", nouvel_utilisateur);
    res.json(nouvel_utilisateur);
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    res.status(500).send(`Une erreur s'est produite lors de la création de l'utilisateur.`);
  }
};



// Recherche des utilisateurs
/**
 * @swagger
 * /utilisateur/:
 *   get:
 *     summary: Obtenir une liste de tous les utilisateurs
 *     description: Liste contenant des informations sur tous les utilisateurs
 *     responses:
 *       200:
 *         description: Liste d'utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UtilisateurAvecRoles'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterUtilisateurs = async (req: Request, res: Response): Promise<void> => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: ['code_utilisateur', 'code_role', 'nom', 'prenom', 'adresse', 'sexe', 'profession','mot_de_passe'],
    });

    const codesRoles = utilisateurs.map((utilisateur) => utilisateur.code_role);

    const roles = await Role.findAll({
      where: {
        code_role: codesRoles,
      },
      attributes: ['code_role', 'role'],
    });

    const rolesMap: Record<number, string> = {};
    roles.forEach((role) => {
      rolesMap[role.code_role] = role.role;
    });

    const utilisateursAvecRoles = utilisateurs.map((utilisateur) => ({
      code_utilisateur: utilisateur.code_utilisateur,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      adresse: utilisateur.adresse,
      sexe: utilisateur.sexe,
      profession: utilisateur.profession,
      mot_de_passe: utilisateur.mot_de_passe,
      code_role: utilisateur.code_role,
      role: rolesMap[utilisateur.code_role],
    }));

    res.json(utilisateursAvecRoles);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération des utilisateurs.`);
  }
};



// Recherche des participants
/**
 * @swagger
 * /utilisateur/rapporter/role/participants:
 *   get:
 *     summary: Récuprère les utilisateurs ayant le rôle de participant
 *     description: Recherche des participants parmi les utilisateurs.
 *     responses:
 *       200:
 *         description: Liste des utilisateurs avec le rôle de participant
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UtilisateurAvecRoles'
 *       500:
 *         description: Erreur interne au serveur.
 */
export const rapporterUtilisateursParRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: ['code_utilisateur', 'code_role', 'nom', 'prenom', 'adresse', 'sexe', 'profession','mot_de_passe'],
    });

    const codesRoles = utilisateurs.map((utilisateur) => utilisateur.code_role);

    const roles = await Role.findAll({
      where: {
        code_role: codesRoles,
      },
      attributes: ['code_role', 'role'],
    });

    const rolesMap: Record<number, string> = {};
    roles.forEach((role) => {
      rolesMap[role.code_role] = role.role;
    });

    const utilisateursAvecRoles = utilisateurs
      .filter((utilisateur) => rolesMap[utilisateur.code_role] === 'Participant')
      .map((utilisateur) => ({
        code_utilisateur: utilisateur.code_utilisateur,
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        adresse: utilisateur.adresse,
        sexe: utilisateur.sexe,
        profession: utilisateur.profession,
        mot_de_passe: utilisateur.mot_de_passe,
        code_role: utilisateur.code_role,
        role: rolesMap[utilisateur.code_role],
      }));

    res.json(utilisateursAvecRoles);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération des utilisateurs.`);
  }
};




// Rapport d'utilisateur par code_utilisateur
/**
 * @swagger
 * /utilisateur/rapporter/{code_utilisateur}:
 *   get:
 *     summary: Obtenir des informations sur un utilisateur à partir de son code
 *     description: Recherche d'un utilisateur par son code
 *     parameters:
 *       - in: path
 *         name: code_utilisateur
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UtilisateurAvecRoles'
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */

export const rapporterParCodeUtilisateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_utilisateur = Number(req.params.code_utilisateur);
    const utilisateur_a_rapporter = await Utilisateur.findByPk(code_utilisateur);

    if (!utilisateur_a_rapporter) {
      res.status(404).send(`Utilisateur non trouvé`);
    } else {
      res.json(utilisateur_a_rapporter);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération de l'utilisateur.`);
  }
}




// Modification des informations d'un utilisateur
/**
 * @swagger
 * /utilisateur/modifier/{code_utilisateur}:
 *   put:
 *     summary: Modification d'information d'un utilisateur
 *     description: Modifier les information d'un utilisateur une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_utilisateur
 *         required: true
 *         description: Code de l'utilisateur à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UtilisateurAvecRoles'
 *     responses:
 *       200:
 *         description: Utilisateur à jour 
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UtilisateurAvecRoles'
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierUtilisateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_utilisateur = Number(req.params.code_utilisateur);
    const { code_role, mot_de_passe, nom, prenom, adresse, sexe, profession } = req.body;
    const utilisateur_a_modifier = await Utilisateur.findByPk(code_utilisateur);

    if (!utilisateur_a_modifier) {
      res.status(404).send(`Utilisateur non trouvé.`);
    } else {
      utilisateur_a_modifier.code_role = code_role;
      utilisateur_a_modifier.nom = nom;
      utilisateur_a_modifier.prenom = prenom;
      utilisateur_a_modifier.adresse = adresse;
      utilisateur_a_modifier.sexe = sexe;
      utilisateur_a_modifier.profession = profession;
      utilisateur_a_modifier.mot_de_passe = mot_de_passe;
      await utilisateur_a_modifier.save();
      res.json(utilisateur_a_modifier);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la modification de l'utilisateur.`);
  }
};





// Suppression d'un utilisateur
/**
 * @swagger
 * /utilisateur/supprimer/{code_utilisateur}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Supprimer un utilisateur une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_utilisateur
 *         required: true
 *         description: Code de l'utilisateur à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerUtilisateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_utilisateur = Number(req.params.code_utilisateur);
    const utilisateur = await Utilisateur.findByPk(code_utilisateur);

    if (!utilisateur) {
      res.status(404).send(`Utilisateur non trouvé.`);
    } else {
      await utilisateur.destroy();
      res.send(`Utilisateur supprimé avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression de l'utilisateur.`);
  }
};







/******************Nombre d'utilisateurs*************************/
/**
 * @swagger
 * /utilisateur/nombre/total:
 *   get:
 *     summary: Obtenir le nombre total des utilisateurs
 *     description: Renvoi le nombre total des utilisateurs
 *     responses:
 *       200:
 *         description: Total des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       500:
 *         description: Erreur interne au serveur
 */

export const nombreTotalUtilisateur = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUtiliateur = await Utilisateur.count({
      col: "code_utilisateur"
    });
    res.json(totalUtiliateur);
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du nombre d'utilisateurs.`);
  }
}



// Fonction pour obtenir le nombre total d'utilisateurs pour le rôle "administrateur"
/**
 * @swagger
 * /utilisateur/nombre/administrateur:
 *   get:
 *     summary: Obtenir le nombre total des administrateurs
 *     description: Renvoi le nombre total des administrateurs parmi les utilisateurs
 *     responses:
 *       200:
 *         description: Total des administrateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       500:
 *         description: Erreur interne au serveur
 */
export const nombreAdministrateurs = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Utilisateur.count({
      include: [{
        model: Role,
        as: 'role',
        where: {
          role: 'Administrateur'
        },
        attributes: []
      }],
      distinct: true,
      col: 'code_utilisateur'
    });

    res.json(count);
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du nombre d'utilisateurs administrateurs :", error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du nombre d'utilisateurs administrateurs.`);
  }
};



// Fonction pour obtenir le nombre total d'utilisateurs pour le rôle "formateur"
/**
 * @swagger
 * /utilisateur/nombre/formateur:
 *   get:
 *     summary: Obtenir le nombre des formateurs
 *     description: Renvoi le nombre total des formateurs parmi les utilisateurs.
 *     responses:
 *       200:
 *         description: Total des formateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       500:
 *         description: Erreur interne au serveur
 */
export const nombreFormateurs = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Utilisateur.count({
      include: [{
        model: Role,
        as: 'role',
        where: {
          role: 'Formateur'
        },
        attributes: []
      }],
      distinct: true,
      col: 'code_utilisateur'
    });
    
    res.json(count);
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du nombre d'utilisateurs formateurs :", error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du nombre d'utilisateurs formateurs.`);
  }
};



// Fonction pour obtenir le nombre total d'utilisateurs pour le rôle "participant"
/**
 * @swagger
 * /utilisateur/nombre/participant:
 *   get:
 *     summary: Obtenir le nombre total des participants
 *     description: Renvoi le nombre total des participants parmi les utilisateurs
 *     responses:
 *       200:
 *         description: Total des participants
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       500:
 *         description: Erreur interne au serveur
 */

export const nombreParticipants = async (req: Request, res: Response): Promise<void> => {
  try {
    const count = await Utilisateur.count({
      include: [{
        model: Role,
        as: 'role',
        where: {
          role: 'Participant'
        },
        attributes: []
      }],
      distinct: true,
      col: 'code_utilisateur'
    });
    

    res.json(count);
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du nombre d'utilisateurs participants :", error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du nombre d'utilisateurs participants.`);
  }
};




/**
 * @swagger
 * /utilisateur/dernier_utilisateur:
 *   get:
 *     summary: Obtenir le code du dernier utilisateur
 *     description: Renvoi le code du dernier utilisatueur
 *     responses:
 *       200:
 *         description: Code du dernier utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       404:
 *         description: Utilisateur introuvable
 *       500:
 *         description: Erreur interne au serveur
 */

export const dernierUtilisateurCree = async (req: Request, res: Response): Promise<void> => {
  try {
    const dernierUtilisateur = await Utilisateur.findOne({
      order: [['code_utilisateur', 'DESC']],
      attributes: ['code_utilisateur'],
    });

    if (dernierUtilisateur && dernierUtilisateur.code_utilisateur) {
      res.json(dernierUtilisateur.code_utilisateur);
    } else {
      res.status(404).send(`Aucun utilisateur trouvé.`);
    }
  } catch (error) {
    console.error("Une erreur s'est produite lors de la récupération du dernier code_utilisateur :", error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du dernier code_utilisateur.`);
  }
};