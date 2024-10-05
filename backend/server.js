const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Secret_key = "password";

const app = express();

// Models
const { UserModel }  = require("./database/User");
const { PostModel }  = require("./database/Posts");
const { RequestModel }  = require("./database/Request");

// Routes Import
const { ContributeRouter } = require("./routes/contribute.js");
const { PostRouter } = require("./routes/posts.js");
const { RequestRouter } = require("./routes/requests.js");
const { AuthenticationRouter } = require("./routes/auth.js");
const { AuthMiddlware } = require("./routes/middlewares.js");

// Connect to database
async function ConnectDb(){
    try {
        await mongoose.connect("");
    }
    catch(error) {
        console.log("Error Connecting To Database!!");
    }
}
ConnectDb();

app.use(express.json());
app.use("/auth", AuthenticationRouter);
app.use("/contribute", ContributeRouter);
app.use("/post", PostRouter);
app.use("/request", RequestRouter);

app.get("/", AuthMiddlware , (req, res)=>{
    // home.html serve kar dene ka is case me!
    res.json({
        message : "home.html",
    })
})

app.get("/carousel", AuthMiddlware, async (req, res)=>{
    let err = false;
    let posts = null;
    try {
        posts = await PostModel.aggregate([{$sort : {Likes : -1}}]);
    }
    catch (error){
        err = true;
        res.json({
            message : "Error Fetching data from data base"
        })
    }
    if (!err){
        const carousel = [];
        let k = 10;
        if (posts!=null && posts.length<10) {
            k = posts.length;
        }
        for (let i = 0; i < k; i++){
            carousel.push(posts[i]);
        }
        res.json({
            message : carousel
        })
    }
})

app.get("/leaderBoard", AuthMiddlware, async (req, res)=>{
    let err = false;
    let users = null;
    try {
        users = await UserModel.aggregate([{$sort : {Aura : -1}}]);
    }
    catch (error){
        err = true;
        res.json({
            message : "Error Fetching data from data base"
        })
    }
    if (!err){
        const leaderBoard = [];
        let k = 10;
        if (users.length<10) {
            k = users.length;
        }
        for (let i = 0; i < k; i++){
            const user = {
                userId : users[i]._id,
                username : users[i].Username,
                aura : users[i].Aura,
                pfp : users[i].pfp
            }
            leaderBoard.push(user);
        }
        res.json({
            message:leaderBoard
        })
    }
})

app.get("/myposts", AuthMiddlware, async (req, res)=>{
    const user = req.UserId.id;
    let myposts;
    let err = false;
    try {
        myposts = await PostModel.aggregate([{ $match : {Author : user}}]);
    }
    catch(error){
        err = true;
        res.json({
            message : "Error Connecting to database"
        })
    }
    if (!err){
        res.json({
            Posts : myposts
        })
    }
})
// app.get("/movies", AuthMiddlware, async (req, res)=>{
//     let movies;
//     let err = false;
//     try {
//         movies = await PostModel.aggregate([{ $match : {Cateogry : "movie"}}]);
//     }
//     catch(error){
//         err = true;
//         res.json({
//             message : "Error Connecting to database"
//         })
//     }
//     if (!err){
//         res.json({
//             Movies : movies
//         })
//     }
// })
// app.get("/series", AuthMiddlware, async (req, res)=>{
//     let movies;
//     let err = false;
//     try {
//         movies = await PostModel.aggregate([{ $match : {Cateogry : "series"}}]);
//     }
//     catch(error){
//         err = true;
//         res.json({
//             message : "Error Connecting to database"
//         })
//     }
//     if (!err){
//         res.json({
//             Movies : movies
//         })
//     }
// })
app.listen(3000, ()=>{
    console.log("Server is Up Guess What Else is?");
})