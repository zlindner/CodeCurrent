'use strict'

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var helmet = require('helmet');

app.use(express.static('public'));
app.use(helmet());

io.sockets.on('connection', function(socket) {
    
});

server.listen(9000);
console.log('Server running on port 9000');