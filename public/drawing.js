
var ctx;
// Check for the canvas tag onload.
if(window.addEventListener) {
	window.addEventListener('load', function () {
		var canvas;
		var ctx;
		// Default tool. (chalk, line, rectangle)
		var tool;
		var tool_default = 'chalk';

		function init () {
			canvas = document.getElementById('drawingCanvas');

			// Create 2d canvas.
			ctx = canvas.getContext('2d');

			ctx.strokeStyle = "#FFFFFF";// Default line color.
			ctx.lineWidth = 1.0;// Default stroke weight.


			// Create a select field with our tools.
			var tool_select = document.getElementById('selector');
			tool_select.addEventListener('change', ev_tool_change, false);

			// Activate the default tool (chalk).
			if (tools[tool_default]) {
				tool = new tools[tool_default]();
				tool_select.value = tool_default;
			}
			// Event Listeners.
			canvas.addEventListener('mousedown', ev_canvas, false);
			canvas.addEventListener('mousemove', ev_canvas, false);
			canvas.addEventListener('mouseup',   ev_canvas, false);
		}
// Get the mouse position.
		function ev_canvas (ev) {
			if (ev.layerX || ev.layerX == 0) { // Firefox
				ev._x = ev.layerX;
				ev._y = ev.layerY;
			} else if (ev.offsetX || ev.offsetX == 0) { // Opera
				ev._x = ev.offsetX;
				ev._y = ev.offsetY;
			}
// Get the tool's event handler.
			var func = tool[ev.type];
			if (func) {
				func(ev);
			}
		}
		function ev_tool_change (ev) {
			if (tools[this.value]) {
				tool = new tools[this.value]();
			}
		}

		var tools = {};
		// Chalk tool.
		tools.chalk = function () {
			var tool = this;
			this.started = false;
			// Begin drawing with the chalk tool.
			this.mousedown = function (ev) {
				ctx.beginPath();
				ctx.moveTo(ev._x, ev._y);
				tool.started = true;
			};
			this.mousemove = function (ev) {
				if (tool.started) {
					ctx.lineTo(ev._x, ev._y);
					ctx.stroke();
				}
			};
			this.mouseup = function (ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
				}
			};
		};

		// The rectangle tool.
		tools.rect = function () {
			var tool = this;
			this.started = false;
			this.mousedown = function (ev) {
				tool.started = true;
				tool.x0 = ev._x;
				tool.y0 = ev._y;
			};
			this.mousemove = function (ev) {
				if (!tool.started) {
					return;
				}
				// This creates a rectangle on the canvas.
				var x = Math.min(ev._x,  tool.x0),
					y = Math.min(ev._y,  tool.y0),
					w = Math.abs(ev._x - tool.x0),
					h = Math.abs(ev._y - tool.y0);
				ctx.clearRect(0, 0, canvas.width, canvas.height);// Clears the rectangle onload.

				if (!w || !h) {
					return;
				}
				ctx.strokeRect(x, y, w, h);
			};
			// Now when you select the rectangle tool, you can draw rectangles.
			this.mouseup = function (ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
				}
			};
		};

		// The line tool.
		tools.line = function () {
			var tool = this;
			this.started = false;
			this.mousedown = function (ev) {
				tool.started = true;
				tool.x0 = ev._x;
				tool.y0 = ev._y;
			};
			this.mousemove = function (ev) {
				if (!tool.started) {
					return;
				}
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				// Begin the line.
				ctx.beginPath();
				ctx.moveTo(tool.x0, tool.y0);
				ctx.lineTo(ev._x,   ev._y);
				ctx.stroke();
				ctx.closePath();
			};
			// Now you can draw lines when the line tool is selected.
			this.mouseup = function (ev) {
				if (tool.started) {
					tool.mousemove(ev);
					tool.started = false;
				}
			};
		};

		init();
	}, false); }