
/**
 * Basic game class constructor
 * @param {String} canvasSelector
 * @param {String} scoreSelector
 */
export const GameEngine = function (canvasSelector, scoreSelector) {
	var cnv = document.querySelector(canvasSelector) || document.querySelector("canvas");
	var ctx = cnv.getContext("2d");
	var scr = document.querySelector(scoreSelector);
	var w = 320;
	var h = 240;

	// Setting defualt leaderboard data
	if (typeof (Storage) !== "undefined") {
		localStorage["board.0.name"] = "John Doe";
		localStorage["board.0.score"] = 9990;
		localStorage["board.1.name"] = "Artem N";
		localStorage["board.1.score"] = 1700;
	}

	var engine = {
		canvas: cnv,
		context: ctx,
		score: 0,
		objects: [],
		input: {
			mouse: {
				x: 0,
				y: 0
			},
			fire: false,
			left: false,
			right: false,
			forward: false
		}
	};

	/* Input events */
	engine.canvas.addEventListener("mousemove", function (e) {
		engine.input.mouse.x = e.layerX;
		engine.input.mouse.y = e.layerY;
	});
	document.addEventListener("keydown", function (e) {
		switch (e.keyCode) {
			case 32:
				engine.input.fire = true;
				break;
			// Left:
			case 37:
				engine.input.left = true;
				break;
			case 65:
				engine.input.left = true;
				break;
			// Right:
			case 39:
				engine.input.right = true;
				break;
			case 68:
				engine.input.right = true;
				break;
			// Forward:
			case 38:
				engine.input.forward = true;
				break;
			case 87:
				engine.input.forward = true;
				break;
		}
	});
	document.addEventListener("keyup", function (e) {
		switch (e.keyCode) {
			case 32:
				engine.input.fire = false;
				break;
			// Left:
			case 37:
				engine.input.left = false;
				break;
			case 65:
				engine.input.left = false;
				break;
			// Right:
			case 39:
				engine.input.right = false;
				break;
			case 68:
				engine.input.right = false;
				break;
			// Forward:
			case 38:
				engine.input.forward = false;
				break;
			case 87:
				engine.input.forward = false;
				break;
		}
	});

	/* Get each object by name */
	engine.eachByName = function (name, callback) {
		var n = name || "";
		var c = callback || function () { console.exception("Callback is undefined"); };

		for (var i = 0; i < this.objects.length; i++) {
			if (this.objects[i].name == n) {
				c(this.objects[i], i);
			}
		}
	};

	/* Basic engine functions */
	var Load = function () {
		engine.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || w);
		engine.canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || h) - 48;

		for (var i = 0; i < engine.objects.length; i++) {
			engine.objects[i].Start();
		}
	};

	var Update = function () {
		var prevScore = engine.score;

		// Clear canvas
		engine.context.clearRect(0, 0, engine.canvas.width, engine.canvas.height);

		// Delete unused objects
		for (var i = 0; i < engine.objects.length; i++) {
			if (engine.objects[i].delete) {
				engine.objects.splice(i, 1);
			}
		}

		// Update objects
		for (var j = 0; j < engine.objects.length; j++) {
			engine.objects[j].Update();
			engine.objects[j].Draw(engine.context);
		}

		// Update score
		if (engine.score > prevScore) {
			scr.innerHTML = engine.score;
		}

		// Game loop
		window.requestAnimFrame(Update);
	};

	engine.Run = async function () {
		Load();
		Update();
	};

	return engine;
};