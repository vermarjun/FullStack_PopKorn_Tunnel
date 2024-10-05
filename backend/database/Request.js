const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const ObjectId  = Schema.ObjectId;

const RequestSchema = new Schema({
    Request : String,
    Author : ObjectId,
    UpVotes : Number,
    LikedBy : [ObjectId],
    CommentsCount : Number,
    Comments : [{
        AuthorOfComment : {type : ObjectId},
        Comment :  {type : String},
    }],
    Resolved : Boolean,
})

const RequestModel = mongoose.model('Requests', RequestSchema);

module.exports = {
    RequestModel
};