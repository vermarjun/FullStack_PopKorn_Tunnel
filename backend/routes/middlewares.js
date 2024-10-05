// Middle Wares:
const jwt = require("jsonwebtoken");
const JWT_SECRET = "password";

// Authorization Middle Ware: 
async function AuthMiddlware(req, res, next){
    const token = req.query.token;
    let decoded_token = null;
    try {
        decoded_token = jwt.verify(token, JWT_SECRET);
    }
    catch (error){
        decoded_token = null;
    }
    if (decoded_token){
        // valid request
        req.UserId = decoded_token;
        next();
    }
    else {
        // Login has expired
        // Redirect user to sign-in page
        res.redirect(307, '/auth');
    }
}

module.exports = {
    AuthMiddlware,
}