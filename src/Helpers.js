
/* Helpers */
/**
 * Checks intersection between 2 lines
 * @param {Object} v1 	{x: Number, y: Number}
 * @param {Object} v2 	{x: Number, y: Number}
 * @param {Object} v3 	{x: Number, y: Number}
 * @param {Object} v4 	{x: Number, y: Number}
 */
export function CheckIntersection(v1, v2, v3, v4) {
  var n1, n2, n3, n4;
  n1 = (v4.x - v3.x) * (v1.y - v3.y) - (v4.y - v3.y) * (v1.x - v3.x);
  n2 = (v4.x - v3.x) * (v2.y - v3.y) - (v4.y - v3.y) * (v2.x - v3.x);
  n3 = (v2.x - v1.x) * (v3.y - v1.y) - (v2.y - v1.y) * (v3.x - v1.x);
  n4 = (v2.x - v1.x) * (v4.y - v1.y) - (v2.y - v1.y) * (v4.x - v1.x);
  return (n1 * n2 < 0) && (n3 * n4 < 0);
}

/**
 * Checks if point is inside the polygon
 * @param {Object} p    	{x: Number, y: Number}
 * @param {Array}  poly 	Array of objects: {x: Number, y: Number}
 */
export function CheckPointInPoly(p, poly) {
  for (var i = 0, j = poly.length - 1, res = false; i < poly.length; j = i++) {
    var v1 = { x: poly[i].x, y: poly[i].y };
    var v2 = { x: poly[j].x, y: poly[j].y };
    if (((v1.y > p.y) != (v2.y > p.y)) && (p.x < (v2.x - v1.x) * (p.y - v1.y) / (v2.y - v1.y) + v1.x))
      res = !res;
  }
  return res;
}

/**
 * Rotate point around center on certain angle
 * @param {Object} p      	{x: Number, y: Number}
 * @param {Object} center 	{x: Number, y: Number}
 * @param {Number} angle  	Angle in radians
 */
export function RotatePoint(p, center, angle) {
  return {
    x: ((p.x - center.x) * Math.cos(angle) - (p.y - center.y) * Math.sin(angle)) + center.x,
    y: ((p.x - center.x) * Math.sin(angle) + (p.y - center.y) * Math.cos(angle)) + center.y
  };
}

/**
 * Generates vertices for asteroid polygon with certain count and radius
 * @param  {Number} count 	Number of vertices
 * @param  {Number} rad   	Maximal radius of polygon
 * @return {Array}       	Array of vertices: {x: Number, y: Number}
 */
export function asteroidVertices(count, rad) {
  var p = [];
  for (var i = 0; i < count; i++) {
    p[i] = {
      x: (-Math.sin((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad,
      y: (-Math.cos((360 / count) * i * Math.PI / 180) + Math.round(Math.random() * 2 - 1) * Math.random() / 3) * rad
    };
  }
  return p;
}

/**
 * Shows message box at the end of game
 * @param {String} selector
 * @param {Number} score
 */
export function EngGameMessage(selector, score) {
  var scores = [];
  // If local storage exists…
  if (typeof (Storage) !== "undefined") {
    // Reading storage for saved scores
    for (var i = 0; i < localStorage.length; i++) {
      if (typeof localStorage["board." + i + ".name"] !== "undefined") {
        scores.push({
          name: localStorage["board." + i + ".name"],
          score: localStorage["board." + i + ".score"]
        });
      }
    }
    // Sorting leaderboard
    scores.sort(function (a, b) { return b.score - a.score; });

    // Prepare html to show
    var html = "<ol class=\"b-scores\">";
    for (var j = 0; j < scores.length; j++) {
      html += "<li class=\"b-scores__box\">";
      if (score > scores[j].score) {
        html += "Your score: " + score + ". <input onchange=\"SaveName(this)\" value=\"\" autofocus=\"autofocus\" type=\"text\" placeholder=\"Enter your name\" class=\"b-scores__input\" \/><\/li><li class=\"b-scores__box\">";
        score = 0;
      }
      html += scores[j].score + ": " + scores[j].name + "<\/li>";
    }
    if (score !== 0) {
      html += "<li class=\"b-scores__box\">Your score: " + score + ". <input onchange=\"SaveName(this)\" value=\"\" autofocus=\"autofocus\" type=\"text\" placeholder=\"Enter your name\" class=\"b-scores__input\" \/><\/li>";
    }
    html += "<\/ol>";

    document.querySelector(selector).innerHTML = html;
  }
}

/**
 * Saves score in local storage
 * @param {Number}    score
 * @param {HTML node} node
 */
export function SaveScore(score, node, game) {
  if (score > 0 && typeof (Storage) !== "undefined") {
    var k = 0;
    for (var i = 0; i < localStorage.length; i++) {
      if (typeof localStorage["board." + i + ".name"] !== "undefined") {
        k = i + 1;
      }
    }
    localStorage["board." + k + ".name"] = game.name;
    localStorage["board." + k + ".score"] = score;
    node.innerHTML = "Done!";
  }
}

/**
 * Saves name from input into global variable
 * @param {HTML node} node
 */
export function SaveName(node, game) { game.name = node.value; }

/**
 * Changes polygon and page color
 * @param {Number} color 	Color code: 0 - green, 1 - red, 2 - blue.
 */
export function ChangeGameColor(color, game) {
  var c = "#0F0";
  var page = document.querySelector("body");
  switch (color) {
    case 1:
      c = "#F00";
      page.className = "m-red";
      break;
    case 2:
      c = "#06F";
      page.className = "m-blue";
      break;
    default:
      c = "#0F0";
      page.className = "m-green";
  }
  for (var i = 0; i < game.objects.length; i++) {
    game.objects[i].color = c;
  }
  game.color = c;
  localStorage["game.color"] = c;
}
