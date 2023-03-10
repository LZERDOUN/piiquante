const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

const app = express();
const PORT = process.env.PORT;

// Connection de mongoose
mongoose
  .connect(
    `mongodb+srv://zerdoun:${process.env.DB_SECRET}@cluster0.pzi0hyb.mongodb.net/test?retryWrites=true&w=majority`,
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
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
