var express = require("express");
var app = express();
var request = require("request");
const movieTrailer = require('movie-trailer');

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("search");
});

app.get("/results", function(req, res) {
  var query = req.query.search;
  console.log(query);
  var url = "http://www.omdbapi.com/?apikey=thewdb&type=movie&s=" + query;

  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      res.render("results", {data: data});
    }
  });
});

app.get("/movie", function(req, res) {
  var query = req.query.title;
  console.log(query);
  var url = "http://www.omdbapi.com/?apikey=thewdb&type=movie&plot=full&t=" + query;

  request(url, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);

      movieTrailer(data["Title"], (err, url) => {
        // console.log(url); //=> http://path/to/trailer e.g. https://www.youtube.com/watch?v=PbdM1db3JbY
        var watchID = url.slice(url.indexOf("=")+1);
        // console.log(watchID);  // PbdM1db3JbY
        var trailerLink = url;
        res.render("movie", {data: data, trailerLink: trailerLink, watchID: watchID});
      });

      // res.render("movie", {data: data});
    }
  });
});

app.get("*", function(req, res) {
  res.send("Page not found");
});

app.listen(3000, function() {
  console.log("Serving movie-search-app on port 3000");
})
