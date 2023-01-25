const jwt = require("jsonwebtoken");

//Fonction qui récupère le token, décode le token avec méthode verify utilisant la clé secrète, récupère le user.id
//et rajoute la valeur du user.id à l'objet request qui sera transmis aux routes par la suite
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
