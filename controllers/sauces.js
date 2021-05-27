// importation du modèle mongoose pour l'utiliser dans l'appli
const Sauce = require('../models/sauce');
const fs = require('fs');
//logique metiers


// Permet de créer une nouvelle sauce

exports.createSauce = (req, res, next) => {
    // On stocke les données envoyées par le front-end sous forme de form-data dans une variable en les transformant en objet js
    const sauceObject = JSON.parse(req.body.sauce);
    // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
    delete sauceObject._id;
    // Création d'une instance du modèle Sauce
    const sauce = new Sauce({
        ...sauceObject,
        // On modifie l'URL de l'image, on veut l'URL complète, quelque chose dynamique avec les segments de l'URL
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // Sauvegarde de la sauce dans la base de données
    sauce.save()
        // On envoi une réponse au frontend avec un statut 201 sinon on a une expiration de la requête
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        // On ajoute un code erreur en cas de problème
        .catch(error => res.status(400).json({
            error
        }));
    //.catch(error => {
    //res.writeHead( 400, '{"message":"Format des champs du formulaire sauce ne validant pas le middleware sauceValidation"}', {'content-type' : 'application/json'});
    //res.end('Format des champs du formulaire invalide');
    //})
};

// Permet de modifier une sauce

exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    req.file ? (
        // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
        Sauce.findOne({
            _id: req.params.id
        }).then((sauce) => {
            // On supprime l'ancienne image du serveur
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
        }),
        sauceObject = {
            // On modifie les données et on ajoute la nouvelle image
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
    ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
        // Si la modification ne contient pas de nouvelle image
        sauceObject = {
            ...req.body
        }
    );
    Sauce.updateOne(
            // On applique les paramètre de sauceObject
            {
                _id: req.params.id
            }, {
                ...sauceObject,
                _id: req.params.id
            }
        )
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch((error) => res.status(400).json({
            error
        }));
};

// Permet de supprimer la sauce

exports.deleteSauce = (req, res, next) => {
    // Avant de suppr l'objet, on va le chercher pour obtenir l'url de l'image et supprimer le fichier image de la base
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            // Pour extraire ce fichier, on récupère l'url de la sauce, et on le split autour de la chaine de caractères, donc le nom du fichier
            const filename = sauce.imageUrl.split('/images/')[1];
            // Avec ce nom de fichier, on appelle unlink pour suppr le fichier
            fs.unlink(`images/${filename}`, () => {
                // On supprime le document correspondant de la base de données
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Sauce supprimée !'
                    }))
                    .catch(error => res.status(400).json({
                        error
                    }));
            });
        })
        .catch(error => res.status(500).json({
            error
        }));
};

// Permet de récupérer une seule sauce, identifiée par son id depuis la base MongoDB

exports.getOneSauce = (req, res, next) => {
    // On utilise la méthode findOne et on lui passe l'objet de comparaison, on veut que l'id de la sauce soit le même que le paramètre de requête
    Sauce.findOne({
            _id: req.params.id
        })
        // Si ok on retourne une réponse et l'objet
        .then(sauce => res.status(200).json(sauce))
        // Si erreur on génère une erreur 404 pour dire qu'on ne trouve pas l'objet
        .catch(error => res.status(404).json({
            error
        }));
};

// Permet de récuperer toutes les sauces de la base MongoDB

exports.getAllSauce = (req, res, next) => {
    // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base, l'array de toutes les sauves de la base de données
    Sauce.find()
        // Si OK on retourne un tableau de toutes les données
        .then(sauces => res.status(200).json(sauces))
        // Si erreur on retourne un message d'erreur
        .catch(error => res.status(400).json({
            error
        }));
};

























/*
// export pour la création d'un objet
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    req.file ? (
        // Si la modification contient une image => Utilisation de l'opérateur ternaire comme structure conditionnelle.
        Sauce.findOne({
            _id: req.params.id
        }).then((sauce) => {
            // On supprime l'ancienne image du serveur
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlinkSync(`images/${filename}`);
        }),
        sauceObject = {
            // On modifie les données et on ajoute la nouvelle image
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
    ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
        // Si la modification ne contient pas de nouvelle image
        sauceObject = {
            ...req.body
        }
    );
    Sauce.updateOne(
            // On applique les paramètre de sauceObject
            {
                _id: req.params.id
            }, {
                ...sauceObject,
                _id: req.params.id
            }
        )
        .then(() => res.status(200).json({
            message: 'Sauce modifiée !'
        }))
        .catch((error) => res.status(400).json({
            error
        }));
};



exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};*/