// Confugure all Passport Authentication Strategy
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');
const FacebookTokenStrategy = require('passport-facebook-token');

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));

// Determine which data of the user object should be stored in session
passport.serializeUser(User.serializeUser());
// Corresponds to the key of the user object to retreive the whole data object
passport.deserializeUser(User.deserializeUser());

// Call a user json object and create a token for that user
exports.getToken = user => {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

// Key value pair to specify the JWT base strategy
const opts = {};
// How the JWT token should be extracted from incoming req message
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// Helps supply the secret key to log in
opts.secretOrKey = config.secretKey;

// This is just checking to see if JWT is created
exports.jwtPassport = passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("JWT payload:", jwt_payload);
    User.findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);

// This will always return req.user === the model User
exports.verifyUser = passport.authenticate("jwt", { session: false });

// Set up the verifyAdmin() middleware
exports.verifyAdmin = ((req, res, next) => {
  User.findById({_id: req.user._id})
  .then(user => {
    if (user.admin) {
      return next();
    } else {
      const err = new Error("You are not authorized to perform this operation!");
      res.statusCode = 403;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err))
  
});

exports.facebookPassport = passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facebook.clientId,
      clientSecret: config.facebook.clientSecret
    },
    // Verify callback function
    (accessToken, refreshToken, profile, done) => {
      User.findOne({facebookId: profile.id}, (err, user) => {
        if (err) {
          return done(err, false);
        }
        if (!err && user) {
          return done(null, user);
        } else {
          user = new User ({ username: profile.displayName });
          user.facebookId = profile.id;
          user.firstname = profile.name.givenName;
          user.lastname = profile.name.familyName;
          user.save((err, user) => {
            if (err) {
              return done(err, false);
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  )
)