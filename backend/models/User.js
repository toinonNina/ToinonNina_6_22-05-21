//on importe mongoose
const mongoose = require('mongoose');
// pour assurer une utilisation unique d'email installation npm unique validator
const uniqueValidator = require('mongoose-unique-validator');

// création d'un schéma User avec champs obligatoires
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);