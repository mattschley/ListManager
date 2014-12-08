      function getSortingVal(sortVal){
        if(sortVal == "Dictionary Hits"){
          return 'dicthits';
        }
        if(sortVal == "Frequency"){
          return 'freq';
        }
        if(sortVal == "FF Ratio"){
          return 'ffratio';
        }
      }

      $(".sort-up-button").click(function() {
        var sortVal = $("#sorting-dropdown option:selected").text();
        sortVal = getSortingVal(sortVal);

        var $userList = $(".user-list > li");

        $userList.sort(function (a, b){
          return ($(b).data(sortVal)) > ($(a).data(sortVal)) ? 1 : -1;    
        });

       $userList.detach().appendTo($(".user-list"));
      });

      $(".sort-down-button").click(function() {
        var sortVal = $("#sorting-dropdown option:selected").text();
        sortVal = getSortingVal(sortVal);

        var $userList = $(".user-list > li");

        $userList.sort(function (a, b){
          return ($(b).data(sortVal)) <= ($(a).data(sortVal)) ? 1 : -1;    
        });

       $userList.detach().appendTo($(".user-list"));
      });


      $("input[name='verified']").click(function(){
        var userArray = $('.user-list > li');
        userArray.each(function(){
          if($(this).attr('data-verified') == "true") {
            if($("input[name='verified']").is(':checked')){
               $(this).show();
            }
            else{
               $(this).hide();
            }
          }

        })
      });

      $("input[name='notverified']").click(function(){
        var userArray = $('.user-list > li');
        userArray.each(function(){
          if($(this).attr('data-verified') == "false") {
            if($("input[name='notverified']").is(':checked')) {
               $(this).show();
            }
            else {
               $(this).hide();
            }
          }

        })
      });

      $(".add-keywords-btn").click(function(){
        var keywords = $("input[name='keywords']").val().split(',');
        var tweetArray= $(".timeline > li");
        var userArray = $(".user-list > li");

        userArray.each(function(){
          $(this).attr('data-dicthits', 0);
        });

        var totalCount = 0;

        tweetArray.each(function(){
          var count = 0;
          var tweetText = $(this).find("p").html().toLowerCase();
          for (var i=0; i < keywords.length; i++){
            if(tweetText.indexOf(keywords[i].toLowerCase()) >= 0){
              count++;
            }
          }
          var user = $(this).find("a").html();
          if (count > 0){
            userArray.each(function(){
              var u = $(this).find("a").html();
              if (u == user){
                $(this).attr('data-dicthits', Number($(this).attr('data-dicthits')) + count);
                $(this).find('.dict-hits').html("Dictionary Hits: "+ $(this).attr('data-dicthits'));
                return false;
              }
            });
          }
          totalCount += count;
        });

        var $userList = $(".user-list > li");

        $userList.sort(function (a, b){
          return ($(b).data('dicthits')) > ($(a).data('dicthits')) ? 1 : -1;    
        });

       $userList.detach().appendTo($(".user-list"));

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
