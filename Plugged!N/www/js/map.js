var global;

app.controller('MapCtrl', function($scope, $http) {
  var t = this;
  
  t.doRefresh = function() 
  {
    // alert('Refreshed Likes!');
    $scope.$broadcast('scroll.refreshComplete');
    t = {
        defaults: {
          tileLayer: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
          maxZoom: 18,
          zoomControlPosition: 'bottomleft'
        },
        markers : {},
        events: {
          map: {
            enable: ['context'],
            logic: 'emit'
          }
        }
      };    
  };

  t.unSetMap = function()
  {
    t = {};
  }

});