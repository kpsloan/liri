require("dotenv").config();

var keys = require("./keys");
var fs = require("fs");
var request = require('request');
var Spotify = require('node-spotify-api');
var tomatoesRating;
var internetRating;
var input = process.argv;
var action = input[2];
var inputs = input[3];
var moment = require('moment');

switch (action) {
    case "concert-this":
        concert(inputs);
        break;

    case "spotify-this-song":
        song(inputs);
        break;

    case "movie-this":
        movie(inputs);
        break;

    case "do-what-it-says":
        doIt();
        break;
};

function concert(inputs) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + inputs + "/events?app_id=codingbootcamp";


    if (!inputs) {
        inputs = 'Michael Jackson';
    }

    request.get(queryUrl, function (error, response) {
        if (!error && response.statusCode === 200) {
            var res = JSON.parse(response.body)[0];
            var concertThis =
                "--------------------------------------------------------------" + "\n\n" + "\n\n" +
                "Name of Venue: " + res.venue.name + "\n\n" +
                "Venue location: " + res.venue.city + " " + res.venue.region + "\n\n" +
                "Date of the Event: " + moment(res.datetime).format("MM DD YYYY") + "\n\n" + "\n\n" + "------------------------------------------------------------------"
            console.log(concertThis);
            writeToLog(concertThis);
        }

    })

}

function song(inputs) {

    console.log(keys.spotify)
    var spotify = new Spotify(keys.spotify);
    if (!inputs) {
        inputs = 'I Want it That Way';
    }
    spotify.search({ type: 'track', query: inputs }, function (err, data) {
        if (err) {
            console.log('Error occurred: ' + err);
            return;
        }

        var songInfo = data.tracks.items;
        console.log("Artist(s): " + songInfo[0].artists[0].name);
        console.log("Song Name: " + songInfo[0].name);
        console.log("Preview Link: " + songInfo[0].preview_url);
        console.log("Album: " + songInfo[0].album.name);
    });
}

function movie(inputs) {


    var queryUrl = "http://www.omdbapi.com/?t=" + inputs + "&y=&plot=short&apikey=trilogy";



    request.get(queryUrl, function (error, response, body) {
        if (!inputs) {
            inputs = 'Mr Nobody';
        }

        if (!error && response.statusCode === 200) {

            for (i = 0; i < JSON.parse(body).Ratings.length; i++) {
                if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
                    tomatoesRating = JSON.parse(body).Ratings[i].Value;

                }
                if (JSON.parse(body).Ratings[i].Source === "Internet Movie Database") {
                    internetRating = JSON.parse(body).Ratings[i].Value;

                }
            }

            var myMovie =
                "-----------------------------------------------------------------------" + "\n\n" +
                "Movie Title: " + JSON.parse(body).Title + "\n\n" +
                "Year movie released: " + JSON.parse(body).Year + "\n\n" +
                "Movie rating: " + JSON.parse(body).Rated + "\n\n" +
                "Rotten Tomatoes Rating: " + tomatoesRating + "\n\n" +
                "Internet Movie Database Rating: " + internetRating + "\n\n" +
                "Country: " + JSON.parse(body).Country + "\n\n" +
                "Language: " + JSON.parse(body).Language + "\n\n" +
                "Movie Plot: " + JSON.parse(body).Plot + "\n\n" +
                "-----------------------------------------------------------------------" + "\n\n"
            console.log(myMovie);
            writeToLog(myMovie);

        }
    });

}

function doIt() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        var nameArr = data.split(",");


        name = nameArr[1]


        spotify.search({ type: 'track', query: name, limit: 1 }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }

            var track = data.tracks.items[0];
            var randomSong =
                "-----------------------------------------------------------------------" + "\n\n" +
                "Song Title: " + name + "\n\n" +
                "Artist: " + track.artists[0].name + "\n\n" +
                "Album: " + track.album.name + "\n\n" +
                "Preview Link: " + track.preview_url + "\n\n" +
                "-----------------------------------------------------------------------" + "\n\n"
            console.log(randomSong);
            writeToLog(randomSong);
        })

    });
}


function writeToLog(printInfo) {
    fs.appendFile("log.txt", printInfo, function (err) {

        if (err) {
            return console.log(err);
        }

    });

}