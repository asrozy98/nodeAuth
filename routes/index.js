var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/auth/login", authController.login);

router.post("/auth/register", authController.register);

module.exports = router;
