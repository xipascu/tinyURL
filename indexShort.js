function generateRandomString(numChars) {
  let string = "";
  let charOptions = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < numChars; i++) {
    string += charOptions.charAt(Math.floor(Math.random() * charOptions.length));
   }
   return string;
}

function authentication (email, password, users) {
  for (user in users) {
    if (users[user].email === email && users[user].password === password) {
      return users[user];
    } 
  }
  return undefined;
} 

function notAllowed (req, res, next) {
  if (res.locals.user === undefined) {
    res.status(403);
    res.send("try <a href=/login> logging in</a>.")
  } else {
    next();
  }
}

function withID (id, users) {
  for (user in users) {
    if (users[user].id === id) {
      return users[user];
    }
  }
  return undefined;
}

function confirm (req, res, next) {
  if (res.local.user === undefined) {
    res.sendStatus(403);
  } else {
    next();
  }
}

function findUID(database, currentID) {
  const object= {};
  for (tinyU in database) {
    if (database[tinyU].userID === currentID) {
      object[tinyU] = database[tinyU].url
    }
  }
  return object;
}

module.exports = { 
  generateRandomString: generateRandomString,
  authentication: authentication,
  notAllowed: notAllowed,
  withID: withID,
  confirm: confirm,
  findUID: findUID
};

