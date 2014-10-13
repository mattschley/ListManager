var express = require('express');
var path = require('path');
var util = require('util');
var Twit = require ('twit');
var bodyParser = require('body-parser');
var morgan = require('morgan');

var app = express();
var port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'));

app.set('view engine', 'html');
app.enable('view cache');
app.engine('html', require('hogan-express'));

var T = new Twit({
    consumer_key:         'rVbhHqZ2ohpqfG1LfIFGUYqPj', 
    consumer_secret:      'jsA6co3nRkFMSfJbUcFIP2JnxZflOXnJB3EiokJrqqst7Kazq9', 
    access_token:         '180828652-NGg0NjgZLw0i3u7qS7OUlDREewv1D8dDcjyqOCEg', 
    access_token_secret:  'AaMVy2p1ebA8NPgFOnLJWRKSri0tmJvZuBfJxqZN1B1qq'
});



app.get('/', function(req, res){

  T.get('lists/ownerships', {screen_name: "aginganinja"}, function(err, data, response){
    console.log(err);
    console.log(data);
  });

  res.render('index', {
    title: 'Home'
  });
});

app.get('/user/:user_name', function(req, res){
  //var user = req.params.user_name;
  T.get('lists/ownerships', {screen_name: "aginganinja"}, function(err, data, response){
    res.render('list', {
      title: 'My Lists',
      partials: {user_data: data, title: 'My Lists'}
  });
  });
});

app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app;

