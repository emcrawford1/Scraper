$(document).ready(function(){

  console.log("In app.js!!")
  $("#scrapeBtn").on("click", function(event){
   window.location.href = "/scrape";
  });

  $("#homeBtn").on("click", function(event){
    window.location.href ="/";
  });

  $(".saveBtn").on("click", function(event){
    let $saveBtn = $(this);
    let savedArticle = {};

    savedArticle.title = $saveBtn.attr("data-title");
    savedArticle.url = $saveBtn.attr("data-url");

    $.post("/save", savedArticle, function(data){
      console.log("Added " + data);
      $saveBtn.prop('disabled', true);
    });
  });

  $("#savedStoriesBtn").on("click", function(event){
    window.location.href = "/articles";
  });

  $(".deleteBtn").on("click", function(event) {

  })
});

