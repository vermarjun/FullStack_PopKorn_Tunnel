const { Router } = require("express");
const { AuthMiddlware } = require("./middlewares");
const { UserModel } = require("../database/User");
const { PostModel } = require("../database/Posts");
const { postSchema } = require("../InputValidationZod");
const axios = require("axios");

const OMDBApiKey = "";

const PostRouter = Router();

PostRouter.get("/", async (req, res)=>{
    // destructuring the query parameters as well as asigning default values!
    // NOTTE THAT WHEN ALL POSTS HAVE BEEN RETURNED AND BOTTOM MOST PAGE PE AA JAYEGA IN THAT CASE ERROR WON'T BE RAISED INSTEAD AN EMPTY ARRAY WOULD BE SENT
    // EMPTY ARRAY BHEJRA HAI BACKEND ISKA MATLAB KHATAM POSTS
    const {page = 0, limit = 20, cateogry = "All"} = req.query;
    let posts;
    let err = false;
    try {
        // Top limit posts would be returned sorted according to their title
        if (cateogry == "All"){
            posts = await PostModel.aggregate([{$sort : {PostTitle : 1}}, {$skip : page*limit}, {$limit : parseInt(limit)}]);
        }
        else {
            posts = await PostModel.aggregate([{$match : {Cateogry : cateogry}},{$sort : {PostTitle : 1}}, {$skip : page*limit}, {$limit : parseInt(limit)}]);
        }
    }
    catch(error){
        err = true;
        res.json({
            message : "Error Connecting to database."
        })
    }
    if (!err){
        res.json({
            Posts : posts
        })
    }
});

PostRouter.post("/", AuthMiddlware, async (req ,res)=>{
    let validInput = true;
    try {   
        postSchema.parse(req.body);
    }
    catch(err){
        validInput = false;
        res.json({
            message : "Invalid Input, Provide Valid Input!", 
        })
    }
    if (validInput){
        const author = req.UserId.id; // middleware will add this into request
        let title = req.body.title;
        const redirectLink = req.body.redirectLink;
        const cateogry = req.body.cateogry;
        let imdbrating = "";
        let image = "";
        let Genre = [];
        let Actors = [];
        let error = false;
        try {
            let url = "https://www.omdbapi.com/?t=" + title + "&type=" + cateogry + "&apikey=" + OMDBApiKey;
            let movieData;
            // api call to omdb
            try {
                movieData = await axios.get(url);
            }
            catch (error){
                movieData = null;
            }
            if (movieData!=null && movieData.data.Response!='False'){
                title = movieData.data.Title;
                imdbrating = movieData.data.imdbRating;
                image = movieData.data.Poster;
                Genre = movieData.data.Genre.split(',');
                Genre = Genre.map((x)=>{return x.trim()});
                Actors = movieData.data.Actors.split(',');
                Actors = Actors.map((x)=>{return x.trim()});
            }
            const newPost = new PostModel({
                PostTitle : title,
                Author : author, 
                Likes : 0,
                LikedBy : [],
                CommentsCount : 0,
                Comments : [],
                Image : image,
                RedirectLink : redirectLink,
                Cateogry : cateogry,
                IMDBrating : imdbrating,
                Genre : Genre,
                Actors : Actors
            });
            await newPost.save();
            await UserModel.findOneAndUpdate({_id: author}, {$inc : {Aura : 5}});
        }
        catch (err) {
            error = true;
            console.log(err);
            res.json({
                message : "Error Connecting to database!",
            })
        }
        if (!error){
            res.json({
                message : "Post Created!",
            })
        }
    }
});

// TO DO, IDKHOW
PostRouter.post("/like", AuthMiddlware, async (req, res)=>{
    const postId = req.body.postId;
    const author = req.UserId.id;
    const likes = req.body.likes;
    // HOW DO I MAKE SURE USER CAN LIKE A POST ONCE ONLY!!??? 
    PostModel.findByIdAndUpdate({_id : postId}, {Likes : likes+1, $push : {LikedBy : author}});
})

PostRouter.post("/comment", AuthMiddlware , async (req, res)=>{
    // when sending posts to front end also send objectId because that objectId is to be returned when editing deleting or commenting on a post
    // request expects:
    // postId, postAuthorId, comment 
    const postId = req.body.postId;
    const postAuthorId = req.body.postAuthor; 
    const comment = req.body.comment;
    const author = req.UserId.id;
    let commentObj = {
        AuthorOfComment : author,
        Comment :  comment
    }
    let err = false;
    try {
        await PostModel.findByIdAndUpdate({_id : postId}, { $push : {Comments : commentObj}, $inc : {CommentsCount : 1} });
        if (postAuthorId!=author){
            // making sure ki aura apni hi post pe comment karne se nahi badhe!
            await UserModel.findByIdAndUpdate({_id : postAuthorId}, {$inc : {Aura : 10}});
        }
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

module.exports = {
    PostRouter,
}