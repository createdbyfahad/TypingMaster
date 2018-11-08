// Typing Master
// Last Edit: June 6th, 2018
// Authors: Fahad Alarefi

var jwt = require('jsonwebtoken');

// returns the jwt token
function getToken(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
}

// get user id from jwt
function extractUserID(jwtToken){
	var payload = jwt.decode(token);
    return payload.user_id;
}

// get user name from jwt
function extractName(jwtToken){
	var payload = jwt.decode(token);
    return payload.name;
}