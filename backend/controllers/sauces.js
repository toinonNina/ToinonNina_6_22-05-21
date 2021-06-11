// importation du modèle mongoose pour l'utiliser dans l'appli
const Sauce = require('../models/sauce');
const fs = require('fs');
//logique metiers
//permet d'exposer la logique de nos route en tant que fonction pour chaque crud

// Permet de créer une nouvelle sauce

exports.createSauce = (req, res, next) => {
    // On stocke les données envoyées par le front-end
    const sauceObject = JSON.parse(req.body.sauce);
    // On supprime l'id généré automatiquement et envoyé par le front-end. L'id de la sauce est créé par la base MongoDB lors de la création dans la base
    delete sauceObject._id;
    // Création d'une instance du modèle Sauce
    const sauce = new Sauce({
        ...sauceObject,
        // On modifie l'URL de l'image aprés avoir mis en place le middleware multer
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // Sauvegarde de la sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce enregistrée !'
        }))
        .catch(error => res.status(400).json({
            error
        }));

};

// Permet de modifier une sauce

exports.modifySauce = (req, res, next) => {
    let sauceObject = {};
    req.file ? (
        // Si la modification contient une image 
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
    ) : (
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
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({
            error
        }));
};

// Permet de récuperer toutes les sauces de la base MongoDB

exports.getAllSauce = (req, res, next) => {
    // On utilise la méthode find pour obtenir la liste complète des sauces trouvées dans la base
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({
            error
        }));
};


// Permet de "liker"ou "dislaker" une sauce

exports.likeDislike = (req, res, next) => {

    // Like présent dans le body
    let like = req.body.like;
    // le userID
    let userId = req.body.userId;
    // l'id de la sauce
    let sauceId = req.params.id;

    if (like === 1) { // Si il s'agit d'un like
        Sauce.updateOne({
                _id: sauceId
            }, {
                // On push l'utilisateur et on incrémente le compteur de 1
                $push: {
                    usersLiked: userId
                },
                $inc: {
                    likes: +1
                },
            })
            .then(() => res.status(200).json({
                message: 'like ajouté !'
            }))
            .catch((error) => res.status(400).json({
                error
            }));
    }
    if (like === -1) {
        Sauce.updateOne( // S'il s'agit d'un dislike
                {
                    _id: sauceId
                }, {
                    $push: {
                        usersDisliked: userId
                    },
                    $inc: {
                        dislikes: +1
                    },
                }
            )
            .then(() => {
                res.status(200).json({
                    message: 'Dislike ajouté !'
                });
            })
            .catch((error) => res.status(400).json({
                error
            }));
    }
    if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
        Sauce.findOne({
            _id: sauceId
        }).then((sauce) => {
            if (sauce.usersLiked.includes(userId)) { // Si il s'agit d'annuler un like
                Sauce.updateOne({
                        _id: sauceId
                    }, {
                        $pull: {
                            usersLiked: userId
                        },
                        $inc: {
                            likes: -1
                        },
                    })
                    .then(() => res.status(200).json({
                        message: 'Like retiré !'
                    }))
                    .catch((error) => res.status(400).json({
                        error
                    }));
            }
            if (sauce.usersDisliked.includes(userId)) { // Si il s'agit d'annuler un dislike
                Sauce.updateOne({
                        _id: sauceId
                    }, {
                        $pull: {
                            usersDisliked: userId
                        },
                        $inc: {
                            dislikes: -1
                        },
                    })
                    .then(() => res.status(200).json({
                        message: 'Dislike retiré !'
                    })).catch((error) => res.status(400).json({
                        error
                    }));
            }
        }).catch((error) => res.status(404).json({
            error
        }));
    }
};