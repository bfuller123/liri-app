const fs = require('fs');
const keys = require('./keys.js');
const request = require('request');
const twitter = require('twitter');

var twitterParams = {screen_name: 'wishlistprogram'};
var client = new twitter({
  consumer_key: keys.twitterKeys.consumer_key,
  consumer_secret: keys.twitterKeys.consumer_secret,
  access_token_key: keys.twitterKeys.access_token_key,
  access_token_secret: keys.twitterKeys.access_token_secret
});

client.get('statuses/user_timeline', twitterParams, function(error, tweets, response) {
  if(!error){
    console.log(tweets);
  }
});