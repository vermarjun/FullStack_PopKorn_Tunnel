// sign up sign in routes
const { Router } = require("express");
const { UserModel } = require("../database/User.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "password";
const bcrypt = require("bcrypt");
const { userSchemaSignUp } = require("../InputValidationZod");
const { userSchemaSignIn } = require("../InputValidationZod");

const AuthenticationRouter = Router();

AuthenticationRouter.get("/", (req,res)=>{
    res.json({
        message: "Homepage signup html",
    })
})

AuthenticationRouter.post("/signup", async (req , res)=> {
    // Using zod to validate the user input
    let validCreds = true;
    try {
        userSchemaSignUp.parse(req.body);
    }
    catch (error){
        validCreds = false;
        res.json({
            message : "Invalid Credentials, Please fill up fields accordingly!",
        })
    }
    if (validCreds){
        const username = req.body.username;
        // password ke sath uska salt bhi store so that i can again hash pass to compare both passwords during login
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        const email = req.body.email;
        const aura = 0;
        const pfp = req.body.pfp;
        let err = false;
        try {
            const newUser = new UserModel({Username: username, Password: { pass : password, salt : salt}, Email: email, Aura: aura, pfp: pfp});
            await newUser.save();
        }
        catch (error) {
            // upar se error repeated email ke case me ayega because email is unique in defined schema
            res.json({
                message: "This email is alreay being used or error connecting to database"
            })
            err = true;
        }
        if (!err){
            res.redirect("/auth/signinpage");
        }
    }
})

AuthenticationRouter.get("/signinpage", (req,res)=>{
    res.json({
        message:"signinpage.html"
    })
})

AuthenticationRouter.post("/signin", async (req,res)=>{
    let validInput = true;
    try {
        userSchemaSignIn.parse(req.body);
    }
    catch (error){
        validInput = false;
        res.json({
            token : null,
            message : "Invalid Credentials, Please fill up fields accordingly!",
        })
    }
    if (validInput){
        let email = req.body.email;
        let password = req.body.password;
        let user = null;
        try {
            user = await UserModel.findOne({
                Email : email,
            })
            console.log(user);
        }
        catch (error){
            console.log(error);
            res.json({
                token : null,
                message : "Slow connection or error connecting to database",
            })
        }
        if (user!=null){
            password =  await bcrypt.hash(password, user.Password.salt);
            if (password == user.Password.pass){
                const token = jwt.sign({id: user._id}, JWT_SECRET);
                res.json({
                    token : token,
                    message : "Successfull login",
                })
            }     
            else {
                res.json({
                    token : null,
                    message : "Invalid Password",
                })
            }
        }
    }
})

module.exports = {
    AuthenticationRouter
}