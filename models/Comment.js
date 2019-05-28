
let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let CommentSchema = new Schema({

  body: String
});

let Comment = mongoose.model("Comment", CommentSchema); 

module.exports = Comment;

