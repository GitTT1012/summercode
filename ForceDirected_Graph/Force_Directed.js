//Physics Constant
var ATTRACTION_CONSTANT = 0.04;
var REPULSION_CONSTANT = 600;
var CENTER_CONSTANT = 0.005;
var DEFAULT_MAX_ITERATIONS = 500;
var WIDTH = 960;
var HEIGHT = 500;

var num = -1;

//Generate forces and velocity
function Vector(cord_x, cord_y) {

    this.x = cord_x;
    this.y = cord_y;

    this.magnitude = function () {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

}

//make svg element
//svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

//Calculate Attraction Forces
function Node(cord_x, cord_y) {
    //Initial arguments
    this.x = cord_x;
    this.y = cord_y;
    this.id = 0;
    this.name = "node";
    this.color = "#229655";
    this.weight = 1;
    this.value = 1;

    this.Attraction_Force = function (node) {
        var DistVector = new Vector(node.x - this.x, node.y - this.y);
        var mag = DistVector.magnitude();
        if (mag < 20) mag = 20;
        var Force_x = ATTRACTION_CONSTANT * (mag - 20) * DistVector.x / mag;
        var Force_y = ATTRACTION_CONSTANT * (mag - 20) * DistVector.y / mag;
        var w = this.weight / (this.weight + node.weight);
        this.x += Force_x * w;
        this.y += Force_y * w;
        node.x -= Force_x * (1 - w);
        node.y -= Force_y * (1 - w);
    }

    this.Repulsion_Force = function (node) {
        var DistVector = new Vector(this.x - node.x, this.y - node.y);
        var mag = DistVector.magnitude();
        if (mag < 10) mag = 10;
        var Force_x = REPULSION_CONSTANT / Math.pow(mag, 3) * DistVector.x;
        var Force_y = REPULSION_CONSTANT / Math.pow(mag, 3) * DistVector.y;
        this.x += Force_x;
        this.y += Force_y;
    }

    this.Center_Force = function () {
        var Force_x = CENTER_CONSTANT * (WIDTH / 2 - this.x);
        var Force_y = CENTER_CONSTANT * (HEIGHT / 2 - this.y);
        this.x += Force_x;
        this.y += Force_y;
    }

}

function Diagram() {
    nodes = [];
    links = [];
    nodeNum = 0;
    linkNum = 0;
    var colors = ["#ef5b9c",
	"#f47920",
	"#ffd400",
	"#7fb80e",
	"#5c7a29",
	"#007d65",
	"#009ad6",
	"#11264f",
	"#8552a1",
	"#596032",
	"#46485f"];

    this.addNode = function (params) {
        var node = new Node(0,0);
        node.id = nodeNum++;
        node.name = params.name;
        node.color = params.color;
        node.x = params.x;
        node.y = params.y;
        nodes.push(node);
    }

    this.addLink = function (params) {
        var link = {};
        link.id = linkNum++;
        link.source = params.source;
        link.target = params.target;
        link.value = params.value ||1;
        links.push(link);
    }

    this.Init = function () {
        container = document.getElementById('context');
        mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        mySvg.setAttribute("width", WIDTH);
        mySvg.setAttribute("height", HEIGHT);
        mySvg.setAttribute("version", "1.2");// IE9+ support SVG 1.1 version
        mySvg.setAttribute("baseProfile", "tiny");
        mySvg.setAttribute("id", "mySvg")
        container.appendChild(mySvg);
        for (var i in miserables.nodes) {
            var params = {};
            params.name = miserables.nodes[i].name;
            params.color = colors[miserables.nodes[i].group];
            params.x = 10 + (WIDTH-20) * Math.random();
            params.y = 10 + (HEIGHT-20) * Math.random();
            this.addNode(params);
        }
        for (var i in miserables.links) {
            var params = {};
            params.source = nodes[miserables.links[i].source];
            params.target = nodes[miserables.links[i].target];
            params.value = miserables.links[i].value;
            this.addLink(params);
            links[i].source.weight += 1;
            links[i].target.weight += 1;
        }
        for (var i in links) {
            line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", links[i].source.x);
            line.setAttribute("y1", links[i].source.y);
            line.setAttribute("x2", links[i].target.x);
            line.setAttribute("y2", links[i].target.y);
            line.setAttribute("stroke", "rgb(144,144,144)");
            line.setAttribute("stroke-width", 0.25*links[i].value);
            mySvg.appendChild(line);
        }
        for (var i in nodes) {
            circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", nodes[i].x);
            circle.setAttribute("cy", nodes[i].y);
            circle.setAttribute("r", "10");
            circle.setAttribute("fill", nodes[i].color);
            circle.setAttribute("stroke", "rgb(256,256,256)");
            circle.setAttribute("stroke-width", "1");
            mySvg.appendChild(circle);
        }
        circles = document.getElementsByTagName("circle");
        lines = document.getElementsByTagName("line");
        mySvg.setAttribute("onmousemove", "Drag()");
        mySvg.setAttribute("onmouseup", "num = " + -1 + "");
        for (var i in nodes) {
            circles[i].setAttribute("onmousedown", "num = " + i + "");
        }
    }
}

function Draw() {
    for (var i = 0; i < linkNum; i++) {
        lines[i].setAttribute("x1", links[i].source.x);
        lines[i].setAttribute("y1", links[i].source.y);
        lines[i].setAttribute("x2", links[i].target.x);
        lines[i].setAttribute("y2", links[i].target.y);
    }
    for (var i = 0; i < nodeNum; i++) {
        circles[i].setAttribute("cx", nodes[i].x);
        circles[i].setAttribute("cy", nodes[i].y);
    }
}

function Drag() {
    if (num < 0) {
        return;
    } else {
        var e = e || window.event;
        nodes[num].x = parseInt(e.layerX);
        nodes[num].y = parseInt(e.layerY);
        Draw();
    }
}

function Run() {
    for (var i = 0; i < DEFAULT_MAX_ITERATIONS; i++) {
        for (var l = 0; l < 254; l++) {
            links[l].source.Attraction_Force(links[l].target);
        }
        for (var j = 0; j < 77; j++) {
            for (var k = 0; k < 77; k++) {
                if (j != k) {
                    nodes[j].Repulsion_Force(nodes[k]);
                }
            }
            nodes[j].Center_Force();
        }
    }
    if (num >= 0) {
        var e = e || window.event;
        nodes[num].x = parseInt(e.layerX);
        nodes[num].y = parseInt(e.layerY);
    }
}