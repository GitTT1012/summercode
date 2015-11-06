var Width = 1000;
var Height = 400;

var iris = [];
var rects = [];
var circles = [];
var Max = [0, 0, 0, 0];
var Min = [9, 9, 9, 9];
var isChoose = 0;
//var isMove = 0;

var mySvg = document.getElementById("drawing");
mySvg.setAttribute('width', Width);
mySvg.setAttribute('height', Height);

mySvg.addEventListener("mousedown", function (event) {
    var i = 4,
        j = 4,
        n = rects.length,
        l = iris.length,
        rectangle = {},
        //不知道为什么鼠标箭头位置与理论位置差了5
        x = parseFloat(event.clientX) - 5,
        y = parseFloat(event.clientY) - 5,
        rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    /*判断是否越界，越界则什么都不做
    for (i = 0; i < 4; i++) {
        if (x <= 5 + 100 * i + 90) {
            if (x >= 5 + 100 * i) {
                break;
            }
        }
    }
    for (j = 0; j < 4; j++) {
        if (y <= 5 + 100 * j + 90) {
            if (y >= 5 + 100 * j) {
                break;
            }
        }
    }
    */
    rect.setAttribute("x", x);
    rect.setAttribute("y", y);
    rect.setAttribute("width", "0");
    rect.setAttribute("height", "0");
    rect.setAttribute("stroke-opacity", "0.5");
    rect.setAttribute("stroke", "rgb(144,144,144)");
    rect.setAttribute("fill-opacity", "0.1");
    rect.setAttribute("fill", "rgb(144,144,144)");
    rect.isMove = 0;
    rect.addEventListener("mousedown", function (event) {
        isChoose = 0;
        /*console.log(isChoose);
        rect.isMove = 1;
        rect.bx = parseFloat(event.clientX);
        rect.by = parseFloat(event.clientY);
        console.log(rect.x);*/
    }, false);
    /*
    rect.addEventListener("mousemove", function (event) {
        if (rect.isMove === 1) {
            var k,
                mx,
                my,
                nx,
                ny,
                a = {},
                n = rects.length;
            mx = parseFloat(event.clientX) - rect.bx;
            my = parseFloat(event.clientY) - rect.by;
            for (k = 0; k < n; k++) {
                if (rects[k].rect.isMove === 1) {
                    rects[k].x += mx;
                    rects[k].y += my;
                    //console.log(mx);

                    rects[k].rect.setAttribute("x", rects[k].x);
                    rects[k].rect.setAttribute("y", rects[k].y);
                    break;
                }
            }
        }
    }, false)
    rect.addEventListener("mouseup", function (event) {
        rect.isMove = 0;
        console.log(rect.isMove);
    }, false);
    */
    mySvg.appendChild(rect);
    rectangle.x = x;
    rectangle.y = y;
        //rectangle.w = 0;
        //rectangle.h = 0;
    rectangle.rect = rect;
    rects.push(rectangle);
        //rects[0].rect.setAttribute("width", "10");
        //rects[0].rect.setAttribute("height", "10");
    isChoose = 1;
        //console.log(x);
}, true);//不进行事件冒泡

mySvg.addEventListener("mousemove", function (event) {
    if (isChoose === 1) {
        var a = isBoundry();
        if ((a.x !== 4) && (a.y !== 4)) {
            var x = parseFloat(event.clientX),
                y = parseFloat(event.clientY),
                n = rects.length - 1,
                //w = Math.abs(rects[n].x - x),
                //h = Math.abs(rects[n].y - y);
                w,
                h;
            
            if (x < 5 + 100 * a.x) {
                x = 5 + 100 * a.x;
            } else if (x > 5 + 100 * a.x + 90) {
                x = 5 + 100 * a.x + 90;
            }
            w = Math.abs(rects[n].x - x);

            if (y < 5 + 100 * a.y) {
                y = 5 + 100 * a.y;
            } else if (y > 5 + 100 * a.y + 90) {
                y = 5 + 100 * a.y + 90;
            }
            h = Math.abs(rects[n].y - y);
            
            if (x < rects[n].x) {
                rects[n].rect.setAttribute("x", x);
                //rects[n].x = x;
            }
            if (y < rects[n].y) {
                rects[n].rect.setAttribute("y", y);
                //rects[n].y = y;
            }
            rects[n].rect.setAttribute("width", w);
            rects[n].rect.setAttribute("height", h);
            rects[n].x1 = x;
            rects[n].y1 = y;
        }
        /*
        var x = parseFloat(event.clientX),
            y = parseFloat(event.clientY),
            n = rects.length - 1,
            w = Math.abs(rects[n].x - x),
            h = Math.abs(rects[n].y - y);
        if (x < rects[n].x) {
            rects[n].rect.setAttribute("x", x);
            //rects[n].x = x;
        }
        if (y < rects[n].y) {
            rects[n].rect.setAttribute("y", y);
            //rects[n].y = y;
        }
        rects[n].rect.setAttribute("width", w);
        rects[n].rect.setAttribute("height", h);
        rects[n].x1 = x;
        rects[n].y1 = y;
        */
    }
}, false);

mySvg.addEventListener("mouseup", function (event) {
    //console.log(isChoose);
    if (isChoose === 1) {
        isChoose = 0;
        var i,
            a = isBoundry(),
            n = rects.length,
            l = iris.length;
        if ((a.x !== 4) && (a.y !== 4)) {
            Choose();
        } else {
            for (i = 0; i < n; i++) {
                mySvg.removeChild(rects[i].rect);
            }
            for (i = 0; i < l; i++) {
                iris[i].drag = 1;
            }
            rects = [];
        }
        Draw();
    }
    /*
    isChoose = 0;
    var i,
        a = isBoundry(),
        n = rects.length,
        l = iris.length;
    if ((a.x !== 4) && (a.y !== 4)) {
        Choose();
        //Draw();
    } else {
        for (i = 0; i < n; i++) {
            mySvg.removeChild(rects[i].rect);
        }
        for (i = 0; i < l; i++){
            iris[i].drag = 1;
        }
        rects = [];
    }
    */
    //Choose();
    //Draw();
    //console.log(isChoose);
}, false);

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
        Init();
    });
}

function Node() {
    this.species = "default";
    this.data = [];
    this.color = "black";
    this.drag = 1;
}

function Init() {
    for (var i = 0; i < 4; i++) {
        var w = 90.0 / (Max[i] - Min[i]);
        circles[i] = [];
        for (var j = 0; j < 4; j++) {
            //Draw coordinates
            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            var x = 5 + 100 * i;
            var y = 5 + 100 * j;
            rect.setAttribute("x", x);
            rect.setAttribute("y", y);
            rect.setAttribute("width", 90);
            rect.setAttribute("height", 90);
            rect.setAttribute("fill", "none");
            rect.setAttribute("stroke-width", "1.5");
            rect.setAttribute("stroke-opacity", "0.5");
            rect.setAttribute("stroke", "rgb(72,72,72)");
            mySvg.appendChild(rect);
            //Draw nodes
            circles[i][j] = [];
            for (var k = 0; k < iris.length; k++) {
                var h = 90.0 / (Max[j] - Min[j]);
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circle.setAttribute("cx", x + (iris[k].data[i] - Min[i]) * w);
                circle.setAttribute("cy", y + 90 - (iris[k].data[j] - Min[j]) * h);
                circle.setAttribute("r", "1.5");
                circle.setAttribute("fill-opacity", "0.5");
                circle.setAttribute("fill", iris[k].color);
                circles[i][j][k] = circle;
                mySvg.appendChild(circle);
            }
        }
    }
}

function Choose() {
    var i,
        j,
        k,
        x,
        y,
        nx,
        ny,
        x1,
        y1,
        x2,
        y2,
        l,
        n = rects.length - 1;

    if (rects[n].x < rects[n].x1) {
        x1 = rects[n].x;
        x2 = rects[n].x1;
    } else {
        x1 = rects[n].x1;
        x2 = rects[n].x;
    }
    if (rects[n].y < rects[n].y1) {
        y1 = rects[n].y;
        y2 = rects[n].y1;
    } else {
        y1 = rects[n].y1;
        y2 = rects[n].y;
    }
    for (i = 0; i < 5; i++) {
        x = 5 + 100 * i;
        if (x > rects[n].x) {
            break;
        }
    }
    i--;
    x -= 100;
    for (j = 0; j < 5; j++) {
        y = 5 + 100 * j;
        if (y > rects[n].y) {
            break;
        }
    }
    j--;
    y -= 100;
    for (k = 0, l = iris.length; k < l; k++) {
        nx = x + (iris[k].data[i] - Min[i]) * 90.0 /(Max[i]-Min[i]);
        ny = y + 90 - (iris[k].data[j] - Min[j]) * 90.0 / (Max[j] - Min[j]);
        if (iris[k].drag === 1) {
            iris[k].drag = 0;
            if (nx >= x1 && nx <= x2) {
                if (ny >= y1 && ny < y2) {
                    iris[k].drag = 1;
                    //console.log(k);
                }
            }
        }
    }
}

function Draw() {
    var i,
        j,
        k,
        l = iris.length;

    for (i = 0; i < 4; i++) {
        for (j = 0; j < 4; j++) {
            for (k = 0; k < l; k++) {
                if (iris[k].drag === 0) {
                    circles[i][j][k].setAttribute("fill-opacity", "0");
                    //mySvg.removeChild(circles[i][j][k]);
                } else {
                    circles[i][j][k].setAttribute("fill-opacity", "0.5");
                    //mySvg.appendChild(circles[i][j][k]);
                }
            }
        }
    }
}

function isBoundry() {
    var i,
        j,
        a = { x: 4, y: 4 },
        n = rects.length - 1;

    for (i = 0; i < 4; i++) {
        if(rects[n].x <= 5 + 100 * i + 90){
            if (rects[n].x >= 5 + 100 * i) {
                a.x = i;
                //console.log(i);
                break;
            }
        }
    }
    for (j = 0; j < 4; j++) {
        if (rects[n].y <= 5 + 100 * j + 90) {
            if (rects[n].y >= 5 + 100 * j) {
                a.y = j;
                break;
            }
        }
    }
    //console.log(a);
    return a;
}