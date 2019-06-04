$(document).ready(function(){

 //Event handler attached to button click for scraping and displaying the stories
  $("#scrapeBtn").on("click", function(event){
   window.location.href = "/scrape";
  });

  //Event handler attached to button click for navigating to the home page
  $("#homeBtn").on("click", function(event){
    window.location.href ="/";
  });


//Event handler attached to button click for saving stories to the database
  $(".saveBtn").on("click", function(event){
    event.preventDefault();
    let $saveBtn = $(this);
    let savedArticle = {};

    savedArticle.title = $saveBtn.attr("data-title");
    savedArticle.url = $saveBtn.attr("data-url");

    $.post("/save", savedArticle, function(data){
      console.log("Added " + data);
      $saveBtn.prop('disabled', true);
    });
  });


//Event handler for clicking the Saved Stories button (displays stories that have been saved)
  $("#savedStoriesBtn").on("click", function(event){
    window.location.href = "/articles";
  });


//Event handler attached to button click for deleting stories from the database
  $(".deleteBtn").on("click", function(event) {

    event.preventDefault();
    let $deleteBtn = $(this);
    const id = $deleteBtn.attr("data-id");

    $.ajax({
      method: "DELETE",
      url: "/api/stories/" + id,
      success: res => window.location.href = "/articles"
    })
    .catch( err => console.log(err));
    
    });
   
    $(".close").on("click", function(event){
      event.preventDefault();
      let $closeBtn = $(this);
      const commentId = $closeBtn.attr("data-id");
      console.log(commentId);
      const storyId = $("#specificStory").data("id");

      $.ajax({
        method: "DELETE",
        url: "/api/comments/delete/" + commentId + "/" + storyId,
        success: res => window.location.href = "/stories/" + storyId
      });
    })

    $("#commentForm").submit(function(event) {
        event.preventDefault();

        const comment = {}
        comment.body = $("#commentBox").val();
        comment.storyId = $("#specificStory").data("id")
        console.log(comment);

        $.post("/comment", comment, function(data){

          console.log("Saved comment: " + data);
          $("#commentBox").val("");
          window.location.href = "/stories/" + comment.storyId;
          
        });
    });

  });


