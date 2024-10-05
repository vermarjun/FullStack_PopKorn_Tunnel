const { Router } = require("express");
const { AuthMiddlware } = require("./middlewares");
const { RequestModel } = require("../database/Request");
const { requestSchema } = require("../InputValidationZod");

const RequestRouter = Router();

RequestRouter.get("/requests", async (req, res)=>{
    // query top 10 requests ordered by upvotes 
});

RequestRouter.post("/", AuthMiddlware, async (req, res)=>{
    let validInput = true;
    try {
        // console.log(req.body);
        requestSchema.parse(req.body);
    }
    catch(error){
        validInput = false;
        res.json({
            message : "Invalid Input",
        })
    }
    if (validInput){
        let err = false;
        const request = req.body.request;
        const author = req.UserId.id;
        try {
            const newRequest = new RequestModel({
                Request : request,
                Author : author,
                UpVotes : 0,
                LikedBy : [],
                Comments : [],
                Resolved : false,
            });
            await newRequest.save();
        }
        catch(error){
            err = true;
            res.json({
                message : "Error Connecting to database",
            })
        }
        if (!err){
            res.json({
                message : "Request Added Successfully",
            })
        }
    }
});

// TO DO, IDKHOW
RequestRouter.post("/upvote", AuthMiddlware, async (req, res)=>{

})

RequestRouter.post("/comment", AuthMiddlware , async (req, res)=>{
    // when sending posts to front end also send objectId because that objectId is to be returned when editing deleting or commenting on a post
    const requestId = req.body.requestId;
    let commentObj = {
        AuthorOfComment : req.UserId.id,
        Comment :  req.body.comment
    }
    let err = false;
    try {
        await RequestModel.findByIdAndUpdate({_id : requestId}, { $push : {Comments : commentObj}, $inc : {CommentsCount : 1} });
    }
    catch (error){
        err = true;
        res.json({
            message: "Can't Upload a comment",
        })
    }
    if (!err){
        res.json({
            message: "Successfull!",
        })
    }
})

RequestRouter.post("/resolved", AuthMiddlware ,async (req, res) => {
    const requestId = req.body.requestId;
    let err = false;
    try {
        await RequestModel.findByIdAndUpdate({_id : requestId}, {Resolved : true});
    }
    catch (error){
        err = true;
        res.json({
            message: "Error Connecting to database",
        })
    }
    if (!err){
        res.json({
            message: "Successfull!",
        })
    }
})

module.exports = {
    RequestRouter,
}