const { Router } = require("express");
const { AuthMiddlware } = require("./middlewares");
const { UserModel } = require("../database/User");
const { PostModel } = require("../database/Posts");
const { RequestModel } = require("../database/Request")
const { postSchema } = require("../InputValidationZod");
const { requestSchema } = require("../InputValidationZod");
const axios = require("axios");

const ContributeRouter = Router();

ContributeRouter.get("/", (req ,res)=>{
    // server contribute page
    res.json({
        message : "Contribute.html"
    })
})

module.exports = {
    ContributeRouter,
}