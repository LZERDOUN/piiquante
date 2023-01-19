const mongoose = require("mongoose");
//Package facilitant la tâche de vérification d'un email unique
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//Appliquer le validateur sur notre schéma
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
