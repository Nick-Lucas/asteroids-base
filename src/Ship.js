import { Polygon } from './Polygon'
import { Asteroid } from "./Asteroid";
import { Bullet } from "./Bullet";
import { Burst } from "./Burst";
import { CheckIntersection, EngGameMessage, RotatePoint } from "./Helpers";

export function makeShip(game) {
  /* Adding ship */
  var ship = new Polygon({
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: -20 },
      { x: -10, y: 10 }
    ],
    color: game.color,
    name: "ship",
    size: { x: 30, y: 45 },
    base: { x: 15, y: 25 }
  });

  ship.Start = function () {
    this.position = { x: game.canvas.width / 2, y: game.canvas.height / 2 };
    this.rotationSpeed = 7;
    this.speed = 0.2;
    this.inertia = 0;
    this.inertiaMax = 0.99;
    this.shootDate = 0;
  };

  ship.Update = function () {
    // Rotate
    if (game.input.left) {
      this.rotation -= this.rotationSpeed;
    }
    if (game.input.right) {
      this.rotation += this.rotationSpeed;
    }
    if (this.rotation >= 360) {
      this.rotation -= 360;
    }
    if (this.rotation < 0) {
      this.rotation += 360;
    }

    // Change velocity vector when engine is on
    if (game.input.forward) {
      this.velocity.x -= Math.sin(-this.rotation * Math.PI / 180) * this.speed;
      this.velocity.y -= Math.cos(-this.rotation * Math.PI / 180) * this.speed;
      this.inertia = this.inertiaMax;

      // Draw flame
      this.points = [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: -20 },
        { x: -10, y: 10 },
        { x: 0, y: 0 },
        { x: 3, y: 8 },
        { x: 0, y: 15 },
        { x: -3, y: 8 }
      ];
    } else {
      // Hide flame
      this.points = [
        { x: 0, y: 0 },
        { x: 10, y: 10 },
        { x: 0, y: -20 },
        { x: -10, y: 10 }
      ];
    }

    // fire
    if (game.input.fire && Date.now() - this.shootDate > 300) {
      var b = new Bullet(game, this);
      b.Start();
      game.objects.push(b);
      this.shootDate = Date.now();
    }

    // Add inertia
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x *= this.inertia;
    this.velocity.y *= this.inertia;

    // Teleporting
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

    // Check intersection with asteroid
    var pos = this.position;
    var verts = this.points;
    var collision = false;
    var angle = this.rotation * Math.PI / 180;
    var asteroidCount = 0;
    game.eachByName("asteroid", function (node) {
      asteroidCount++;
      if (Math.sqrt((node.position.x - pos.x) * (node.position.x - pos.x) + (node.position.y - pos.y) * (node.position.y - pos.y)) < 130) {
        for (var i = 0; i < verts.length; i++) {
          var s1 = i;
          var s2 = i + 1 < verts.length ? i + 1 : 0;

          var rs1 = RotatePoint({ x: verts[s1].x, y: verts[s1].y }, { x: 0, y: 0 }, angle);
          var rs2 = RotatePoint({ x: verts[s2].x, y: verts[s2].y }, { x: 0, y: 0 }, angle);

          for (var j = 0; j < node.points.length; j++) {
            var n1 = j;
            var n2 = j + 1 < node.points.length ? j + 1 : 0;

            var rn1 = RotatePoint({ x: node.points[n1].x, y: node.points[n1].y }, { x: 0, y: 0 }, node.rotation * Math.PI / 180);
            var rn2 = RotatePoint({ x: node.points[n2].x, y: node.points[n2].y }, { x: 0, y: 0 }, node.rotation * Math.PI / 180);

            if (CheckIntersection(
              { x: rs1.x + pos.x, y: rs1.y + pos.y },
              { x: rs2.x + pos.x, y: rs2.y + pos.y },
              { x: rn1.x + node.position.x, y: rn1.y + node.position.y },
              { x: rn2.x + node.position.x, y: rn2.y + node.position.y }
            )) {
              collision = true;
            }
          }
        }
      }
    });
    if (collision) {
      this.delete = true;
      var burst = new Burst({ position: this.position, color: game.color }, game);
      game.objects.push(burst);
      EngGameMessage("#g-leaderboard", game.score);
      document.querySelector("#g-endgame").style.display = "block";
    }

    // Make new asteroids
    if (asteroidCount < 1) {
      for (var i = 0; i < 4; i++) {
        var rock = new Asteroid(80, game);
        rock.Start();
        game.objects.push(rock);
      }
    }
  };

  return ship
}