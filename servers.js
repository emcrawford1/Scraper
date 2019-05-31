const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

//Libraries specific for scraping
const axios = require("axios");
const cheerio = require("cheerio");

//Importing mongodb models
const db = require("./models");

const PORT = 3000;

//Express
const app = express();

//Using Logger ("morgan" library)
app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//Handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

//Express will serve static files from the "public" folder
app.use(express.static("public"));


mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true});

app.get("/", function(req, res){
  res.render("dashboard");
});

//Scraping news site for articles with our friend "axios"
app.get("/scrape", function(req, res) {
  console.log("scraping");
  let searchSite = "https://www.foxnews.com/";
  axios.get(searchSite).then(function(response) {
    console.log(response.data);
    //Array to hold all of the stories.  This will be displayed in the "Scraped" handlebars page
    let scrapedStories = [];

    //The "virtual DOM" is loaded into our British counterpart "cheerio", who takes it from there
    const $ = cheerio.load(response.data);
    $("article h2").each(function(i, element) {
      console.log("Inside cheerio");
      //Object to hold scraped elements (title & URL
      let result = {};

      result.title = $(this).children("a").text();
      result.url = $(this).children("a").attr("href");
      console.log(result);

      //The "current" result object is pushed into the scrapedStories array so that it can be displayed in handlebars
      scrapedStories.push(result);

      //Saving stories in mongodb
      // db.Article.create(result).then(function(dbArticle) {
      //   console.log(dbArticle);
      // })
      // .catch(function(err) {
      //   console.log(err);
      // });
    });

    //Render "Scraped" handlebars page.  
    res.render("scraped", {article: scrapedStories});
  });
});


//Saving article to mongodb
app.post("/save", function(req, res){
  console.log(req.body);
  
  const articleData = {};

  articleData.title = req.body.title;
  articleData.url = req.body.url;

  db.Article.create(articleData).then(function(dbArticle) {
  
    console.log(dbArticle);
    res.json(dbArticle);
  })
  .catch(function(err){
    console.log(err);
  });
});

//Get saved articles
app.get("/articles", function(req, res) { 

  db.Article.find({})
  .then(function(dbArticle){
    console.log(dbArticle);
    res.render("saved", {article: dbArticle});
  })
  .catch(function(err) { 
    res.json(err);
  });
});



// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });


//Start server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
