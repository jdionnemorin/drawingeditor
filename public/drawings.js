var canvas;
var socket;
var context;
var stroke = {
	color: '#000000',
	width: 2,
};

var reset = function() {
	socket.emit('reset');
	context.clearRect(0, 0, canvas.width, canvas.height);
};

document.addEventListener("DOMContentLoaded", function() {
	var mouse = {
		click: false,
		move: false,
		pos: {x:0, y:0},
		pos_prev: false
	};
	canvas = document.getElementById('drawing');
	socket  = io.connect();
	context = canvas.getContext('2d');
	var width   = window.innerWidth;
	var height  = window.innerHeight;

	canvas.width = width;
	canvas.height = height;

	canvas.onmousedown = function(e){
		mouse.click = true;
	};
	canvas.onmouseup = function(e){
		mouse.click = false;
	};

	canvas.onmousemove = function(e) {
		mouse.pos.x = e.clientX / width;
		mouse.pos.y = e.clientY / height;
		mouse.move = true;
	};

	socket.on('draw_line', function (data) {
		var line = data.line;
		context.strokeStyle = data.stroke.color;
		context.beginPath();
		context.lineWidth = data.stroke.width;
		context.moveTo(line[0].x * width, line[0].y * height);
		context.lineTo(line[1].x * width, line[1].y * height);
		context.stroke();
	});

	socket.on('reset', function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
	});

	function mainLoop() {
		if (mouse.click && mouse.move && mouse.pos_prev) {
			socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ], stroke: stroke });
			mouse.move = false;
		}
		mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
		setTimeout(mainLoop, 25);
	}
	mainLoop();
});