const mongoose = require('mongoose');
const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then((sauce) => {
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.DB_TOKEN);
            const tokenUserId = decodedToken.userId;
            if (sauce.userId !== tokenUserId) {
                throw 'Invalid user ID';
            } else {
                next();
            }
        })
        .catch(error => res.status(404).json({
            error
        }));

    console.log(req.params.id);
};