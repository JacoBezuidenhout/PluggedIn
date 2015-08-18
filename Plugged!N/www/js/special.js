app.controller('SpecialCtrl', function($scope, $http) {
  var t = this;
  t.last = Date.now()-(60*6);
  t.doRefresh = function(cb,now) 
  {
    global.title = "Today's Specials";
    if (now || (Date.now()-t.last > (60*5)))
    {
      global.show();
      $http.get("http://whatson.peoplesoft.co.za/special").
        then(function(response) {
          t.specials = response.data;
          t.last = Date.now();
          $scope.$broadcast('scroll.refreshComplete');
          global.hide();
        }, function(response) {
          console.log('Error',response);
        });  
    }
    else
    {
          $scope.$broadcast('scroll.refreshComplete');
    }
  };
  
  t.like = function(item)
  {
    // alert("Like " + id);
    $http.get("http://whatson.peoplesoft.co.za/special/" + item.id + "/likes/add/" + global.me.id).
      then(function(response){
        $scope.$applyAsync(function(){

          $http.get("http://whatson.peoplesoft.co.za/device/" + window.localStorage.deviceId).
            then(function(response) {
              global.me = response.data;
            }, function(response) {
              console.log("Error",response);
            });

          console.log("ITEM",item);
        });
        console.log("Like Successful",response);
      }, function(response){
        console.log("Like Error",response);
      });
  }

  t.dislike = function(item)
  {
    $http.get("http://whatson.peoplesoft.co.za/special/" + item.id + "/likes/remove/" + window.localStorage.deviceId).
      then(function(response){
        $scope.$applyAsync(function(){

          $http.get("http://whatson.peoplesoft.co.za/device/" + window.localStorage.deviceId).
            then(function(response) {
              global.me = response.data;
            }, function(response) {
              console.log("Error",response);
            });
        
        });
        console.log("Like Successful",response);
      }, function(response){
        console.log("Like Error",response);
      });
  }

  t.isLiked = function(e)
  {
    // console.log(global.me);
    if (global.me)
    {
      for (var i = 0; i < global.me.sLikes.length; i++) {
        if (global.me.sLikes[i].id == e.id)
          return false;
      };
    }
    return true;
  }

});