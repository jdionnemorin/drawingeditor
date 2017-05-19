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
var strokeHistory = [];

io.on('connection', function (socket) {
	for (var i in line_history) {
		socket.emit('draw_line', { line: line_history[i], stroke: strokeHistory[i] } );
	}
	socket.on('draw_line', function (data) {
		line_history.push(data.line);
		strokeHistory.push(data.stroke);
		io.emit('draw_line', { line: data.line, stroke: data.stroke});
	});

	socket.on('reset', function() {
		line_history = [];
		strokeHistory = [];
		io.emit('reset');
	});
});
