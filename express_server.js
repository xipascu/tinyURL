
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
const cookieParser = require('cookie-parser');
const app = express(); 

app.use(cookieParser());
//view engine - what allows you to use ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

  //functions module
var outerFunct = require("./indexShort");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  };

//
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}


//Root Routes
//
app.get("/register", (req,res) => {
  let templateVars = {
    user: users[req.cookies["userID"]]
  };
  res.render("register", templateVars);
});
//
app.get("/login", (req,res) => {
  let templateVars = {
    user: users[req.cookies["userID"]]
  };
  res.render("login_index", templateVars);
});
//
app.get("/", (req, res) => {
  res.redirect("/urls"); 
});
//
app.get("/urls", (req, res) => {
    let templateVars = {
      urls: urlDatabase,
      user: users[req.cookies["user_id"]]
    };
    res.render("urls_index", templateVars);
});
//
app.get("/urls/:id", (req, res) => {
  const tinyU = req.params.id;
  let templateVars = {
    shortURL: tinyU,
    longURL: urlDatabase[tinyU],
    user: users[req.cookies["user_id"]]
    };
  res.render("urls_show", templateVars);
});
//
app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]]
    };  
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    //request parameters on short url
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });








  //this should output any request parameters in terminal
//
app.post("/urls", (req, res) => {
  var shortURL = outerFunct.generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase)
  res.redirect("/urls/" + shortURL);    
});
//
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});
//
app.post("/urls/:id", (req,res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});
//
app.post("/login", (req,res) => {
  const {email, password} = req.body;
  const user = outerFunct.authentication(email, password, users);
  if (user) {
    res.cookie("user_id", user.id);
    res.redirect("/urls");
  } else {
    res.status(403);
    res.send("The information you provided did not match, please <a href=/login>try again</a>.")
  }
});
//
app.post("/logout", (req,res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});
//
app.post("/register", (req,res) => {
  //http://www.summa.com/blog/securing-node.js-the-missing-ingredient-in-your-password-composition
  const {email, password} = req.body;
    //if no email, return error 
    if (email === "" || password === "") {
      res.status(400);
      res.send("You're missing an email and/or a password. Please try again.")
    } else {
      const user = outerFunct.authentication(email, password, users);

      if (user) {
        res.send("Already created, please try again.");
      } else {
        const userID = outerFunct.generateRandomString(6);
        users[userID] = {
          id: userID,
          email: req.body.email,
          password: req.body.password
        }
      res.cookie("user_id", userID);
      res.redirect("/urls");
      }
    }
});

//
app.listen(PORT, () => {
  console.log(`Tiny app listening on port ${PORT}!`);
});



