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

    // T.get('lists/ownerships', {screen_name: "cg3ntry"}, function(err, data, response){
    //   console.log(data.lists[0]);
    //   console.log('\n\n\n');
    //   console.log('=============================');

    //   T.get('lists/members', {list_id: data.lists[0].id}, function(err, data, response){
    //     console.log(data);
    //   });

    // });
    
    //list id is for cg3ntry/northwestern

    T.get('lists/members', {list_id: 172176744}, function(err, data, response){
      
      //CALL HELPER FUNCTION
      var users = "";
      for(var i = 0; i < data.users.length; i++){
        users = users + data.users[i].screen_name + ",  ";
      }

      res.locals = {header: "List: C3Gentry/Northwestern", user_data: JSON.stringify(data), user_list: users };
      res.render('index', {
        title: 'Home',
        partials: {}
      });
    });
  });
} 
