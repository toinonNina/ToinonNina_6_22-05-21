//on importe mongoose
const mongoose = require('mongoose');

// création d'un schéma sauce avec champs obligatoires

const sauceSchema = mongoose.Schema({
    //id de la sauce pas besoin d'un champs il est généré par Mongoose
    //id de l'utilisateur
    userId: {
        type: String,
        required: true
    },
    //nom de la sauce
    name: {
        type: String,
        required: true
    },
    //créateur de la sauce
    manufacturer: {
        type: String,
        required: true
    },
    //description de la sauce
    description: {
        type: String,
        required: true
    },
    //ingrédient piquant
    mainPepper: {
        type: String,
        required: true
    },
    //image de la sauce
    imageUrl: {
        type: String,
        required: true
    },
    //level de piquant
    heat: {
        type: Number,
        required: true
    },
    //nombre de like
    likes: {
        type: Number,
        required: true
    },
    //nombre de dislike
    dislikes: {
        type: Number,
        required: true
    },
    //like utilisateur
    usersLiked: [String],
    //dislike utilisateur
    usersDisliked: [String],

});
// export du schema de donné . le rendant disponible pour l'appli Express
module.exports = mongoose.model('Sauce', sauceSchema);