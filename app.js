const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user");

const app = express();

// Connection de mongoose
mongoose
  .connect(
    "mongodb+srv://zerdoun:Lololesarcs95@cluster0.pzi0hyb.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

//Gérer requête POST venant du front-end pour extraire le corps JSON
app.use(express.json());

//Gestion erreurs de CORS (origines différentes)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/api/auth", userRoutes);

//
app.use((req, res, next) => {
  console.log("Requête reçue !");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue !" });
  next();
});
/*Endpoint dédié à la création d'une sauce
app.post("/api/api/sauces", (req, res, next) => {
  console.log(req.body);
  res.status(201).json({
    message: "Sauce créée !",
  });
});*/

module.exports = app;
