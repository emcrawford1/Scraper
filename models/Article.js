let mongoose = require("mongoose");

let Schema = mongoose.Schema;

let ArticleSchema = new Shema({

  title: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  url: {
    type: String,
    required: true
  },

  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }

});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;





