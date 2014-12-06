$('.add-button').click(function() {  
        var username = $(this).attr('data-user');
        $.post( "/adduser", 
          {
            list: "{{ listname }}",
            owner: "{{ ownername }}",
            user: username
          },
          function( data ) {
            alert( "User was added to the list" );
        });
      });

      $('.mentions-button').click(function() {  
        var tweetidString = $(this).attr('data-ids');        
        var timelineArray = $(".timeline li");

        if(tweetidString == undefined){
          timelineArray.show();
          return;
        }

        var tweetids = tweetidString.split(',');
        timelineArray.each(function(){
            var id = $(this).find('p').attr('data-id');

            if(id == undefined){
              console.log ("UNDEFINED?");
            }

            var hasMatch = false;

            for (var i = 0; i < tweetids.length; i++){
              if(id == tweetids[i]){
                $(this).show();
                console.log("equal: "+tweetids[i]);
                hasMatch = true;
              }
            }
            if (!hasMatch){
              $(this).hide();
              console.log(tweetids[i] + "!= " + id);
            }
        })

      });

      $('.delete-button').click(function() {  
        var username = $(this).attr('data-user');
        $.post( "/removeuser", 
          {
            list: "{{ listname }}",
            owner: "{{ ownername }}",
            user: username
          },
          function( data ) {
            alert( "User was deleted from the list" );
        });
      });