const express = require("express");
const bodyParser = require("body-parser");
// update the response for the promotionRouter
const Promotion = require("../models/promotion");
const { response } = require("express");

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter
  .route("/")
  // .all((req, res, next) => {
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "text/plain");
  //     next();
  // })
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        console.log("PartnerCreated", promotion);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
    // res.end(
    //     `Will add the promotion: ${req.body.name} with description: ${req.body.description}`
    // );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /promotions");
  })
  .delete((req, res, next) => {
      Promotion.deleteMany()
      .then(response => {
          res.statusCode = 200;
          res.setHeader("Content-Type", 'application/json');
          res.json(response);
      })
      .catch(err => next(err));
    // res.end("Deleting all promotions");
  });

// Transition of the routing methods
promotionRouter
  .route("/:promotionId")
  // .all((req, res, next) => {
  //     res.statusCode = 200;
  //     res.setHeader("Content-Type", "text/plain");
  //     next();
  // })
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
    // res.end(`Will send details of the promotion: ${req.params.promotionId} to you`);
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(
      `POST operation not supported on /promotions/${req.params.promotionId}`
    );
  })
  .put((req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    )
      .then((promotion) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(promotion);
      })
      .catch((err) => next(err));
    // res.write(
    //     `Updating the promotion: ${req.params.promotionId}\n`
    // );
    // res.end(`Will update the promotion: ${req.body.name} with description: ${req.body.description}`);
  })
  .delete((req, res, next) => {
      Promotion.findByIdAndDelete(req.params.promotionId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    // res.end(`Deleting promotions: ${req.params.promotionId}`);
  });

module.exports = promotionRouter;
