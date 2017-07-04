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
      console.log(tweets);
    }
  });
}

function spotifySearch(song) {
  spotify.search({type: 'track', query: song, limit: 1}, function(err, data) {
    if(err){
      return console.log('Error: '+ err);
    }
    for (var i in data.tracks.items) {
      getSpotifyInfo(data.tracks.items[i]);
    }
  })
}

function getSearchTerm() {
  let searchTerm = process.argv.slice(3, process.argv.length);
  searchTerm = searchTerm.join("+");
  return searchTerm
}

function getSpotifyInfo(object) {
  let url = object.preview_url;
  console.log('artist: ' + object.artists[0]["name"]);
  console.log('track: ' + object.name);
  console.log('album: ' + object.album.name);
  console.log('preview: ' + url);
  open(url);
  console.log("\n");
  return
}

switch (command) {
  case "my-tweets":
    getTweets();
    break;
   case "spotify-this-song":
     let songToSearch = getSearchTerm();
     spotifySearch(songToSearch);
     break;
  default:
  console.log('That is not a command I know.');
}
