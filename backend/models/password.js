const passwordValidator = require('password-validator');

// Create a schema
const passSchema = new passwordValidator();

// Add properties to it
passSchema
    .is().min(8) // // Longueur minimun : 8
    .has().uppercase() // Doit avoir au moins une majuscule
    .has().lowercase() // Doit avoir au moins une minuscule
    .has().digits() // Doit avoir au moins un chiffre
    .has().not().spaces() // Ne doit pas avoir d'espaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist de valeurs à proscrire

module.exports = passSchema;