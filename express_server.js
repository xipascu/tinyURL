//declare dependencies
const express = require("express");
   //allows us to access POST request parameters 
   //like req.body.longURL stored in urlDatabase
const bodyParser = require("body-parser");
  //taking it from an environment variable
const PORT = process.env.PORT || 8080;
//declare constants used through
const app = express(); 
//view engine - what allows you to use ejs
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

var smallURL = require("./indexShort");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"

};



//Root Routes
app.get("/", (req, res) => {
  res.redirect("/urls"); 
});

app.get('/urls', (req, res) => {
    let templateVars = {
      urls: urlDatabase
    };
    res.render("urls_index", templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id
    };
  res.render("urls_show", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
  res.redirect("/urls/:id" + shortURL);    
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



