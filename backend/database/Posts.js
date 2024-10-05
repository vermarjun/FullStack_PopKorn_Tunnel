const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const ObjectId = Schema.ObjectId;

const PostSchema = new Schema({
    PostTitle : String,
    Author : String,
    Likes : Number,
    LikedBy : [ObjectId],
    CommentsCount : Number,
    Comments : [{
        AuthorOfComment : {type : ObjectId},
        Comment :  {type : String},
    }],
    RedirectLink : String,
    Cateogry : String,
    IMDBrating : String,
    Image : String,
    Genre : [String],
    Actors : [String],
})

const PostModel = mongoose.model('posts', PostSchema);

module.exports = {
    PostModel,
}