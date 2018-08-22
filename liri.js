//read and set any environment variables with the dotenv package:
require("dotenv").config();

var request = require("request");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var chalk = require("chalk");
var moment = require("moment");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);


var action = process.argv[2];
var term = process.argv.splice(3).join(" ");

switch (action) {
    case "concert-this":
        concert(term);
        break;
    case "spotify-this-song":
        spotifySong(term);
        break;
    case "movie-this":
        movie(term);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}

function concert(term) {

    if (!term) {
        term = "bush";
    }

    var queryUrl = "https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp";
    request(queryUrl, function (err, response, body) {
        if (!err && response.statusCode === 200) {

            var jsonData = JSON.parse(body);
            console.log(JSON.parse(body, null, 2));

            var logConcert =
                chalk.bold.red("\nName of the venue: ") + jsonData[0].venue.name +
                chalk.bold.red("\nVenue location: ") + jsonData[0].venue.country + " " + jsonData[0].venue.city +
                chalk.bold.red("\nDate of the Event (use moment to format this as MM/DD/YYYY: ") + moment(jsonData[0].datetime).format('MM/DD/YYYY');;
        }
        console.log(chalk.bold.yellow("\n----------------------------- concert-this -----------------------------"));
        console.log(logConcert);
        console.log(chalk.bold.yellow("\n-----------------------------------------------------------------------\n"));
    });

}

function spotifySong(term) {

    if (!term) {
        term = "The Sign Ace Of Base";
    }

    spotify
        .search({ type: 'track', query: term })
        .then(function (response) {

            var jsonData = response.tracks.items[0];
            //console.log(jsonData);
            var logSpotify =
                chalk.bold.yellow("\nArtist(s): ") + jsonData.album.artists[0].name +
                chalk.bold.yellow("\nThe song's name: ") + jsonData.name +
                chalk.bold.yellow("\nA preview link of the song from Spotify: ") + jsonData.preview_url +
                chalk.bold.yellow("\nThe album that the song is from: ") + jsonData.album.name;
            console.log("\n----------------------- movie-this command -----------------------------");
            console.log(logSpotify);
            console.log("\n-----------------------------------------------------------------------\n");
        })
        .catch(function (err) {
            console.log(err);
        });
}

function movie(term) {

    if (!term) {
        term = "Mr. Nobody";
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + term + "&y=&plot=short&apikey=trilogy";
    // We then run the request module on a URL with a JSON
    request(queryUrl, function (err, response, body) {

        // If there were no errors and the response code was 200 (i.e. the request was successful)...
        if (!err && response.statusCode === 200) {

            var jsonData = JSON.parse(body);
            // console.log(jsonData);
            var logMovie =
                chalk.bold.red("\nTitle of the movie: ") + jsonData.Title +
                chalk.bold.blue("\nYear the movie came out: ") + jsonData.Year +
                chalk.bold.yellow("\nIMDB Rating of the movie: ") + jsonData.Rated +
                chalk.bold.cyan("\nRotten Tomatoes Rating of the movie: ") + jsonData.Rated +
                chalk.bold.white("\nCountry where the movie was produced: ") + jsonData.Country +
                chalk.bold.red("\nLanguage of the movie: ") + jsonData.Language +
                chalk.bold.cyan("\nPlot of the movie: ") + jsonData.Plot +
                chalk.bold.white("\nActors in the movie: ") + jsonData.Actors;
        }
        console.log("\n----------------------- movie-this command -----------------------------");
        console.log(logMovie);
        console.log("\n-----------------------------------------------------------------------\n");


    });

}

function doWhatItSays() {

    fs.readFile(
        "random.txt",
        "utf8",
        function (err, data) {
            if (err) {
                return console.log(err);
            }
            var result = data.split(",");
            if (result[0] == "spotify-this-song") {
                spotifySong(result[1]);
            }
            if (result[0] == "concert-this") {
                concert(result[1]);
            }
            if (result[0] == "movie-this") {
                movie(result[1]);
            }
        });
}










