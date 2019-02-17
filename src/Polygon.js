
/**
 * Constructor for objects that would be rendered.
 * @param {Object} options
 */
export const Polygon = function (options) {
	var name = options.name || "Polygon";
	var color = options.color || "#0F0";
	var points = options.points || [{ x: 0, y: 0 }, { x: 10, y: 10 }, { x: 10, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 10 }];
	var pos = options.position || { x: 0, y: 0 };
	var vel = options.velocity || { x: 0, y: 0 };
	var size = options.size || { x: 100, y: 100 };
	var base = options.base || { x: 50, y: 50 };

	var p = {
		name: name,
		position: pos,
		velocity: vel,
		color: color,
		points: points,
		rotation: 0,
		base: base,
		size: size,
		newcnv: document.createElement("canvas"),
		delete: false
	};
	p.newctx = p.newcnv.getContext("2d");
	p.newcnv.width = p.size.x;
	p.newcnv.height = p.size.y;

	p.constructor.prototype.Start = function () { };
	p.constructor.prototype.Update = function () { };
	p.Draw = function (ctx) {
		this.newctx.clearRect(0, 0, this.newcnv.width, this.newcnv.height);
		this.newctx.save();
		this.newctx.translate(this.base.x, this.base.y);
		this.newctx.beginPath();
		this.newctx.moveTo(this.points[0].x, this.points[0].y);
		for (var i = 1; i < this.points.length; i++) {
			this.newctx.lineTo(this.points[i].x, this.points[i].y);
		}
		this.newctx.closePath();
		this.newctx.shadowBlur = 5;
		this.newctx.shadowColor = this.color;
		this.newctx.strokeStyle = this.color;
		this.newctx.stroke();
		this.newctx.restore();

		// Draw this object 8 times to simulate closed space near canvas edges.
		ctx.save();
		ctx.translate(this.position.x, this.position.y); // 0
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();

		ctx.save();
		ctx.translate(this.position.x - ctx.canvas.width, this.position.y); // 1
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();

		ctx.save();
		ctx.translate(this.position.x + ctx.canvas.width, this.position.y); // 2
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();

		ctx.save();
		ctx.translate(this.position.x, this.position.y - ctx.canvas.height); // 3
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();

		ctx.save();
		ctx.translate(this.position.x, this.position.y + ctx.canvas.height); // 4
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();

		ctx.save();
		ctx.translate(this.position.x - ctx.canvas.width, this.position.y - ctx.canvas.height); // 5
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();

		ctx.save();
		ctx.translate(this.position.x + ctx.canvas.width, this.position.y - ctx.canvas.height); // 6
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();

		ctx.save();
		ctx.translate(this.position.x - ctx.canvas.width, this.position.y + ctx.canvas.height); // 7
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();

		ctx.save();
		ctx.translate(this.position.x + ctx.canvas.width, this.position.y + ctx.canvas.height); // 8
		ctx.rotate(this.rotation * Math.PI / 180);
		ctx.drawImage(this.newcnv, -this.base.x, -this.base.y);
		ctx.restore();
	};

	return p;
};