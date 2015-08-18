var global;

var app = angular.module('pluggedIN', ['ionic', 'ngCordova', 'leaflet-directive', 'ionicLazyLoad'])
.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('DeviceCtrl', function($scope, $http, $ionicLoading, $cordovaDevice, $ionicPlatform, $ionicModal, $cordovaSocialSharing) {
  var t = this;
  global = t;

/////////////////////////////////-EVENT MODAL-/////////////////////////////////

  $ionicModal.fromTemplateUrl('event-modal.html', {
    scope: $scope,
    animation: 'slide-in-left'
  }).then(function(eventModal) {
    t.eventModal = eventModal;
  })  

  t.openEventModal = function(e,liked,like,dislike) {
    $scope.$applyAsync(function(){
      t.e = e;
      t.e.likeCount = e.likes.length;
      t.e.liked = !liked;
      
      t.e.like = function(event){
        like(event);
        t.e.liked = true;
        t.e.likeCount += 1;
      };
      
      t.e.dislike = function(event){
        dislike(event);
        t.e.liked = false;
        t.e.likeCount -= 1;
      };

      t.eventModal.show();
    });
  }

  t.closeEventModal = function() {
    t.eventModal.hide();
  };


/////////////////////////////////-SPECIAL MODAL-/////////////////////////////////

  $ionicModal.fromTemplateUrl('special-modal.html', {
    scope: $scope,
    animation: 'slide-in-left'
  }).then(function(specialModal) {
    t.specialModal = specialModal;
  })  

  t.openSpecialModal = function(s,liked,like,dislike) {
    $scope.$applyAsync(function(){
      t.s = s;
      t.s.likeCount = s.likes.length;
      t.s.liked = !liked;
      
      t.s.like = function(special){
        like(special);
        t.s.liked = true;
        t.s.likeCount += 1;
      };
      
      t.s.dislike = function(special){
        dislike(special);
        t.s.liked = false;
        t.s.likeCount -= 1;
      };

      t.specialModal.show();
    });
  }

  t.closeSpecialModal = function() {
    t.specialModal.hide();
  };

/////////////////////////////////-MODAL ALL-/////////////////////////////////
  $scope.$on('$destroy', function() {
    t.eventModal.remove();
    t.specialModal.remove();
  });

/////////////////////////////////-SHARE-/////////////////////////////////

  t.shareEvent = function(event)
  {
    $cordovaSocialSharing.share(event.body, event.title, event.img, "http://whatson.peoplesoft.co.za") // Share via native share sheet
      .then(function(result) {
        // Success!
      }, function(err) {
        alert(err);
        // An error occured. Show a message to the user
      });
  }


  t.show = function(m) {
    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });
  };

  t.hide = function(){
    $ionicLoading.hide();
  };

  t.register = function(cb)
  { 
    
    var device = {};
    device.device = $cordovaDevice.getDevice();
    device.cordova = $cordovaDevice.getCordova();
    device.model = $cordovaDevice.getModel();
    device.platform = $cordovaDevice.getPlatform();
    device.id = $cordovaDevice.getUUID();
    device.version = $cordovaDevice.getVersion();
    device.count = 0;

    $http.post("http://whatson.peoplesoft.co.za/device/create",device).
      then(function(response) {
        alert(JSON.stringify(response.data));
        cb(response.data);
      }, function(response) {
        console.log("Error",response);
      });
  };

  t.login = function()
  {
    t.show();
    if (window.localStorage.deviceId)
    {
      $http.get("http://whatson.peoplesoft.co.za/device/" + window.localStorage.deviceId).
        then(function(response) {
          response.data.count++;
          $http.post("http://whatson.peoplesoft.co.za/device/update/" + response.data.id, {count: response.data.count}).
            then(function(response) {
              console.log("Success",response);
              global.me = response.data;
              t.hide();
            }, function(response) {
              console.log("Error",response);
            });    
        }, function(response) {
          console.log("Error",response);
        });
    }
    else
    {
      t.register(function(me){
        global.me = me;
        window.localStorage.deviceId = me.id;
        t.login();
      });
    }
  };
  $ionicPlatform.ready(function() {
    t.login();
  });

  t.share = function(item)
  {
    alert(JSON.stringify($cordovaDevice.getDevice()));
  }

});