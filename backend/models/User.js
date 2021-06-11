//on importe mongoose
const mongoose = require('mongoose');
// pour assurer une utilisation unique d'email installation npm unique validator
const uniqueValidator = require('mongoose-unique-validator');

// création d'un schéma User avec champs obligatoires
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true, match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/, "Veuillez entrer une adresse email correcte"] },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);