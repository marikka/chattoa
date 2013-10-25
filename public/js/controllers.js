'use strict';

/* Controllers */

function AppCtrl($scope) {
}

function RegisterCtrl($scope, usersService, $location){
  $scope.register = function(name){
    usersService.register(name);
    $location.path('/users');
  }
}

function UsersCtrl($scope, usersService){ 
  $scope.usersService = usersService;  
}
