var AES = require("gibberish-aes/src/gibberish-aes.js"); 
const jwt = require("jsonwebtoken");
const config = require("../../localconfig");
const jwtSecret = config.user.secret;
var aesSecret = config.aesSecret;
var aesPass = config.aesPass;


function verifyLoginToken (encodedData){
  return AES.dec(jwt.verify(encodedData, jwtSecret).data, aesPass);
}

function getLoginToken (data){
  let encoded = AES.enc(data, aesPass);

  return jwt.sign(
    { data: encoded},
    jwtSecret,
    { expiresIn: "1h" }
  );
}

module.exports = {
  getLoginToken: getLoginToken,
  verifyLoginToken: verifyLoginToken
};