require('dotenv').config();

const jwt = require("jsonwebtoken");
const secret = process.env.JWT;

function createToken(payload){ 
    return jwt.sign(payload, secret)
}

function verifyToken(token){
    return jwt.verify(token, secret)
}

module.exports = { createToken, verifyToken}