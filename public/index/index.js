$(document).ready(function() {
    var socket = io();

    var username = Math.random();

    socket.emit('login', username);

    var editor = CodeMirror.fromTextArea($('#editor')[0], {
        mode: 'javascript',
        lineNumbers: true,
        indentUnit: 4,
        autoCloseBrackets: true,
    });

    editor.setSize(null, 800);

    $('#editor').keydown(function(e) {
        if (e.keyCode == 32) {
            socket.emit('revision', $('#editor').val());
        }
    });

    socket.on('revision', function(data) {
        console.log(data);
        $('#editor').val(data + ' ');
    });

    // NAVBAR
    $('#navEditor').click(function() {

    });
});
