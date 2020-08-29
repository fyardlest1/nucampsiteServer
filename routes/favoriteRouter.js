const express = require("express");
const bodyParser = require("body-parser");
const Favorite = require("../models/favorite");
const authenticate = require("../authenticate");
const cors = require("./cors");
const { response } = require("express");

// Creating the favoriteRouter 
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

// Setting up CORS for favoriteRouter.route("/")
favoriteRouter.route("/")
// Preflight requests routes using the .options() method
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, (req, res, next) => {
    Favorite.find()
    .populate("user", "campsites")
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
    })
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        // Checking if the user has an associated favorite document
        if (favorite) {
            req.body.forEach((favId) => {
                // If the favorite campsite not include the _id
                if (!favorite.campsites.includes(favId._id)) {
                    // Just add it into the array
                    favorite.campsites.push(favId._id);
                }
                // And save it
                favorite.save()
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch((err) => next(err));
            });
        } 
        // If there is no favorite document for the user, create it
        else {
            Favorite.create({ user: req.user._id, campsites: req.body })
            .then(favorite => {
                res.statusCode = 200,
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
        }
    })
    .catch(err => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})
/** delete the entire list of favorites corresponding to the user, 
 * by deleting the favorite document corresponding to this user 
 * from the favorites collection. */
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.deleteMany()
    .then(response =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch((err) => next(err));
});

// Setting up CORS for favoriteRouter.route("/campsiteId")
favoriteRouter.route('/:campsiteId')
// Preflight requests routes using the .options() method
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(`GET operation not supported on /favorites/${req.params.campsiteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorite) => {
        // If the campsite is not already in the list of favorites
        // add the campsite specified in the URL parameter to the list of the user's list of favorite campsites
        if (favorite) {
          if (!favorite.campsites.includes(req.params.campsiteId)) {
            favorite.campsites.push(req.params.campsiteId);
            favorite
              .save()
              .then((favorite) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
              })
              .catch((err) => next(err));
          }
          // If the campsite is already in the list return an error
          else {
            const err = new Error(
              "That campsite is already in the list of favorites!"
            );
            err.status = 404;
            return next(err);
          }
        }
        // Creating the campsite if it not exist
        else {
          Favorite.create({
            user: req.user._id,
            campsites: [req.params.campsiteId],
          })
            .then((favorite) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(favorite);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    // res.statusCode = 403;
    // res.end("PUT operation not supported on /favorites");
    res.statusCode(403).end("PUT operation not supported on /favorites");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
    .then(favorite => {
        if (favorite) {
            const favIndex = favorite.campsites.indexOf(req.params.campsiteId);
            if (favIndex > -1) {
                favorite.campsites.splice(favIndex, 1);
                favorite.save()
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text');
                res.end("The favorite was remove successfully.");
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text');
                res.end("The campsite you try to delete is not on the favorite.");
            }
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }
    })
    .then(favorite => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    })
    .catch(err => next(err));

});

// Exporting the favoriteRouter
module.exports = favoriteRouter;
