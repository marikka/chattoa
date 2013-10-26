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
  .factory('usersService', function($rootScope, socketService, $location){

    var usersService = {
      register: function(name, stream){
        socketService.emit('registerUser', name);

        //When we get the ok from the server, add the user to the list
        socketService.on('registerUserSuccess', function(id){
          this.users[id] = {
            id: id,
            name: name,
            stream: stream
          };

          $location.path('/users');
        }.bind(this));
      },
      getList: function(){
        socketService.emit('requestUsers');
      },
      users: {}
    };

    socketService.on('publishUsers', function(newList){
      //usersService.users = newList;
    });

    //Get the initial list of users
    usersService.getList();

    return usersService;

    });