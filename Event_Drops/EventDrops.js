var Index = 2500;  //Control Scale Power
    Delta = 0,
    Data = [],
    Points = [],
    MySvg = document.getElementById("drawing"),
    Colors = ["#ef5b9c", "#f47920", "#ffd400", "#7fb80e", "#5c7a29", "#007d65", "#009ad6", "#11264f", "#8552a1", "#596032"];

function GenData() {
    var names = ["Lorem", "Ipsum", "Dolor", "Sit", "Amet", "Consectetur", "Adipisicing", "elit", "Eiusmod tempor", "Incididunt"];
    var endTime = Date.now();
    var month = 30 * 24 * 60 * 60 * 1000;
    var startTime = endTime - 6 * month;

    function createEvent(name, maxNbEvents) {
        //maxNbEvents参数缺省时默认为200
        maxNbEvents = maxNbEvents | 200;
        var event = {
            name: name,
            dates: []
        };
        //给事件创造200个可能的时间点
        var max = Math.floor(Math.random() * maxNbEvents);
        for (var j = 0; j < max; j++) {
            var time = (Math.random() * (endTime - startTime)) + startTime;
            event.dates.push(new Date(time));
        }
        return event;
    }

    for (var i = 0; i < 10; i++) {
        Data.push(createEvent(names[i]));
    }
}

function Layout() {
    var i,
        j,
        l;
    //给出跨浏览器鼠标滚轮事件差异方案
    MySvg.addEventListener("DOMMouseScroll", function (event) {
        if (event.detail) {
            Delta += (-40 * event.detail);
            Draw();
            //circle.setAttribute("transform", "translate(500)scale(" + (1 + Delta / 2500) + ",1)translate(-500)");
            //console.log(Delta);
        }
    }, false);
    MySvg.addEventListener("mousewheel", function (event) {
        if (event.wheelDelta) {
            Delta += event.wheelDelta;
            Draw();
            //circle.setAttribute("transform", "translate(500)scale(" + (1 + Delta / 2500) + ",1)translate(-500)");
            //console.log(Delta);
        }
    }, false);
    //绘制表格
    for (i = 0; i < 10; i++) {
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.innerHTML = Data[i].name + " (" + i + ")";
        text.setAttribute("y", 57.5 + i * 45);
        text.setAttribute("x", 100);
        text.setAttribute("font-size", 11);
        text.setAttribute("font-family", "Arial");
        text.setAttribute("text-anchor", "end");
        MySvg.appendChild(text);
        if (i !== 0) {
            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", "110");
            line.setAttribute("y1", 35 + i * 45);
            line.setAttribute("x2", "1000");
            line.setAttribute("y2", 35 + i * 45);
            line.setAttribute("stroke", "rgba(144,144,144,0.5)");
            line.setAttribute("stroke-width", "2");
            MySvg.appendChild(line);
        }
    }
    line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "110");
    line.setAttribute("y1", 35);
    line.setAttribute("x2", "1000");
    line.setAttribute("y2", 35);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "5");
    MySvg.appendChild(line);
    line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", "110");
    line.setAttribute("y1", 485);
    line.setAttribute("x2", "1000");
    line.setAttribute("y2", 485);
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", "5");
    MySvg.appendChild(line);
    //画出事件点
    for (i = 0; i < 10; i++) {
        Points[i] = [];
        for (j = 0, l = Data[i].dates.length; j < l; j++) {
            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("cx", 150 + 2 * j);
            circle.setAttribute("cy", 57.5 + i * 45);
            circle.setAttribute("r", "10");
            circle.setAttribute("fill-opacity", "0.5");
            circle.setAttribute("fill", Colors[i]);
            MySvg.appendChild(circle);
            Points[i].push(circle);
        }
    }
}

function Draw() {
    var i,
        j,
        l;

    for (i = 0; i < 10; i++) {
        for (j = 0, l = Points[i].length; j < l; j++) {
            Points[i][j].setAttribute("transform", "translate(150)scale(" + (1 + Delta / Index) + ",1)translate(-150)");
        }
    }
}