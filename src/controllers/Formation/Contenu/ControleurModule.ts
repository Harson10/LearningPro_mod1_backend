import { Request, Response } from "express";
import Module from "../../../models/Formation/Contenu/Module";
import Formation from "../../../models/Formation/Contenu/Formation";

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       properties:
 *         code_module:
 *           type: number
 *           example: 123
 *         nom_module:
 *           type: string
 *           example: "Module informatique avancée"
 *         cout_module:
 *           type: number
 *           example: 1000
 *     Formation:
 *       type: object
 *       properties:
 *         code_formation: 
 *           type: number
 *           example: 456
 *         nom_formation:
 *           type: string
 *           example: "Nom de la formation"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

// Création d'une module
/**
 * @swagger
 * /module/creer:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Création d'un nouveau module
 *     description: Crée un nouveau module avec un code, un nom et un coût.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code_module:
 *                 type: number
 *                 description: Code du module.
 *                 example: 123
 *               nom_module:
 *                 type: string
 *                 description: Nom du module.
 *                 example: "Module informatique avancée"
 *               cout_module:
 *                 type: number
 *                 description: Coût du module.
 *                 example: 1000
 *     responses:
 *       200:
 *         description: Module créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       500:
 *         description: Erreur serveur lors de la création du module
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Une erreur s'est produite lors de la création du module.
 */
export const creerModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const { code_module, code_formation, nom_module, cout_module } = req.body;
        const nouvel_module = await Module.create({
            code_module, code_formation, nom_module, cout_module
        });
        res.json(nouvel_module);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la création du module.`);
    }
};


/**
 * @swagger
 * /module/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de tous les modules
 *     description: Liste contenant des informations sur tous les modules.
 *     responses:
 *       200:
 *         description: Liste des modules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ModuleAvecFormation'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterModules = async (req: Request, res: Response): Promise<void> => {
    try {
        const modules = await Module.findAll();

        const codesFormations = modules.map((module) => module.code_formation);

        const formations = await Formation.findAll({
            where: {
                code_formation: codesFormations,
            },
            attributes: ['code_formation', 'nom_formation'],
        });

        const formationsMap: Record<number, string> = {};
        formations.forEach((formation) => {
            formationsMap[formation.code_formation] = formation.nom_formation;
        });

        const modulesAvecFormation = modules.map((module) => ({
            code_module: module.code_module,
            nom_module: module.nom_module,
            cout_module: module.cout_module,
            code_formation: module.code_formation,
            formation: formationsMap[module.code_formation],
        }));

        res.json(modulesAvecFormation);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération des modules.`);
    }
};


/**
 * @swagger
 * /module/publique:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de tous les modules avec formation publique
 *     description: Liste contenant des informations sur tous les modules dont la formation est publique.
 *     responses:
 *       200:
 *         description: Liste des modules avec formation publique
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ModuleAvecFormation'
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterModulesAvecFormationPublique = async (req: Request, res: Response): Promise<void> => {
    try {
        const modules = await Module.findAll({
            include: [{
                model: Formation,
                where: { publication: 'Oui' },
                attributes: ['code_formation', 'nom_formation'],
                as: 'formation',
                required: true, // Utilisez required pour une jointure interne (seuls les modules avec des formations correspondantes seront inclus)
            }],
        });

        const modulesAvecFormation = modules.map((module) => ({
            code_module: module.code_module,
            nom_module: module.nom_module,
            cout_module: module.cout_module,
            code_formation: module.code_formation,
            formation: module.formation ? module.formation.nom_formation : '',
        }));

        res.json(modulesAvecFormation);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération des modules.`);
    }
};



// Rapport d'un module par code_module
/**
 * @swagger
 * /module/{code_module}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir des informations sur un module à partir de son code
 *     description: Recherche d'un module par son code
 *     parameters:
 *       - in: path
 *         name: code_module
 *         required: true
 *         description: Code du module à récupérer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Module trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterParCodeModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_module = Number(req.params.code_module);
        const module_a_rapporter = await Module.findByPk(code_module);

        if (!module_a_rapporter) {
            res.status(404).send(`Module non trouvé`);
        } else {
            res.json(module_a_rapporter);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération du module.`);
    }
}


// Recherche des modules par code_formation
/**
 * @swagger
 * /module/par_formation/{code_formation}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir une liste de modules par code de formation
 *     description: Liste contenant des informations sur les modules associés à une formation.
 *     parameters:
 *       - in: path
 *         name: code_formation
 *         required: true
 *         description: Code de la formation pour laquelle récupérer les modules
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Liste des modules associés à la formation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ModuleAvecFormation'
 *       404:
 *         description: Aucun module trouvé pour la formation donnée
 *       500:
 *         description: Erreur interne au serveur
 */
export const rapporterModulesParCodeFormation = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_formation = Number(req.params.code_formation);

        // Recherche des modules associés à la formation
        const modules = await Module.findAll({
            where: {
                code_formation: code_formation
            }
        });

        if (modules.length === 0) {
            res.status(404).send(`Aucun module trouvé pour la formation donnée.`);
        } else {
            const codesFormations = modules.map((module) => module.code_formation);

            const formations = await Formation.findAll({
                where: {
                    code_formation: codesFormations,
                },
                attributes: ['code_formation', 'nom_formation'],
            });

            const formationsMap: Record<number, string> = {};
            formations.forEach((formation) => {
                formationsMap[formation.code_formation] = formation.nom_formation;
            });

            const modulesAvecFormation = modules.map((module) => ({
                code_module: module.code_module,
                nom_module: module.nom_module,
                cout_module: module.cout_module,
                code_formation: module.code_formation,
                formation: formationsMap[module.code_formation],
            }));

            res.json(modulesAvecFormation);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération des modules pour la formation donnée.`);
    }
};



// Modification des informations d'un module
/**
 * @swagger
 * /module/modifier/{code_module}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Modification d'information d'un module
 *     description: Modifier les informations d'un module une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_module
 *         required: true
 *         description: Code du module à modifier
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom_module:
 *                 type: string
 *                 description: Nouveau nom du module.
 *                 example: "Nouveau nom"
 *               cout_module:
 *                 type: number
 *                 description: Nouveau coût du module.
 *                 example: 1200
 *     responses:
 *       200:
 *         description: Module à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const modifierModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_module = Number(req.params.code_module);
        const { nom_module, cout_module } = req.body;
        const module_a_modifier = await Module.findByPk(code_module);

        if (!module_a_modifier) {
            res.status(404).send(`Module non trouvé.`);
        } else {
            module_a_modifier.nom_module = nom_module;
            module_a_modifier.cout_module = cout_module;
            await module_a_modifier.save();
            res.json(module_a_modifier);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la modification du module`)
    }
}

// Suppression d'un module
/**
 * @swagger
 * /module/supprimer/{code_module}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer un module
 *     description: Supprimer un module une fois trouvé par son code
 *     parameters:
 *       - in: path
 *         name: code_module
 *         required: true
 *         description: Code du module à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Module supprimé
 *       404:
 *         description: Module introuvable
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_module = Number(req.params.code_module);
        const module = await Module.findByPk(code_module);

        if (!module) {
            res.status(404).send(`Module non trouvé.`);
        } else {
            await module.destroy();
            res.send('Module supprimé avec succès.')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la suppression du module`);
    }
};


// Suppression de modules par code_formation
/**
 * @swagger
 * /module/supprimer/par_formation/{code_formation}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     summary: Supprimer des modules par code de formation
 *     description: Supprimer tous les modules associés à une formation en utilisant le code de formation
 *     parameters:
 *       - in: path
 *         name: code_formation
 *         required: true
 *         description: Code de la formation associée aux modules à supprimer
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Modules supprimés avec succès
 *       404:
 *         description: Aucun module trouvé pour la formation donnée
 *       500:
 *         description: Erreur interne au serveur
 */
export const supprimerModulesParCodeFormation = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_formation = Number(req.params.code_formation);

        // Supprimer tous les modules associés à la formation
        const modules = await Module.destroy({
            where: {
                code_formation: code_formation
            }
        });

        if (modules === 0) {
            res.status(404).send(`Aucun module trouvé pour la formation donnée.`);
        } else {
            res.send(`Modules supprimés avec succès.`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la suppression des modules.`);
    }
};


// Nombre de module par formation
/**
* @swagger
* /module/nombre_par_formation/{code_formation}:
*   get:
*     security:
*       - bearerAuth: []
*     summary: Obtenir le nombre de modules par code de formation
*     description: Obtient le nombre de modules associés à une formation en utilisant le code de formation
*     parameters:
*       - in: path
*         name: code_formation
*         required: true
*         description: Code de la formation pour laquelle récupérer le nombre de modules
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Nombre de modules associés à la formation
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 count:
*                   type: number
*                   example: 5
*       404:
*         description: Aucun module trouvé pour la formation donnée
*       500:
*         description: Erreur interne au serveur
*/
export const nombreModulesParCodeFormation = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_formation = Number(req.params.code_formation);

        // Utilisez la méthode count de Sequelize pour obtenir le nombre de modules
        const count = await Module.count({
            where: {
                code_formation: code_formation
            }
        });

        if (count === 0) {
            res.status(404).send(`Aucun module trouvé pour la formation donnée.`);
        } else {
            res.json({ count });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération du nombre de modules pour la formation donnée.`);
    }
};

/**
 * @swagger
 * /module/somme_cout_par_formation/{code_formation}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Obtenir la somme du coût des modules par code de formation
 *     description: Obtient la somme du coût de tous les modules associés à une formation en utilisant le code de formation
 *     parameters:
 *       - in: path
 *         name: code_formation
 *         required: true
 *         description: Code de la formation pour laquelle récupérer la somme du coût des modules
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Somme du coût des modules associés à la formation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 sum:
 *                   type: number
 *                   example: 5000
 *       404:
 *         description: Aucun module trouvé pour la formation donnée
 *       500:
 *         description: Erreur interne au serveur
 */
export const sommeCoutModulesParCodeFormation = async (req: Request, res: Response): Promise<void> => {
    try {
        const code_formation = Number(req.params.code_formation);
        
        // Utilisez la méthode sum de Sequelize pour obtenir la somme du coût des modules
        let sum = await Module.sum('cout_module', {
            where: {
                code_formation: code_formation
            }
        });

        if (sum === null) {
            sum = 0;
            res.json({ sum });
        } else {
            res.json({ sum });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Une erreur s'est produite lors de la récupération de la somme du coût des modules pour la formation donnée.`);
    }
};
