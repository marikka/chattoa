'use strict';
//This object represents a connection between two peers and manages the per-connection aspects
//It uses the connection manager to relay the information through the server while negotiating a connection
var PeerConnection = function(connectionManager, localVideoStream ){
  var pc = {
    init: function(){
      this.rtcPeerConnection = new RTCPeerConnection(null);

      //Bind callbacks for RTCPeerConnection lifecycle events
      this.rtcPeerConnection.onaddstream            = this.onRemoteStreamAdded.bind(this);
      this.rtcPeerConnection.onremovestream         = this.onRemoteStreamRemoved.bind(this);
      this.rtcPeerConnection.onsignalingstatechange = this.onSignalingStateChange.bind(this);
      this.rtcPeerConnection.onicecandidate         = this.onIceCandidate.bind(this);
    },
    //1 Start connecting
    connect: function(targetUserId){
      console.log("1: connect to " + targetUserId);
      this.peerUserId = targetUserId;     
      this.rtcPeerConnection.addStream(this.localVideoStream);
      this.rtcPeerConnection.createOffer(this.gotLocalDescription.bind(this));
    },
    //2 We have created the local description
    gotLocalDescription: function(description){
      console.log("2: got local description: ", description);
      this.rtcPeerConnection.setLocalDescription(description);
      this.connectionManager.sendOffer(this.peerUserId, description);      
    },
    //6 Receive offer from server
    receiveOffer: function(originUserId, description){
   	  console.log("6: receive offer from " + originUserId);
      this.peerUserId = originUserId;
      this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(description));
      this.rtcPeerConnection.addStream(this.localVideoStream);
      this.rtcPeerConnection.createAnswer(this.createdAnswer.bind(this));
    },
    //7 Created answer
    createdAnswer: function(description){
      console.log("7: created answer: ", description);
      this.rtcPeerConnection.setLocalDescription(description);
      this.connectionManager.sendAnswer(this.peerUserId, description);
    },
    //11
    receiveAnswer: function(targetUserId, description){
      console.log("11: received answer from " + targetUserId);
      this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(description));  
    },
    receivedIceCandidate: function(candidate){
      console.log("P: received ice candidate");
      this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    },
    //When a remote stream is added to the peerConnection, show the video
    onRemoteStreamAdded: function(event){
      console.log("remote stream added");
      this.connectionManager.addStreamToUser(this.peerUserId, event.stream);
    },
    onRemoteStreamRemoved: function(event){
      console.log("remote stream removed");
      //TODO: Actually do something here
    },
    onSignalingStateChange: function(event){
      console.log("Signaling state change: ", event);
    },
    onIceCandidate: function(event){
      //console.log("onicecandidate", event);
      if(event.candidate) {
        this.connectionManager.newIceCandidate(this.peerUserId, event.candidate);
        this.rtcPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate));    
      }
    }
  }

  pc.localVideoStream  = localVideoStream;
  pc.connectionManager = connectionManager;

  pc.init();

  return pc;
};