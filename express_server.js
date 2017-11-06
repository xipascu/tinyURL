var express = require("express");
var cookieParser = require('cookie-parser')
var app = express()
app.use(cookieParser())
var PORT = process.env.PORT || 8080;
app.set("view engine", "ejs");
const changesF = require("./functions");
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({
  extended: true
}));

const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userID: "userRandomID"
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userID: "user2RandomID"
  }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@user.com",
    password: bcrypt.hashSync("user", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user1@user.com",
    password: bcrypt.hashSync("user", 10)
  }
}

app.use((req, res, next) => {
  res.locals.user = changesF.idCheck(req.cookies.user_id, users);
  next();
});

app.use('/urls', (req, res, next) => {
  changesF.refused(req, res, next);
});

// GET
app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL].url;
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const usersURLS = changesF.userUrls(urlDatabase, req.cookies["user_id"])
  let templateVars = {
    urls: usersURLS,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const tinyU = req.params.id;
  if (urlDatabase[req.params.id].userID === req.cookies["user_id"]) {
    let templateVars = {
      shortURL: tinyU,
      longURL: urlDatabase[tinyU].url,
      user: users[req.cookies["user_id"]]
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(418);
    res.send("Oops! This doesn't belong to you. Try singing in!");
  }
});

app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("register_index", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.cookies["user_id"]]
  };
  res.render("login_index", templateVars);
});




// POST
app.post("/register", (req, res) => {
  const email = req.body;
  const password = bcrypt.hashSync(req.body.password, 10);
  if (email === "" || password === "") {
    res.status(400);
    res.send("Please input your e-mail and choose a password. <a href=/register>Try again.</a>");
  } else {
    const user = changesF.userCheck(email, password, users);
    if (user) {
      res.send("Already created. <a href=/register>Please try again</a>");
    } else {
      const userID = changesF.generateRandomString(6);
      users[userID] = {
        id: userID,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10)
      }
      res.cookie("user_id", userID);
      res.locals.user = changesF.idCheck(req.cookies.user_id, users);
      res.redirect("/urls");
    }
  }
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = changesF.userCheck(email, password, users);
  if (user) {
    res.cookie("user_id", user.id);
    res.locals.user = changesF.idCheck(req.cookies["user_id"], users);
    res.redirect("/urls");
  } else {
    res.status(403);
    res.send("The information provided did not match. <a href=/login >Please try again</a>");
  }
});

app.post("/urls", (req, res) => {
  const shortURL = changesF.generateRandomString(6);
  urlDatabase[shortURL] = {
    url: req.body.longURL,
    userID: req.cookies.user_id
  }
  res.redirect("/urls/" + shortURL);
});

app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.cookies["user_id"]) {
    delete urlDatabase[req.params.id];
  }
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.cookies["user_id"]) {
    urlDatabase[req.params.id].url = req.body.longURL;
    res.redirect("/urls");
  } else {
    res.redirect("/urls/" + req.params.id);
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});




app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});