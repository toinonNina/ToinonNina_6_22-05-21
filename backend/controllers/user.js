//installation de npm bcrypt 3.0.0 package de chiffrement

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//permet de masquer les adresses email dans la DB
const crypt = require('crypto-js');

const User = require('../models/User');


//fonction qui va crypté le mot de passe qui va le prendre et creer un nouveau user 
//avec ce mot de passe et l'email et va l'enregistrer dans la base de donnée
exports.signup = (req, res, next) => {
    const cryptoEmail = crypt.MD5(req.body.email).toString();
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: cryptoEmail,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
//fonction qui permet au utilisateur existant de se connecter
exports.login = (req, res, next) => {
    const cryptoEmail = crypt.MD5(req.body.email).toString();
    //findone pour trouver un seul utilisateur de la base de donnée 
    User.findOne({ email: cryptoEmail })
        //verifier si on a récuperer un user ou non
        .then(user => {
            if (!user) { // si pas trouver on renvoit une erreur
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            //bcrypt va comparé le mot de passe que l'utilisateur va entrer avec ce qui est déja enregistrer avec compare
            bcrypt.compare(req.body.password, user.password)
                .then(valid => { //valid est un boolean qui est d'abord sur true 
                    //si c'est false il y a error
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            process.env.DB_TOKEN, { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};