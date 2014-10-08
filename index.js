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
    consumer_key:         '...'
  , consumer_secret:      '...'
  , access_token:         '...'
  , access_token_secret:  '...'
});

app.get('/', function(req, res){



  res.render('index', {
    title: 'Home'
  });
});

app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app;