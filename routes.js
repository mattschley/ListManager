var Twit = require ('twit');

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
    T.get('lists/ownerships', {screen_name: "ninatypewriter"}, function(err, data, response){
      console.log (data);
      console.log ("\n\n\n");  
    });

    res.render('list', {
      title: 'My Lists',
      partials: {user_data: data, title: 'My Lists'}
    });
  });
}