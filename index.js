const fs = require('fs');
const keys = require('./keys.js');
const request = require('request');
const twitter = require('twitter');
const Spotify = require('node-spotify-api');
const open = require('opn');

var twitterParams = {screen_name: 'wishlistprogram'};
var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

var spotify = new Spotify({
  id: keys.spotifyKeys.id,
  secret: keys.spotifyKeys.secret
});

var command = process.argv[2];

function getTweets() {
  client.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
    if(!error){
      for (var tweet in tweets) {
        let user = tweets[tweet].user.name;
        let tweetText = tweets[tweet].text;
        let dateArr = tweets[tweet]['created_at'].split(' ');
        let date = dateArr[1] + " " + dateArr[2] + " " + dateArr[5];
        console.log("On " + date + " " + user + " said, '" + tweetText + "'");
      }
      // console.log(tweets);
    }
  });
}

function spotifySearch(song) {
  spotify.search({type: 'track', query: song, limit: 1}, function(err, data) {
    if(err){
      return console.log('Error: '+ err);
    }
    else if (data.tracks.items.length === 0) {
      return playAceOfBase();
    }
    for (var i in data.tracks.items) {
      getSpotifyInfo(data.tracks.items[i]);
    }
  });
}

function playAceOfBase() {
  //create new instance to spotify api so it can produce second search
  var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret
  });
  spotify.search({type: 'track', query: 'The Sign', limit: 20}, function(err, data) {
    if(err){
      return console.log('Error: '+ err);
    }
    for (var i in data.tracks.items) {
      if (data.tracks.items[i].artists[0]["name"] == 'Ace of Base') {
        //use return to ensure it plays just first instance of correct song
        return getSpotifyInfo(data.tracks.items[i]);
      } else {
        continue;
      }
    }
  });
}

function getSearchTerm(start, joiner) {
  let searchTerm = process.argv.slice(start, process.argv.length);
  searchTerm = searchTerm.join(joiner);
  return searchTerm
}

function getSpotifyInfo(object) {
  let url = object.preview_url;
  let songLink = 'https://open.spotify.com/track/'+object.id;
  console.log('artist: ' + object.artists[0]["name"]+'\ntrack: ' + object.name+'\nalbum: ' + object.album.name);
  if (url != null) {
    console.log('preview: ' + url);
    open(songLink);
  }
  console.log("\n");
  return
}

function getMovies(movieName) {
  var url = 'http://www.omdbapi.com/?t='+movieName+"&plot=full"+keys.omdbKeys.key
  request(url,callBack);
}

function callBack(error, response, data) {
  if(!error){
    var dataParsed = JSON.parse(data);
    if(dataParsed.Title != undefined){
      console.log(dataParsed.Title+" came out in "+dataParsed.Year+".");
      console.log("\nPlot: " + dataParsed.Plot);
      console.log("\nProduced in: " + dataParsed.Country + "\nLanguage(s): "+dataParsed.Language+"\n");
      if (dataParsed.Ratings.length > 0) {
        for (var i in dataParsed.Ratings) {
          if (dataParsed.Ratings[i].hasOwnProperty("Source")) {
            console.log(dataParsed.Ratings[i].Source + ": " + dataParsed.Ratings[i].Value);
          }
        }
      }
    }
    else {
      console.log("Unable to find movie");
    }
    return
  }
  console.log(error);
}

switch (command) {
  case "my-tweets":
    getTweets();
    break;
  case "spotify-this-song":
     let songToSearch = getSearchTerm(3, "+");
     spotifySearch(songToSearch);
     break;
  case "movie-this":
    let movieTitle = getSearchTerm(3, "+");
    getMovies(movieTitle);
    break;
  default:
  console.log('That is not a command I know.');
}
