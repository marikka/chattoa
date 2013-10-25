'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).


  //Socket factory
  factory('socketService', function ($rootScope) {
    var socketio = io.connect();
    return {
      on: function (eventName, callback) {
        socketio.on(eventName, function () {  
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socketio, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socketio.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socketio, args);
            }
          });
        })
      }
    };
  })


  //User factory
  .factory('usersService', function($rootScope, socketService){
    
    var usersService = {
      register: function(name){
        socketService.emit('registerUser', name);
      },
      getList: function(){
        socketService.emit('requestUsers');
      },
      users: {}
    };

    socketService.on('publishUsers', function(newList){
        usersService.users = newList;
    });

    //Get the initial list of users
    usersService.getList();

    return usersService;

    });