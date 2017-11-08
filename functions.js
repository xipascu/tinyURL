const bcrypt = require('bcrypt');
function generateRandomString(numChars) {
  let string = "";
  let charOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < numChars; i++) {
    string += charOptions.charAt(Math.floor(Math.random() * charOptions.length));
  }
  return string;
}

function userCheck(email, password, users) {
  for (user in users) {
    if (users[user].email === email && bcrypt.compareSync(password, users[user].password)) {
      return users[user];
    }
  }
  return undefined;
}

function refused(req, res, next) {
  if (res.locals.user === undefined) {
    res.status(403);
    res.send("You need to <a href=/login>login</a> or <a href=/register>register</a> first!");
  } else {
    next();
  }
}

function userUrls(database, currentUserId) {
  const obj = {};
  for (tinyURL in database) {
    if (database[tinyURL].userID === currentUserId) {
      obj[tinyURL] = database[tinyURL].url
    }
  }
  return obj;
}

function idCheck(id, users) {
  for (user in users) {
    if (users[user].id === id) {
      return users[user];
    }
  }
  return undefined;
}

module.exports = {
  generateRandomString: generateRandomString,
  userCheck: userCheck,
  refused: refused,
  idCheck: idCheck,
  userUrls: userUrls,
};