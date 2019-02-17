import { RotatePoint } from "./Helpers";

/**
 * Burst constructor
 * @param {Object} options
 */
export const Burst = function (options, game) {
	var length = options.length || 10;
	var count = options.count || 36;
	var color = options.color || "#F00";
	var name = options.name || "burst";
	var pos = options.position || { x: 0, y: 0 };
	var speed = options.speed || 10;

	var obj = {
		delete: false,
		radius: 0,
		count: count,
		color: color,
		name: name,
		position: pos,
		length: length
	};

	obj.Start = function () { };

	obj.Update = function () {
		this.radius += speed;
		if (this.radius > game.canvas.width || this.radius > game.canvas.height) {
			this.delete = true;
		}
	};

	obj.Draw = function (ctx) {
		ctx.save();
		ctx.translate(this.position.x, this.position.y);
		ctx.beginPath();
		for (var i = 0; i < this.count; i++) {
			var v1 = RotatePoint({ x: 0, y: this.radius }, { x: 0, y: 0 }, 2 / this.count * i * Math.PI);
			var v2 = RotatePoint({ x: 0, y: this.radius + this.length }, { x: 0, y: 0 }, 2 / this.count * i * Math.PI);
			ctx.moveTo(v1.x, v1.y);
			ctx.lineTo(v2.x, v2.y);
		}
		ctx.closePath();
		ctx.strokeStyle = this.color;
		ctx.shadowColor = this.color;
		ctx.shadowBlur = 5;
		ctx.stroke();
		ctx.restore();
	};
	
	return obj;
};