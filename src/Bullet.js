import { Polygon } from './Polygon'
import { Asteroid } from "./Asteroid";
import { Burst } from "./Burst";
import { CheckPointInPoly, RotatePoint } from "./Helpers";

/**
 * Bullet constructor
 */
export const Bullet = function (game, ship) {
	var bul = new Polygon({
		points: [
			{ x: 0, y: 0 },
			{ x: 0, y: -5 }
		],
		size: { x: 10, y: 15 },
		base: { x: 5, y: 10 },
		color: game.color,
		name: "bullet"
	});

	bul.Start = function () {
		var posDelta = RotatePoint({ x: 0, y: -20 }, { x: 0, y: 0 }, ship.rotation * Math.PI / 180);
		this.position = { x: ship.position.x + posDelta.x, y: ship.position.y + posDelta.y };
		this.rotation = ship.rotation;
		this.velocity = { x: posDelta.x / 2, y: posDelta.y / 2 };
	};

	bul.Update = function () {
		// Move
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// Check for intersection with asteroid
		var pos = this.position;
		var collision = false;
		game.eachByName("asteroid", function (node) {
			// Check if close enough
			if (Math.sqrt((node.position.x - pos.x) * (node.position.x - pos.x) + (node.position.y - pos.y) * (node.position.y - pos.y)) < node.radius) {
				// Prepare vertices data
				var verts = [];
				for (var i = 0; i < node.points.length; i++) {
					var np = RotatePoint(node.points[i], { x: 0, y: 0 }, node.rotation * Math.PI / 180);
					verts.push({
						x: np.x + node.position.x,
						y: np.y + node.position.y
					});
				}
				// Checking
				if (CheckPointInPoly(pos, verts)) {
					collision = true;
					var r = node.radius / 2;
					if (r > 5) {
						var ast1 = new Asteroid(node.radius / 2, game);
						var ast2 = new Asteroid(node.radius / 2, game);
						ast1.Start();
						ast2.Start();

						ast1.velocity = RotatePoint(node.velocity, { x: 0, y: 0 }, 10 * Math.PI / 180);
						ast2.velocity = RotatePoint(node.velocity, { x: 0, y: 0 }, 360 - 10 * Math.PI / 180);

						ast1.position = { x: node.position.x + ast1.velocity.x, y: node.position.y + ast1.velocity.y };
						ast2.position = { x: node.position.x + ast2.velocity.x, y: node.position.y + ast2.velocity.y };

						game.objects.push(ast1, ast2);
					} else {
						var burst = new Burst({ position: node.position, color: game.color }, game);
						game.objects.push(burst);
					}
					node.delete = true;
					game.score += node.score;
				}
			}
		});
		if (collision) {
			this.delete = true;
		}

		// Delete if it goes out of world bounds
		if (this.position.x < 0 || this.position.y < 0 || this.position.x > game.canvas.width || this.position.y > game.canvas.height) {
			this.delete = true;
		}
	};
	
	return bul;
};