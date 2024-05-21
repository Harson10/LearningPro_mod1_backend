import { Request, Response } from "express";
import Etape from "../../../models/Formation/Contenu/Etape";
import Module from "../../../models/Formation/Contenu/Module";
import multer, { MulterError } from "multer";
// import fs from 'fs';
import path from "path";



// const createUploadsFolder = () => {
//   const uploadsFolder = path.join(__dirname, 'uploads');

//   if (!fs.existsSync(uploadsFolder)) {
//     fs.mkdirSync(uploadsFolder);
//     console.log('Le dossier uploads/ a été créé avec succès.');
//   }
// };

// createUploadsFolder();





/**
 * @swagger
 * components:
 *   schemas:
 *     Etape:
 *       type: object
 *       properties:
 *         num_etape:
 *           type: integer
 *           example: 1
 *         nom_etape:
 *           type: string
 *           example: "Étape 1"
 *         texte:
 *           type: string
 *           example: "Description de l'étape 1"
 *         code_module:
 *           type: integer
 *           example: 1
 *         pdf_path:
 *           type: string
 *           example: "uploads/1622544803957.pdf"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /etape/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'une nouvelle étape
 *     description: Crée une nouvelle étape avec la possibilité de télécharger un fichier PDF.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom_etape:
 *                 type: string
 *                 description: Le nom de l'étape à créer.
 *                 example: "Étape 1"
 *               texte:
 *                 type: string
 *                 description: La description de l'étape.
 *                 example: "Description de l'étape 1"
 *               code_module:
 *                 type: integer
 *                 description: Le code du module auquel l'étape est associée.
 *                 example: 1
 *               pdf_path:
 *                 type: string
 *                 format: binary
 *                 description: Le fichier PDF associé à l'étape.
 *     responses:
 *       200:
 *         description: Étape créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etape'
 *       500:
 *         description: Erreur serveur lors de la création de l'étape
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création de l'étape.
 */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

export const creerEtape = async (req: Request, res: Response): Promise<void> => {
  upload.single('pdf_path')(req, res, async (err: any) => { // Modifiez cette ligne
    if (err instanceof MulterError) {
      return res.status(500).send(`Erreur lors de l'upload du fichier: ${err.message}`);
    } else if (err) {
      return res.status(500).send(`Erreur inconnue lors de l'upload du fichier: ${err}`);
    }

    try {
      const { nom_etape, texte, code_module } = req.body;
      const pdf_path = req.file ? req.file.path : null;

      const nouvelle_etape = await Etape.create({ nom_etape, texte, code_module, pdf_path });
      res.json(nouvelle_etape);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Une erreur s'est produite lors de la création de l'étape.`);
    }
  });
};







// Récupération de toutes les étapes
/**
 * @swagger
 * /etape/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de toutes les étapes
 *     description: Liste contenant des informations sur toutes les étapes.
 *     responses:
 *       200:
 *         description: Liste des étapes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Etape'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterEtapes = async (req: Request, res: Response): Promise<void> => {
  try {
    const etapes = await Etape.findAll();

    const codesModules = etapes.map((etape) => etape.code_module);

    const modules = await Module.findAll({
      where: {
        code_module: codesModules,
      },
      attributes: ['code_module', 'nom_module'],
    });

    const modulesMap: Record<number, string> = {};
    modules.forEach((module) => {
      modulesMap[module.code_module] = module.nom_module;
    });

    const etapesAvecModule = etapes.map((etape) => ({
      num_etape: etape.num_etape,
      nom_etape: etape.nom_etape,
      texte: etape.texte,
      code_module: etape.code_module,
      module: modulesMap[etape.code_module],
      pdf_path: etape.pdf_path,  // Ajout du chemin PDF
    }));

    res.json(etapesAvecModule);

  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération des étapes.`);
  }
};


// Récupération d'une étape par son numéro
/**
 * @swagger
 * /etape/{num_etape}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur une étape à partir de son numéro
 *     description: Recherche d'une étape par son numéro
 *     parameters:
 *       - in: path
 *         name: num_etape
 *         required: true
 *         description: Numéro de l'étape à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Étape trouvée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etape'
 *       404:
 *         description: Étape introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParNumEtape = async (req: Request, res: Response): Promise<void> => {
  try {
    const num_etape = Number(req.params.num_etape);
    const etape_a_rapporter = await Etape.findByPk(num_etape);

    if (!etape_a_rapporter) {
      res.status(404).send(`Étape non trouvée`);
    } else {
      res.json(etape_a_rapporter);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération de l'étape.`);
  }
};


/**
 * @swagger
 * /etape/rapporter_par_module/{code_module}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir l'étape associée à un module
 *     description: Recherche d'étape par code de module
 *     parameters:
 *       - in: path
 *         name: code_module
 *         required: true
 *         description: Code module associé à l'étape
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des étapes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Etape'
 *       404:
 *         description: Aucune étape trouvée pour le module spécifié
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporteEtapeParCodeModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_module = Number(req.params.code_module);
    const etapes = await Etape.findAll({
      where: {
        code_module: code_module
      }
    });

    if (etapes.length === 0) {
      res.status(404).send(`Étape non trouvée`);
    } else {
      const codesModules = etapes.map((etape) => etape.code_module);

      const modules = await Module.findAll({
        where: {
          code_module: codesModules,
        },
        attributes: ['code_module', 'nom_module'],
      });

      const modulesMap: Record<number, string> = {};
      modules.forEach((module) => {
        modulesMap[module.code_module] = module.nom_module;
      });

      const etapesAvecModule = etapes.map((etape) => ({
        num_etape: etape.num_etape,
        nom_etape: etape.nom_etape,
        texte: etape.texte,
        code_module: etape.code_module,
        module: modulesMap[etape.code_module],
        pdf: etape.pdf_path,  // Ajout de l'attribut pdf
      }));

      res.json(etapesAvecModule);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération de l'étape.`);
  }
};




/**
 * @swagger
 * /etape/nombre_par_module/{code_module}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir le nombre d'étapes associées à un module
 *     description: Recherche du nombre d'étapes par code de module
 *     parameters:
 *       - in: path
 *         name: code_module
 *         required: true
 *         description: Code module associé à l'étape
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Nombre d'étapes trouvées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Nombre d'étapes associées au module
 *       404:
 *         description: Aucune étape trouvée pour le module spécifié
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporteNbEtapeParCodeModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_module = Number(req.params.code_module);
    const etapeCount = await Etape.count({
      where: {
        code_module: code_module
      }
    });

    res.json({ count: etapeCount });
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la récupération du nombre d'étapes.`);
  }
};




/**
 * @swagger
 * /etape/modifier/{num_etape}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'une étape
 *     description: Modifier les informations d'une étape une fois trouvée par son numéro
 *     parameters:
 *       - in: path
 *         name: num_etape
 *         required: true
 *         description: Numéro de l'étape à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nom_etape:
 *                 type: string
 *               texte:
 *                 type: string
 *               code_module:
 *                 type: integer
 *               pdf_path:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Étape à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Etape'
 *       404:
 *         description: Étape introuvable
 *       500:
 *         description: Erreur interne au serveur
 */

export const modifierEtape = async (req: Request, res: Response): Promise<void> => {
  upload.single('pdf_path')(req, res, async (err: any) => {
    if (err instanceof MulterError) {
      return res.status(500).send(`Erreur lors de l'upload du fichier: ${err.message}`);
    } else if (err) {
      return res.status(500).send(`Erreur inconnue lors de l'upload du fichier: ${err}`);
    }

    try {
      const num_etape = Number(req.params.num_etape);
      const { nom_etape, texte, code_module } = req.body;
      const pdf_path = req.file ? req.file.path : null;

      const etape_a_modifier = await Etape.findByPk(num_etape);

      if (!etape_a_modifier) {
        res.status(404).send(`Étape non trouvée.`);
      } else {
        etape_a_modifier.nom_etape = nom_etape || etape_a_modifier.nom_etape;
        etape_a_modifier.texte = texte || etape_a_modifier.texte;
        etape_a_modifier.code_module = code_module || etape_a_modifier.code_module;

        if (pdf_path) {
          etape_a_modifier.pdf_path = pdf_path;
        }

        await etape_a_modifier.save();
        res.json(etape_a_modifier);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(`Une erreur s'est produite lors de la mise à jour de l'étape.`);
    }
  });
};





/**
 * @swagger
 * /etape/supprimer/{num_etape}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une étape
 *     description: Supprimer une étape une fois trouvée par son numéro
 *     parameters:
 *       - in: path
 *         name: num_etape
 *         required: true
 *         description: Numéro de l'étape à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Étape supprimée
 *       404:
 *         description: Étape introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerEtape = async (req: Request, res: Response): Promise<void> => {
  try {
    const num_etape = Number(req.params.num_etape);
    const etape = await Etape.findByPk(num_etape);

    if (!etape) {
      res.status(404).send(`Étape non trouvée.`);
    } else {
      await etape.destroy();
      res.send(`Étape supprimée avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression de l'étape.`);
  }
};



/**
 * @swagger
 * /etape/supprimer/par_module/{code_module}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une étape par code module
 *     description: Supprimer une étape en utilisant le code module associé
 *     parameters:
 *       - in: path
 *         name: code_module
 *         required: true
 *         description: Code module associé à l'étape
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Étape supprimée
 *       404:
 *         description: Étape introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerParCodeModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_module = Number(req.params.code_module);
    const etape = await Etape.findOne({
      where: {
        code_module: code_module
      }
    });

    if (!etape) {
      res.status(404).send(`Étape non trouvée.`);
    } else {
      await etape.destroy();
      res.send(`Étape supprimée avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression de l'étape.`);
  }
};





// // Suppression par code module
/**
 * @swagger
 * /etape/supprimer/par_module/{code_module}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer une étape par code module
 *     description: Supprimer une étape en utilisant le code module associé
 *     parameters:
 *       - in: path
 *         name: code_module
 *         required: true
 *         description: Code du module associé à l'étape à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etape supprimé
 *       404:
 *         description: Etape introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerEtapeParCodeModule = async (req: Request, res: Response): Promise<void> => {
  try {
    const code_module = Number(req.params.code_module);
    const etape = await Etape.findOne({
      where: {
        code_module: code_module
      }
    });

    if (!etape) {
      res.status(404).send(`Etape non trouvée.`);
    } else {
      await etape.destroy();
      res.send(`Etape supprimée avec succès.`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(`Une erreur s'est produite lors de la suppression de l'etape.`);
  }
};
