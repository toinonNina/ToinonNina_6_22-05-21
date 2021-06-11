const express = require('express');
const router = express.Router();


// Gestion du nombre de requêtes utilisateurs
const limiter = require('../middleware/Limiter-Request');
// Controle si l'email de l'utilisateur est déja enregistrer
const userCtrl = require('../controllers/user');
// Controle la forme du mot de pass pour forcé l'utilisateur a le complexifier pour la sécurité
const passwordValidation = require('../middleware/password-validation');

router.post('/signup', passwordValidation, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;