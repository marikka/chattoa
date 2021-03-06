'use strict';

/* Controllers */
angular.module('videoChat.controllers', [])

.controller('AppCtrl', function AppCtrl($scope, $location) {
  $location.path('/register');
})

//This controller takes care of registering the local user
//i.e. getting his name & video stream
.controller('RegisterCtrl', function RegisterCtrl($scope, usersService, $location){
  //request for video only
  //(audio tends to feedback)
  var constraints = {audio: false, video: true};

  getUserMedia(constraints, 
    //success callback
    function(stream) {
      $scope.$apply(function(){
        $scope.stream = stream;  
      })}, 
    //error callvack
    function(error){
      console.log("navigator.getUserMedia error: ", error);
    });

  $scope.register = function(){
    //Try to register with the server, the user is redirected when (if) it succeeds
    usersService.register($scope.user.name, $scope.stream, function(){
      $location.path('/users');
    });
  }
})

//This controller deals with presenting the list of users and their video streams
.controller('UsersCtrl',function UsersCtrl($scope, usersService){
  $scope.users = {}; 
  $scope.users.list = usersService.users;
  $scope.connect = function(id){
    usersService.connect(id);
  }
});