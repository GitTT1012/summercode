var Width = 1000;
var Height = 400;

var iris = [];
var Max = [0, 0, 0, 0];
var Min = [9, 9, 9, 9];

var mySvg = document.getElementById("drawing");
mySvg.setAttribute('width', Width);
mySvg.setAttribute('height', Height);

function Layout() {
    d3.csv("iris.csv", function (csv) {
        data = csv;
        /* 后续处理麻烦
        for (var i = 0; i < data.length; i++) {
            iris[i] = new Node();
            iris[i].species = data[i].species;

            iris[i].sepal_length = parseFloat(data[i].sepal_length);
            if (Max[0] <= iris[i].sepal_length) {
                Max[0] = iris[i].sepal_length;
            }
            if (Min[0] >= iris[i].sepal_length) {
                Min[0] = iris[i].sepal_length;
            }

            iris[i].sepal_width = parseFloat(data[i].sepal_width);
            if (Max[1] <= iris[i].sepal_width) {
                Max[1] = iris[i].sepal_width;
            }
            if (Min[1] >= iris[i].sepal_width) {
                Min[1] = iris[i].sepal_width;
            }

            iris[i].petal_length = parseFloat(data[i].petal_length);
            if (Max[2] <= iris[i].petal_length) {
                Max[2] = iris[i].petal_length;
            }
            if (Min[2] >= iris[i].petal_length) {
                Min[2] = iris[i].petal_length;
            }

            iris[i].petal_width = parseFloat(data[i].petal_width);
            if (Max[3] <= iris[i].petal_width) {
                Max[3] = iris[i].petal_width;
            }
            if (Min[3] >= iris[i].petal_width) {
                Min[3] = iris[i].petal_width;
            }

            if (iris[i].species == "setosa") {
                iris[i].color = "red";
            } else if (iris[i].species == "versicolor") {
                iris[i].color = "green";
            } else if (iris[i].species == "virginica") {
                iris[i].color = "blue";
            }
        }
        */
        for (var i = 0; i < data.length; i++) {
            iris[i] = new Node();
            iris[i].species = data[i].species;

            iris[i].data[0] = parseFloat(data[i].sepal_length);
            if (Max[0] <= iris[i].data[0]) {
                Max[0] = iris[i].data[0];
            }
            if (Min[0] >= iris[i].data[0]) {
                Min[0] = iris[i].data[0];
            }

            iris[i].data[1] = parseFloat(data[i].sepal_width);
            if (Max[1] <= iris[i].data[1]) {
                Max[1] = iris[i].data[1];
            }
            if (Min[1] >= iris[i].data[1]) {
                Min[1] = iris[i].data[1];
            }

            iris[i].data[2] = parseFloat(data[i].petal_length);
            if (Max[2] <= iris[i].data[2]) {
                Max[2] = iris[i].data[2];
            }
            if (Min[2] >= iris[i].data[2]) {
                Min[2] = iris[i].data[2];
            }

            iris[i].data[3] = parseFloat(data[i].petal_width);
            if (Max[3] <= iris[i].data[3]) {
                Max[3] = iris[i].data[3];
            }
            if (Min[3] >= iris[i].data[3]) {
                Min[3] = iris[i].data[3];
            }

            if (iris[i].species == "setosa") {
                iris[i].color = "red";
            } else if (iris[i].species == "versicolor") {
                iris[i].color = "green";
            } else if (iris[i].species == "virginica") {
                iris[i].color = "blue";
            }
        }
        Draw();
    });
}

function Node() {
    this.species = "default";
    this.data = [];
    this.color = "black";
}

function Draw() {
    for (var i = 0; i < 4; i++) {
        var w = 90.0 /(Max[i]-Min[i]);
        for (var j = 0; j < 4; j++) {
            //Draw coordinates
            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            var x = 10 + 100 * i;
            var y = 10 + 100 * j;
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", 90);
            rect.setAttribute("height", 90);
            rect.setAttribute("fill", "none");
            rect.setAttribute("stroke-width", "0.5");
            rect.setAttribute("stroke", "rgb(72,72,72)");
            mySvg.appendChild(rect);
            //Draw nodes
            for (var k = 0; k < iris.length; k++) {
                var h = 90.0 / (Max[j] - Min[j]);
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", x + (iris[k].data[i] - Min[i]) * w);
                circle.setAttribute("cy", y + 90 - (iris[k].data[j] - Min[j]) * h);
                circle.setAttribute("r", "1.5");
                circle.setAttribute("fill", iris[k].color);
                mySvg.appendChild(circle);
            }
        }
    }
}