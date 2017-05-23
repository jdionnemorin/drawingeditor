var express = require('express');
var app = express();
var http = require('http');
var io = require('socket.io');

var server = http.createServer(app);
var io = io.listen(server);
server.listen(8080);
app.use(express.static(__dirname + '/public'));
console.log("Server running on 127.0.0.1:8080");

var line_history = [];
var lineStrokeHistory = [];

var rect_history = [];
var rectStrokeHistory = [];

io.on('connection', function (socket) {
	for (var i in line_history) {
		socket.emit('draw_line', { position: line_history[i], stroke: lineStrokeHistory[i] } );
	}
	for (var i in rect_history) {
		socket.emit('draw_line', { position: rect_history[i], stroke: rectStrokeHistory[i] } );
	}
	socket.on('draw_line', function (data) {
		line_history.push(data.position);
		lineStrokeHistory.push(data.stroke);
		io.emit('draw_line', { position: data.position, stroke: data.stroke});
	});

	socket.on('draw_rect', function (data) {
		rect_history.push(data.position);
		rectStrokeHistory.push(data.stroke);
		io.emit('draw_rect', { position: data.position, stroke: data.stroke});
	});

	socket.on('reset', function() {
		line_history = [];
		lineStrokeHistory = [];
		rect_history = [];
		rectStrokeHistory = [];

		io.emit('reset');
	});
});
