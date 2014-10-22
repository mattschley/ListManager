var Twit = require ('twit');
var Metrics = require('./metrics');

  var T = new Twit({
      consumer_key:         'rVbhHqZ2ohpqfG1LfIFGUYqPj', 
      consumer_secret:      'jsA6co3nRkFMSfJbUcFIP2JnxZflOXnJB3EiokJrqqst7Kazq9', 
      access_token:         '180828652-NGg0NjgZLw0i3u7qS7OUlDREewv1D8dDcjyqOCEg', 
      access_token_secret:  'AaMVy2p1ebA8NPgFOnLJWRKSri0tmJvZuBfJxqZN1B1qq'
  });

module.exports = function(app) {

  app.use(function(req, res, next){
    console.log('%s %s', req.method, req.url);
    next();
  });

  app.get('/', function(req, res){

    //list id for cg3ntry/northwestern: 172176744

    T.get('lists/members', {list_id: 172176744}, function(err, data, response){
      
      metricsData = new Metrics(data);
      

      res.locals = {};
      res.render('index', {
        title: 'Home',
        partials: {}
      });
    });
  });
} 
