// import modules npm
const express = require('express');
// demande POST gestion avec body-parser, afin d'extraire objet JSON 
const bodyParser = require('body-parser');

const app = express();
// import mongoose pour utilisation de la base de donnée
const mongoose = require('mongoose');

const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');

mongoose.connect('mongodb+srv://zazeal:KWHx8Gugn8zRR84@cluster0.7eiyq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Cors système de sécurité qui empèches les requètes malveillante, ont doit le parametrer avec des headers pour autorisé l'utilisateur a utiliser l'api
app.use((req, res, next) => {
    //tout le monde peut y acceder avec l'étoile
    res.setHeader('Access-Control-Allow-Origin', '*');
    // on donne l'autorisation a utiliser certain entête sur l'objet requète
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //on donne l'autorisation a utiliser certain methode
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    //on appel next pour passer au middleware suivant
    next();
});

app.use(bodyParser.json());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;