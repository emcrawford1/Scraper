$(document).ready(function(){

  console.log("In app.js!!")
  $("#scrapeBtn").on("click", function(event){
   window.location.href = "/scrape";
  });

  $("#homeBtn").on("click", function(event){
    window.location.href ="/";
  })
});

// $jq.post("/api/comment", newComment, function(data) {
//   console.log("Added " + data);
//   console.log("Just finished Ajax request");
//   location.reload(true);
//   $formData.text("");
// });
// });
