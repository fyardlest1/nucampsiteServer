const express = require("express");
const authenticate = require("../authenticate");
const multer = require("multer");

// Custom configuration - Determine the way multer handle file uploads
const storage = multer.diskStorage({
    // The configuration settings
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

// Setting up a file-filter to determine the file extension / or the type of file the server should accept
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

// We just call the multer function - so the multer function is configure to enable file upload
const upload = multer({ storage: storage, fileFilter: imageFileFilter });

// Setup the router
const uploadRouter = express.Router();

// Confugure the upload router to handle verious http request
uploadRouter
  .route("/")
  // The get have series of midleware as argument
  .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /imageUpload");
  })
  // In the post request we add the aupload midleware
  .post(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    upload.single("imageFile"),
    (req, res) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(req.file);
    }
  )
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /imageUpload");
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("DELETE operation not supported on /imageUpload");
    }
  );

  // Export the router
module.exports = uploadRouter;
