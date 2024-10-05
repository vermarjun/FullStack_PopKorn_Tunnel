const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const ObjectId = Schema.ObjectId;

const UserSchema = new Schema ({
    Username : String,
    Email : {type : String, unique : true},
    Password : {
        pass : String, 
        salt :  String
    },
    Aura : Number,
    pfp : String,
})

const UserModel = mongoose.model('users', UserSchema);

module.exports = {
    UserModel
}