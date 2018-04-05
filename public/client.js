$(document).ready(function() {
    var socket = io();

    var username = Math.random();

    socket.emit('login', username);

    $('#editor').keydown(function(e) {
        if (e.keyCode == 32) {
            socket.emit('revision', $('#editor').val());
        }
    });

    socket.on('revision', function(data) {
        console.log(data);
        $('#editor').val(data + ' ');
    });
});