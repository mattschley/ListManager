var express = require('express');
var path = require('path');
var util = require('util');
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


require('./routes')(app);

app.listen(port);
console.log('Magic happens on port ' + port);
exports = module.exports = app;

