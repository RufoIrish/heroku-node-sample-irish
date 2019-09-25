var usersOnline = [""];
var count = 0;

var onlines = [];
var user = $('ul li').length;
var socket = '';
var username = '';
var interval = 0;
// var name = $("");
$(document).ready(function() {
    socket = io();
    socket.on('onlineUsers', function(data) {

        for (var i = 0; i < data.length; ++i) {
            if (data[i] != username && !usersOnline.includes(data[i])) {
                usersOnline.push(data[i]);
                $("#online").append("<h6 class='onlineusers' id = '" + data[i] + "'>" + data[i] + "</h6>");
            }
        }

    });
    socket.on('logout', function(data) {
        if (data != "" && username != "") {
            var index = usersOnline.indexOf(data);
            usersOnline.splice(index, 1);
            $("#" + data).remove();
        }
    });
})
if ($("#start").click(function() {
        $("#wNickname").show();
        $("#start").hide();
    }))
    if ($("#submit").click(function() {

            $("h1").append(" " + $("#nickName").val());
            $("#online").show();
            socket.emit('onlineUsers', $("#nickName").val());
            username = $("#nickName").val();
            $("#wNickname").hide();
            $("#logOut").show();
            $("#goChat").show();
        }));
if ($("#logOut").click(function() {
        socket.emit('logout', username);
        $("h1").text("");
        $("#online").hide();
        $("#start").show();
        $("#wNickname").hide();
        $("#logOut").hide();
        $("#goChat").hide();
        $("li").val(null);
        $("input").val(null);
        usersOnline = [];
        $(".onlineusers").remove();

    }));

$(function() {
    var socket = io();
    $('form').submit(function() {
        socket.emit('chat message', $("#nickName").val() + " : " + $('#m').val());
        $('#m').val('');
        return false;
    });

    socket.on('chat message', function(msg) {
        $("#messages").find("#typing").remove();
        var name = msg.split(" :");
        if ($("#nickName").val() == name[0]) {
            $('#messages').append($('<li style= "color: red;margin-left: 300px;  padding : 10px;"><br><br>').text(name[1]));
        }
        if ($("#nickName").val() != name[0]) {
            $('#messages').append($('<li style = "color :  #eb34d2; margin-left: 0px;t padding : 10px;">').text(msg));
        }
        $("#messages").scrollTop($("#messages")[0].scrollHeight);
    });
    socket.on('typing', function(msg) {
        if (msg != username) {
            clearInterval(interval);
            $("#messages").find("#typing").remove();
            $('#messages').append($('<li id="typing" style = "color :  black; margin-left: 0px;t padding : 10px;font-size: 12px;">').text(msg + " is typing..."));
            interval = setInterval(function() {
                $("#messages").find("#typing").remove();
            }, 1000);
        }

    })

    $('#m').keydown(function() {
        socket.emit('typing', username);

    });

    $(window).unload(function() {
        socket.emit('logout', username);
    });
    $(window).on("beforeunload", function() {
        socket.emit('logout', username);
    })


});