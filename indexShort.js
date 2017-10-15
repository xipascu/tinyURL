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



module.exports = { 
  generateRandomString: generateRandomString,
  authentication: authentication,
};