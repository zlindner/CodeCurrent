'use strict'

var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var helmet = require('helmet');

app.use(express.static('public'));
app.use(helmet());

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/main.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/main.css'));
});

io.sockets.on('connection', function(socket) {
    socket.on('login', function(data) {
        console.log(data + ' connected');
    });

    socket.on('revision', function(data) {
        io.emit('revision', data);
    });
});

server.listen(9000);
console.log('Server running on port 9000');