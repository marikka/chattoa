var ConnectionManager = function(ui){
    this.ui = ui;
    this.initialize.apply(this, arguments);
  };

  //1 Connect
  _.extend(ConnectionManager.prototype, {
    peerConnections: {},
    initialize: function(){
      _.bindAll(this);
      this.setupSocketIo();
    },
    setupSocketIo: function(){
      this.socket = io.connect(document.URL);

      this.socket.on('receiveOffer', this.receiveOffer);
      this.socket.on('receiveAnswer', this.receiveAnswer);
      this.socket.on("receivedIceCandidate", this.receivedIceCandidate);
    },

    /*
    //3 Send offer to target
    sendOffer: function(targetUserId, description){
      this.socket.emit("sendOffer", targetUserId, description);
    },
    */

    /*
    //10
    receiveAnswer: function(originUserId, targetUserId, description){
      console.log("received answer from target " + targetUserId + " to origin " + originUserId);
      this.peerConnections[targetUserId].receiveAnswer(originUserId, description);
    },
    */
    /*
    //5 Received offer from server
    receiveOffer: function(originUserId, description){
      console.log('new offer from user: ', originUserId);
      //Create new peerconnection on the recipient side
      var peerConnection = new PeerConnection(this, this.ui);
      this.peerConnections[originUserId] = peerConnection;
      peerConnection.receiveOffer(originUserId, description);
    },
    */
    /*
    //8 Send answer back to initiator
    sendAnswer: function(originUserId, description){
      this.socket.emit("sendAnswer", originUserId, description);
    },
    */
    //0
    connectToUser: function(targetUserId){
      console.log("Starting call to: " + targetUserId);

      var peerConnection = new PeerConnection(this, this.ui);
      this.peerConnections[targetUserId] = peerConnection;

      peerConnection.connect(targetUserId);
    },
    /*
    newIceCandidate: function(targetUserId, candidate){
      this.socket.emit("newIceCandidate", targetUserId, candidate);
    },
    */
    /*
    receivedIceCandidate: function(userId, candidate){
      this.peerConnections[userId].receivedIceCandidate(candidate);
    }
    */
  });