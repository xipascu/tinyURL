
const express = require("express");
const bodyParser = require("body-parser");
const PORT = process.env.PORT || 8080;
const cookieParser = require('cookie-parser');
const app = express(); 

app.use(cookieParser());


//view engine - what allows you to use ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


  //generating new URL
var smallURL = require("./indexShort");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};



//Root Routes
app.get("/", (req, res) => {
  res.redirect("/urls"); 
});

app.get("/urls", (req, res) => {
    let templateVars = {
      urls: urlDatabase,
      username: req.cookies["username"]
    };
    res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  var tinyU = req.params.id;
  let templateVars = {
    shortURL: tinyU,
    longURL: urlDatabase[tinyU],
    username: req.cookies["username"]
    };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["username"]
    };  
  res.render("urls_new", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
    //request parameters on short url
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});



  //this should output any request parameters in terminal
app.post("/urls", (req, res) => {
  var shortURL = smallURL.generateRandomString(6);
  urlDatabase[shortURL] = req.body.longURL;
  console.log(urlDatabase)
  res.redirect("/urls/" + shortURL);    
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

app.post("/urls/:id", (req,res) =>{
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/login", (req,res) =>{
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

app.post("/logout", (req,res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



