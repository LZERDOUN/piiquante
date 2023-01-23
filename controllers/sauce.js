const Sauce = require("../models/Sauce");
const fs = require("fs");

//Ajouter une sauce
exports.createSauce = (req, res, next) => {
  console.log(req.body);
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistrée !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Afficher les sauces sur la page d'accueil
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Afficher une sauce spécifique
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

//Mise à jour d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimée !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//Gestion des likes
exports.handleLike = (req, res, next) => {
  const liker = req.body.userId;
  let likeStatus = req.body.like;
  Sauce.findOne({ _id: req.params.id })
    .then((votedSauce) => {
      if (likeStatus === 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $push: { usersLiked: liker }, $inc: { likes: 1 } }
        )
          .then(() => res.status(201).json({ message: "you liked this sauce" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (likeStatus === -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: 1 }, $push: { usersDisliked: liker } }
        )
          .then(() =>
            res.status(201).json({ message: "you disliked this sauce" })
          )
          .catch((error) => res.status(400).json({ error }));
      } else if (likeStatus === 0) {
        if (votedSauce.usersLiked.includes(liker)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: liker } }
          )
            .then(() =>
              res.status(201).json({ message: "you un-liked this sauce" })
            )
            .catch((error) => res.status(400).json({ error }));
        } else if (votedSauce.usersDisliked.includes(liker)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { dislikes: -1 }, $pull: { usersDisliked: liker } }
          )
            .then(() =>
              res.status(201).json({ message: "you un-disliked this sauce" })
            )
            .catch((error) => res.status(400).json({ error }));
        }
      }
    })
    .catch((error) => res.status(400).json({ error }));
};
