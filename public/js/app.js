'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/register', {templateUrl: 'partials/register', controller: RegisterCtrl});
    $routeProvider.when('/users', {templateUrl: 'partials/users', controller: UsersCtrl});
    //$routeProvider.otherwise({redirectTo: '/register'});
    $locationProvider.html5Mode(false);
  }]);