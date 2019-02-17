import { Polygon } from './Polygon'
import { asteroidVertices } from "./Helpers";

/**
 * Asteroid constructor
 * @param {Number} rad 		Asteroid radius.
 */
export const Asteroid = function (rad, game) {
	var asteroid = new Polygon({
		points: asteroidVertices(Math.max(Math.floor(rad / 5), 3), rad),
		color: game.color,
		name: "asteroid",
		size: { x: 210, y: 210 },
		base: { x: 105, y: 105 },
		velocity: { x: (Math.random() * 2 - 1) * Math.random() * 2, y: (Math.random() * 2 - 1) * Math.random() * 2 },
		position: { x: Math.random() * 500, y: Math.random() * 1000 }
	});

	asteroid.Start = function () {
		this.rotationSpeed = (Math.random() * 2 - 1) * Math.random() * 2;
		this.radius = rad;
		this.score = (80 / this.radius) * 5;
	};

	asteroid.Update = function () {
		this.position.x += this.velocity.x;
		this.position.y += this.velocity.y;

		// Teleporting on edges
		if (this.position.x > game.canvas.width) {
			this.position.x -= game.canvas.width;
		}
		if (this.position.x < 0) {
			this.position.x += game.canvas.width;
		}
		if (this.position.y > game.canvas.height) {
			this.position.y -= game.canvas.height;
		}
		if (this.position.y < 0) {
			this.position.y += game.canvas.height;
		}

		// Set rotation
		this.rotation += this.rotationSpeed;
		if (this.rotation >= 360) {
			this.rotation -= 360;
		}
		if (this.rotation < 0) {
			this.rotation += 360;
		}
	};
	
	return asteroid;
};