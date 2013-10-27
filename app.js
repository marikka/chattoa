
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes');

var app = module.exports = express();
var server = require('http').createServer(app);

// Hook Socket.io into Express
var io = require('socket.io').listen(server);

//Set Socket.io logging
io.set('log level', 1);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
app.get('*', routes.index);



var users = {};

// Socket.io Communication

io.sockets.on('connection', function (socket) {

  //Update user list on client disconnect
  socket.on('disconnect', function(){

    delete users[socket.id];
    socket.emit('publishUsers', users);  
  });

  socket.on('requestUsers', function(){
    io.sockets.emit('publishUsers', users);  
  });

  socket.on('registerUser', function (name){
    socket.set('userName', name);
    users[socket.id] = {
      id: socket.id,
      name: name
    };
    socket.emit('registerUserSuccess', socket.id);
    io.sockets.emit('publishUsers', users);
  });

  //4 A client sent a connection offer
  socket.on('sendOffer', function(data){
    var targetUserId = data[0];
    var description  = data[1];
    console.log("4: relay offer to: ", targetUserId);
    //TODO: Check that target (still) exists
    io.sockets.socket(targetUserId).emit("receiveOffer", socket.id, description);
  });

  //9
  socket.on('sendAnswer', function(data){
    console.log("9: got answer from " + socket.id + " to " + data.originUserId);
    io.sockets.socket(data.originUserId).emit("receiveAnswer", data.originUserId, socket.id, data.description);
  })

  socket.on('newIceCandidate', function(data){
    console.log("got candidate: ", data.candidate);
    io.sockets.socket(data.targetUserId).emit("receivedIceCandidate", socket.id, data.candidate);
  })

});

// Start server

server.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
