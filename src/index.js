import "@babel/polyfill";

/**
 * Cross-browser wrapper for function "requestAnimationFrame"
 */
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 60);
		};
})();

import { GameEngine } from "./GameEngine";
import { Asteroid } from "./Asteroid";
import { ChangeGameColor } from "./Helpers";
import { makeShip } from "./Ship";

/**********************************************************************************/
/* Making new game object */
var game = new GameEngine("#g-game", "#g-score");
game.color = "";
if (typeof (Storage) !== "undefined") {
	game.color = localStorage["game.color"] || "#0F0";
	var c = 0;
	switch (game.color) {
		case "#F00":
			c = 1;
			break;
		case "#06F":
			c = 2;
			break;
		default:
			c = 0;
	}
	ChangeGameColor(c, game);
}

const ship = makeShip(game)

game.objects.push(ship);

/* Making procedural asteroids */
for (var i = 0; i < 4; i++) {
	var rock = new Asteroid(80, game);
	rock.Start();
	game.objects.push(rock);
}

/* Run game */
game.Run();