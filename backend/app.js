// import modules npm
const express = require('express');
// demande POST gestion avec body-parser, afin d'extraire objet JSON 
const bodyParser = require('body-parser');
// import mongoose pour utilisation de la base de donnée
const mongoose = require('mongoose');
const sauceRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
const path = require('path');
//pour le piratage de session et la force-brute
const rateLimit = require("express-rate-limit");
//Import de helmet pour la sécurisation contre les injections
const helmet = require("helmet");
//import de dotenv pour gérer des variables cachées  pour sécuriser les infos admin
require('dotenv').config();
//import de mongo sanitize pour contrer NoSQL query injection
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@cluster0.7eiyq.mongodb.net/SauceBase?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(limiter);

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
app.use(helmet());
app.use(mongoSanitize());
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;