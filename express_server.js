var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

  //allows us to access POST request parameters 
  //like req.body.longURL stored in urlDatabase
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//***The body-parser library will allow 
//us to access POST request parameters, 
//such as req.body.longURL, which we will 
//store in a variable called urlDatabase

// "/" root path
app.get("/", (req, res) => {
  res.end();
});

app.get('/urls', (req, res) => {
    let templateVars = {urls: urlDatabase};
    res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get('/urls/:id', (req, res) => {
  let templateVars = {shortURL: req.params.id};
  res.render("urls_show", templateVars);
});


  //this should output any request parameters in terminal
app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
  });


function generateRandomString(numChars) {
   let string = "";
   let charOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   for (let i = 0; i < numChars; i++) {
     string += charOptions.charAt(Math.floor(Math.random() * charOptions.length));
    }
    return string;
}