'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('videoChat', ['videoChat.services', 'videoChat.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/register', {templateUrl: 'partials/register', controller: RegisterCtrl});
    $routeProvider.when('/users', {templateUrl: 'partials/users', controller: UsersCtrl});
    $locationProvider.html5Mode(false);
  }]);