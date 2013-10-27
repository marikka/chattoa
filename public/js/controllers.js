'use strict';

/* Controllers */

function AppCtrl($scope, $location) {


  $location.path('/register');





}

//This controller takes care of registering the local user
//i.e. getting his name & video stream
function RegisterCtrl($scope, usersService, $location){

  var constraints = {audio: false, video: true};

  var successCallback = function(stream) {
    $scope.$apply(function(){
      $scope.stream = stream;  
    });
  };

  var errorCallback = function(error){
    console.log("navigator.getUserMedia error: ", error);
  }; 

  getUserMedia(constraints, successCallback, errorCallback);

  $scope.register = function(){
    usersService.register($scope.user.name, $scope.stream);
    //TODO: instead of redirecting now, redirect when the user gets his id from the server
  }
}

function UsersCtrl($scope, usersService){ 
  $scope.usersService = usersService;
  $scope.connect = function(id){
    usersService.connect(id);
  }
}
