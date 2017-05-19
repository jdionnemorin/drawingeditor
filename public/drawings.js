var canvas, socket, context;

var stroke = {
	color: '#000000',
	width: 2
};
// 1 = line 2 = rect
var type = 'rect';


var reset = function() {
	socket.emit('reset');
	context.clearRect(0, 0, canvas.width, canvas.height);
};

var changeColor = function() {
	stroke.color = document.getElementById('color').value;
};

var changeWidth = function() {
	stroke.width = document.getElementById('width').value;
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
		context.lineCap = "round";
		context.beginPath();
		context.lineWidth = data.stroke.width;
		context.moveTo(line[0].x * width, line[0].y * height);
		context.lineTo(line[1].x * width, line[1].y * height);
		context.stroke();
		context.closePath();
	});

	socket.on('draw_rect', function (data) {
		console.log('ok');
		var line = data.line;
		context.strokeStyle = data.stroke.color;
		context.lineWidth = data.stroke.width;
		var x = Math.min(line[0].x * width,  line[1].x * width),
			y = Math.min(line[0].y * height,  line[1].y * height),
			w = Math.abs(line[0].x * width - line[1].x * width),
			h = Math.abs(line[0].y * height - line[1].y * height);
		context.strokeRect(x, y, w, h);
	});

	socket.on('reset', function () {
		context.clearRect(0, 0, canvas.width, canvas.height);
	});

	function mainLoop() {
		if (mouse.click && mouse.move && mouse.pos_prev) {
			switch(type) {
				case 'pen' :
					socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ], stroke: stroke });
					break;
				case 'rect' :
					socket.emit('draw_rect', { line: [ mouse.pos, mouse.pos_prev ], stroke: stroke });
					break;
				default:
					socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev ], stroke: stroke });
			}

			mouse.move = false;
		}
		mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
		setTimeout(mainLoop, 25);
	}
	mainLoop();
});