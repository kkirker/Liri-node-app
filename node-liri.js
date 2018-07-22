//load in dependencies
require("dotenv").config();
let Twitter = require('twitter');
let Spotify = require('node-spotify-api');
let request = require("request");
let fs = require('fs');
let keys = require('./keys');

//declaring variables
let spotify = new Spotify(keys.spotify);
let client = new Twitter(keys.twitter);
let textInput = '';
let input = process.argv.slice(2).join('-');
console.log(input);

//functions that decides which function to run based on console input
function run() {

//runs for tweets
if (input === 'my-tweets') {
    getTweets();
};

//runs for spotify
if (input.includes('spotify')) {
    let inputBreak = input.split('-');
    songTitle = inputBreak.slice(3).join(' ');
    if (songTitle === null) {
        songTitle = `The Sign`;
    };
    console.log(songTitle);
    getSong();
};

//runs for omdb
if (input.includes('movie')) {
    let inputBreak = input.split('-');
    movieTitle = inputBreak.slice(2).join(' ');
    if (movieTitle === null) {
        movieTitle = `Mr. Nobody`;
    };
    console.log(movieTitle);
    getMovie();
};

//reads random.txt
if (input === 'do-what-it-says') {
    doDo();
}
};



//function to console latest tweets
function getTweets() {
    client.get('statuses/user_timeline', {screen_name: 'Thia_May'}, function(error, tweets, response) {
        if(error) console.log(error);
        
        tweets.forEach(tweet => {
            console.log(`
            ${tweet.text}
            ${tweet.created_at}
            
            `)
        });
    });
};

//function to get spotify object from songTitle
function getSong(songTitle) {
    spotify.search({ type: 'track', query: `${songTitle}` }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
        // console.log(JSON.stringify(data, null, " "));
        console.log(`
        Artist(s): ${data.tracks.items[0].artists[0].name}
        Song Title: ${data.tracks.items[0].name}
        Song Preview: ${data.tracks.items[0].preview_url}
        Album: ${data.tracks.items[0].album.name}
        `); 
      });
      
};

//function to get omdb results from movieTitle
function getMovie(movieTitle) {
    request(`http://www.omdbapi.com/?t=${movieTitle}&y=&plot=short&apikey=trilogy&tomatoes=true`, function(error, response, body) {
        if (error) {
            return console.log('Error occurred: ' + error);
          } else {
        console.log(`
            Movie: ${JSON.parse(body).Title}
            Released: ${JSON.parse(body).Year}
            IMDB Rating: ${JSON.parse(body).imdbRating}
            Rotten Tomatoes Rating: ${JSON.parse(body).tomatoRating}
            Country: ${JSON.parse(body).Country}
            Language: ${JSON.parse(body).Language}
            Plot: ${JSON.parse(body).Plot}
            Actors: ${JSON.parse(body).Actors}
        `);
        };
    });
};

//function to read random.txt, and then decide what function to do based on what is read.
function doDo() {
    fs.readFile('./random.txt', 'utf8', function(err, data) {
        if(err) console.log(err);

       let result = data;
       let textInput =result.replace('-', ' ').replace('-', ' ').replace(',', '').replace('"',' ').replace('"',' ');
        console.log(textInput);
        
        if (textInput === 'my-tweets') {
            getTweets();
        };
        
        if (textInput.includes('spotify')) {
            let textInputBreak = textInput.split('-');
            songTitle = textInputBreak.slice(3).join(' ');
            if (songTitle === null) {
                songTitle = `The Sign`;
            };
            console.log(songTitle);
            getSong();
        };
        
        if (textInput.includes('movie')) {
            let textInputBreak = textInput.split('-');
            movieTitle = textInputBreak.slice(2).join(' ');
            if (movieTitle === null) {
                movieTitle = `Mr. Nobody`;
            };
            console.log(movieTitle);
            getMovie();
        }; 
      });
};

//initialize run function 
run();