const {z} = require("zod");

const userSchemaSignUp = z.object({
    username : z.string().min(2).max(20),
    password : z.string().min(8).max(20),
    email : z.string().email(),
    pfp : z.string(),
});

const userSchemaSignIn = z.object({
    password : z.string().min(8).max(20),
    email : z.string().email(),
});

const postSchema = z.object({
    title : z.string().min(2).max(30),
    redirectLink : z.string(),
    cateogry : z.string()
});

const requestSchema = z.object({
    request : z.string().min(1).max(30)
});

const commentSchema = z.object({
    comment : z.string().min(1).max(30)
});

module.exports = {
    userSchemaSignUp,
    userSchemaSignIn,
    postSchema,
    requestSchema,
}