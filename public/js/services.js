'use strict';

/* Services */
angular.module('videoChat.services', []).

  //Socket service
  //This deals with setting up and communicating through socket.io
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

  //Users service
  //This deals with managing the list of users, and communicating with the server (through socketService)
  .factory('usersService', function($rootScope, socketService){

    var usersService = {
      
      //Register a new user
      register: function(name, stream, successCallback){
        socketService.emit('registerUser', name);

        //When we get the ok from the server, add the user to the list
        socketService.on('registerUserSuccess', function(id){
          this.users[id] = {
            id: id,
            name: name,
            stream: stream
          };

          this.localStream = stream;

          //Everything OK, redirect to main view
          successCallback.apply();
      
        }.bind(this));
      },
      //Request a full list of users from the server
      getList: function(){
        socketService.emit('requestUsers');
      },
      //Connect to a user by id
      connect: function(id){
        this.users[id].peerConnection = new PeerConnection(this, this.localStream);
        this.users[id].peerConnection.connect(id);
      },
      //3 Send offer to target
      sendOffer: function(targetUserId, description){
        console.log("3: send offer to " + targetUserId);
        socketService.emit("sendOffer", [targetUserId, description]);
      },
      //5 Received offer from server
      receiveOffer: function(originUserId, description){
        console.log('5: new offer from user: ', originUserId);
        //Create new peerconnection on the recipient side
        var peerConnection = new PeerConnection(this, this.localStream);
        this.users[originUserId].peerConnection = peerConnection;
        peerConnection.receiveOffer(originUserId, description);
      },
      //8 Send answer back to initiator
      sendAnswer: function(originUserId, description){
        console.log("8: send answer to " + originUserId);
        socketService.emit("sendAnswer", {originUserId: originUserId, description: description});
      },
      //10
      receiveAnswer: function(originUserId, targetUserId, description){
        console.log("10: received answer from target " + targetUserId + " to origin " + originUserId);
        this.users[targetUserId].peerConnection.receiveAnswer(targetUserId, description);
      },
      newIceCandidate: function(targetUserId, candidate){
        console.log("M: new ICE candidate");
        socketService.emit("newIceCandidate", {targetUserId: targetUserId, candidate: candidate});
      },
      receivedIceCandidate: function(userId, candidate){
        console.log("M: received ICE candidate");
        this.users[userId].peerConnection.receivedIceCandidate(candidate);
        //this.peerConnections[userId].receivedIceCandidate(candidate);
      },
      addStreamToUser: function(userId, stream){
        console.log("Added stream to user " + userId);
        $rootScope.$apply(function(){
          this.users[userId].stream = stream;
        }.bind(this));
      },

      //Maintain local list of users in this object
      users: {}
    };

    //Bind to inbound socket messages
    //Get new list of users from server
    socketService.on('publishUsers', function(newList){
      //Add new users to the current list
      for(var user in newList){
        if(!(user in usersService.users)){
          usersService.users[user] = newList[user];
        }
      } 
    });

    socketService.on('receiveOffer', usersService.receiveOffer.bind(usersService));
    socketService.on('receiveAnswer', usersService.receiveAnswer.bind(usersService));
    socketService.on('receivedIceCandidate', usersService.receivedIceCandidate.bind(usersService));

    //Get the initial list of users
    usersService.getList();

    return usersService;

    });