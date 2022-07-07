var createError = require("http-errors");
var express = require("express");
const passport = require("passport");
const session = require("express-session");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const db = require("./models/index");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
require("./config/authConfig")(passport);
const dockerPort = process.env.NODE_DOCKER_PORT;
const localPort = process.env.NODE_LOCAL_PORT;

var app = express();

// Middlewares
app.use(
  session({
    name: "session-id",
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
      expires: 600000,
    },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

(async () => {
  try {
    await db.sequelize.sync({ force: false });
    app.listen(dockerPort, function () {
      console.log(
        "App listening on docker port " +
          dockerPort +
          " and local port " +
          localPort +
          "!"
      );
    });
  } catch (error) {
    console.error(error);
  }
})();

module.exports = app;
