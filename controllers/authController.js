const passport = require("passport");
const bcrypt = require("bcrypt");
const model = require("../models");

exports.register = (req, res, next) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  model.User.create({
    name: name,
    email: email,
    password: hash,
  })
    .then((user) => {
      return res.status(200).send({
        success: true,
        message: "Success, User created",
        data: user,
      });
    })
    .catch((err) => {
      let error = [];
      err.errors.map((e) => {
        error.push(e.message);
      });
      return res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error,
      });
    });
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: err.messsage,
      });
    }

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
        error: "Email or password incorrect",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Success, you've been logged in ",
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  return res.status(200).send({
    success: true,
    message: "Success, you've been logged out",
  });
};
