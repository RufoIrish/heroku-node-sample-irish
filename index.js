var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var express = require('express');
var users = [];

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
    // socket.on('private', function(msg) {
    //     socket.emit('private', msg);

    // }); 
    socket.on('typing', function(username) {
        io.emit('typing', username);
    })
    socket.on('onlineUsers', function(msg) {
        if (!users.includes(msg)) {
            users.push(msg);
            io.emit('onlineUsers', users);
        }
    })
    socket.on('onlineRequest', function(username) {
        io.emit('onlineRequest', username);
    })

    socket.on('logout', function(username) {
        var index = users.indexOf(username);
        users.splice(index, 1);
        io.emit('logout', username);
    })
});


app.use(express.static('public'));


http.listen(port, function() {
    console.log('listening on *:' + port);
});