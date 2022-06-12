const LocalStrategy = require("passport-local");
const models = require("../models");
const bcrypt = require("bcrypt");

function authConfig(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        models.User.findAll({
          where: {
            email: email,
          },
        })
          .then((user) => {
            if (!user[0]) {
              return done(null, false, {
                message: "Incorrect email or password.",
              });
            }
            const validPassword = bcrypt.compareSync(
              password,
              user[0].password
            );
            if (!validPassword) {
              return done(null, false, {
                message: "Incorrect email or password.",
              });
            }

            return done(null, user[0], {
              message: "Logged In Successfully",
            });
          })
          .catch((err) => {
            return done(err);
          });
      }
    )
  );
}

module.exports = authConfig;
