const { hashSync } = require("bcrypt");
const express = require("express");
const app = express();
const UserModel = require("./config/db");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://datngo:datngo123@cluster0.zkx2xob.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

require("./config/passport");

app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successMessage: true,
    failureMessage: true,
  }),
  (req, res) => {
    if (req.isAuthenticated()) {
      res.status(200).send("Authorized");
    } else {
      res.status(401).send({ msg: "Unauthorized" });
    }
    console.log(req.session);
    console.log(req.user);
  }
);

app.post("/register", (req, res) => {
  let user = new UserModel({
    username: req.body.username,
    password: hashSync(req.body.password, 10),
  });

  user.save().then((user) => console.log(user));

  res.send({ success: true });
});

app.get("/logout", (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    res.redirect("/login");
  });
});
app.post("/logout");
app.get("/sessions", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).send({ msg: "Sessions Authorized" });
  } else {
    res.status(401).send({ msg: "Sessions Unauthorized" });
  }
  console.log("session::", req.session);
  console.log("users:::", req.username);
});

app.listen(PORT, (req, res) => {
  console.log("Listening to port 5000");
});
