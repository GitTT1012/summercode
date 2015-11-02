var MinHeight = 10000;
var MaxHeight = 0;

var Width = 1000;
var Height = 800;

var level = [];
var tree = [];
var _name = "flare"; //事件监听不成功？

var num = 0;
var id = 0;

var mySvg = document.getElementById("drawing");
mySvg.setAttribute("width", Width);
mySvg.setAttribute("height", Height);

function Layout() {

    d3.json("flare.json", function (json) {

        tree = json;
        GenTree(tree, 0);
        GenNode(tree);
        /*
        tree.children[0].extended = "Yes";
        tree.children[1].extended = "Yes";
        tree.children[0].children[2].extended = "Yes";
        tree.children[1].children[2].extended = "Yes";
        */
        Position(tree);
        Draw(tree);
    });
}

function GenTree(d, l) {

    if (d.children != undefined) {
        for (var i = 0; i < d.children.length; i++) {
            GenTree(d.children[i], l + 1);
        }
    }


    if (l == 0) {
        d.extended = "Yes";
    } else {
        d.extended = "No";
    }

    d.height = 100;
    d.x = 100 + l * 200;
    d.y = 400;
    d.px = 0;
    d.py = 0;
    d.links = [];
    d.paths = [];
    d.level = l;
    d.count = 0;

    if (d.children != undefined) {
        for (var i = 0; i < d.children.length; i++) {
            /*
            var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            d.links.push(line);
            mySvg.appendChild(d.links[i]);
            */
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            d.paths.push(path);
            mySvg.appendChild(d.paths[i]);
            d.children[i].parent = d;
            d.count++;
        }
    }
}

function GenNode(d) {

    var name = d.name;
    d.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    //d.circle.setAttribute("onmousedown", "_name =  "+ name + "");
    d.circle.setAttribute("onmousedown","num = "+ id +"")
    d.circle.setAttribute("onmouseup", "Change()");
    d.id = id++;
    mySvg.appendChild(d.circle);


    if (d.children != undefined) {
        for (var i = 0; i < d.children.length; i++) {
            GenNode(d.children[i]);
        }
    }
}

function GenLevel(d) {

    if (level[d.level] == undefined) {
        level[d.level] = [];
    }

    level[d.level].push(d);

    if (d.children != undefined && d.extended == "Yes") {
        for (var i = 0; i < d.children.length; i++) {

            GenLevel(d.children[i]);
        }
    }
}

function HeightInit(d) {

    if (d.children != undefined && d.extended == "Yes") {
        for (var i = 0; i < d.children.length; i++) {

            d.children[i].height = parseInt(d.height - d.count / 2) + i;
            HeightInit(d.children[i]);
        }
    }
}

function HeightRset(d) {

    if (d.children != undefined && d.extended == "Yes") {

        var last = d.children.length - 1;
        d.height = (d.children[0].height + d.children[last].height) / 2;
    }
}
//使两个extended节点中间节点等距
function Isometry(d) {
    //用数组来记录d的子节点里面extended的点
    var first = [],
        last = [],
        k = 0;

    if(d.children != undefined && d.extended == "Yes"){
        for (var i = 0; i < d.children.length; i++) {

            if (d.children[i].extended == "Yes" && d.children[i].level != 4){
                if (first == undefined) {
                    first[k++] = i;
                } else {
                    last[k - 1] = i;
                    first[k++] = i;
                }
            }
        }

        for (i = 0; i < k - 1; i++) {
            if (first[i] !== last[i]) {
                /*
                var h = (d.children[last].height - d.children[first].height) / (last - first);
                for (i = first-1; i >= 0; i--) {
    
                    d.children[i] = d.children[i + 1].height - h;
                }
                for (i = first + 1; d.children[i] != undefined; i++) {
    
                    d.children[i].height = d.children[i - 1].height + h;
                }
                */
                var dist = (d.children[last[i]].height - d.children[first[i]].height) / (last[i] - first[i]);
                for (var j = first[i] + 1; j < last[i]; j++) {
                    d.children[j].height = d.children[first[i]].height + dist * (j - first[i]);
                }
            }
        }
    }
}
//只移动d的子树
function Move(d, dist) {

    if (d.extended == "Yes" && d.children != undefined) {
        for (var i = 0; i < d.children.length; i++) {

            d.children[i].height += dist;
            Move(d.children[i], dist);
        }
    }
}

function Position(d) {

    var i,
        j,
        k,
        t = 3;

    HeightInit(d);
    level = [];
    GenLevel(d);
    //三次迭代一定保证了不交错现象，待证明！
    while (t--) {
        for (i = level.length - 1; i > 0; i--) {
            for (j = 0; j < level[i].length; j++) {

                if (level[i][j + 1] != undefined) {
                    if (level[i][j].height + 1 > level[i][j + 1].height) {


                        if (level[i][j].parent != level[i][j + 1].parent) {

                            var dist = level[i][j].height - level[i][j + 1].height + 2;
                            //Move(level[i][j + 1].parent, dist); 此语句累积了移动距离，让我调试了两小时才发现问题所在，醉了，醉了
                            level[i][j + 1].height += dist;
                            //不能只移动子树，否则移动后，leve[i+1]层可能出现重复碰撞情况
                            Move(level[i][j + 1], dist);
                        } else {

                            var dist = level[i][j].height - level[i][j + 1].height + 1;
                            //节点子树也需要跟着一起移动，因为节点与子树已经在上一循环对齐，不移动的话，对齐相当于没做
                            /*
                            此方法累积了移动距离，影响布局
                            for (k = 1; k + j < level[i].length; k++) {
                                level[i][k + j].height += dist;
                                Move(level[i][k + j], dist);
                            }
                            */
                            level[i][j + 1].height += dist;
                            Move(level[i][j + 1], dist);
                        }
                    }
                }
            }
            for (j = 0; j < level[i - 1].length; j++) {
                Isometry(level[i - 1][j]);
                HeightRset(level[i - 1][j]);
            }
        }
    }
    /*
    for (i = level.length - 1; i > 0; i--) {
        for (j = 0; j < level[i].length; j++) {
            
            if (level[i][j + 1] != undefined) {
                if (level[i][j].height + 1 > level[i][j + 1].height) {
                    if (level[i][j].parent != level[i][j + 1].parent) {

                        var dist = level[i][j].height - level[i][j + 1].height + 2;
                        //Move(level[i][j + 1].parent, dist); 此语句累积了移动距离，让我调试了两小时才发现问题所在，醉了，醉了
                        level[i][j + 1].height += dist;
                        //不能只移动子树，否则移动后，leve[i+1]层可能出现重复碰撞情况
                        Move(level[i][j + 1], dist);
                    } else {

                        var dist = level[i][j].height - level[i][j + 1].height + 1;
                        //节点子树也需要跟着一起移动，因为节点与子树已经在上一循环对齐，不移动的话，对齐相当于没做
                        /
                        此方法累积了移动距离，影响布局
                        for (k = 1; k + j < level[i].length; k++) {
                            level[i][k + j].height += dist;
                            Move(level[i][k + j], dist);
                        }
                        /
                        level[i][j + 1].height += dist;
                        Move(level[i][j + 1], dist);
                    }
                }
            }
        }
        for (j = 0; j < level[i - 1].length; j++) {
            Isometry(level[i - 1][j]);
            HeightRset(level[i - 1][j]);
        }
    }
    */

    for(i = level.length - 1; i > -1;i--){
        for(j = 0; j < level[i].length; j++){

            if(level[i][j].height > MaxHeight) MaxHeight = level[i][j].height;
            if(level[i][j].height < MinHeight) MinHeight = level[i][j].height;
        }
    }

    var h = (Height - 20) / (MaxHeight - MinHeight);

    for (i = level.length - 1; i > 0; i--) {
        //计算每层最小间距
        //var n = level[i].length;
        //var interval = 400 / (n - 1);

        for (j = 0; j < level[i].length; j++) {

            level[i][j].px = level[i][j].x;
            level[i][j].py = level[i][j].y;
            //level[i][j].x = 50 + i * 150;
            level[i][j].y = h * (level[i][j].height - MinHeight) + 10;
            //level[i][j].y = interval * (level[i][j].height - MinHeight) + 10;
        }
    }
}

function Draw(d) {

    /*
    var group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "node");
    group.data = d;

    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "-10");
    text.setAttribute("dy", ".35em");
    text.setAttribute("text-anchor", "end");
    text.setAttribute("style", "fill-opacity:1");
    text.textContent = d.name;
    
    group.appendChild(circle);
    group.appendChild(text);
    group.setAttribute("transform", "translate(" + d.x + "," + d.y + ")");
    */
    var i;

    if (d.name == "flare" || d.parent.extended == "Yes") {
        d.circle.setAttribute("r", "6.5");
        d.circle.setAttribute("cx", d.x);
        d.circle.setAttribute("cy", d.y);

        if (d.children != undefined) {
            if (d.extended == "Yes") {
                //画出非叶节点
                d.circle.setAttribute("stroke", "black");
                d.circle.setAttribute("style", "fill:white");
                /* 
                for (i = 0; i < d.children.length; i++) {
                    d.links[i].setAttribute("x1", d.x);
                    d.links[i].setAttribute("y1", d.y);
                    d.links[i].setAttribute("x2", d.children[i].x);
                    d.links[i].setAttribute("y2", d.children[i].y);
                    d.links[i].setAttribute("style", "stroke:black");
                }
                */
                for (i = 0; i < d.children.length; i++) {
                    var p = [];
                    p[0] = { x: d.x, y: d.y };
                    p[1] = { x: (d.x + d.children[i].x) / 2, y: d.children[i].y };
                    p[2] = { x: d.children[i].x, y: d.children[i].y };
                    var s = BezierCurve(p);
                    d.paths[i].setAttribute("d", s);
                    d.paths[i].setAttribute("fill", "none");
                    d.paths[i].setAttribute("stroke", "black");
                }
            } else {

                d.circle.setAttribute("style", "fill:black");
                d.circle.setAttribute("stroke", "black");
                for (i = 0; i < d.children.length; i++) {
                    /* 消除边
                    d.links[i].setAttribute("x1", d.x);
                    d.links[i].setAttribute("y1", d.y);
                    d.links[i].setAttribute("x2", d.x);
                    d.links[i].setAttribute("y2", d.y);
                    d.links[i].setAttribute("style", "stroke:white");
                    */
                    var s = "M" + d.x + "," + d.y + "L" + d.x + "," + d.y;
                    d.paths[i].setAttribute("d", s);
                    d.paths[i].setAttribute("fill", "none");
                    d.paths[i].setAttribute("stroke", "white");
                }
            }
        } else {
            //画出叶子节点
            d.circle.setAttribute("stroke", "black");
            d.circle.setAttribute("style", "fill:white");
        }
    } else {
        d.extended = "No";
        //消除节点
        d.circle.setAttribute("cx", 0);
        d.circle.setAttribute("cy", 0);
        d.circle.setAttribute("style", "fill:white"); // 圆圈必须用“style”，“fill：white”格式
        d.circle.setAttribute("stroke", "white");     // 圆圈必须用“stroke”，“white”格式
        if (d.children != undefined) {
            for (i = 0; i < d.children.length; i++) {
                /* 消除边
                d.links[i].setAttribute("style", "stroke:white"); // 线必须用“style”，“stroke：black”格式
                d.links[i].setAttribute("x1", d.x);
                d.links[i].setAttribute("y1", d.y);
                d.links[i].setAttribute("x2", d.x);
                d.links[i].setAttribute("y2", d.y);
                */
                var s = "M" + d.x + "," + d.y + "L" + d.x + "," + d.y;
                d.paths[i].setAttribute("d", s);
                d.paths[i].setAttribute("fill", "none");
                d.paths[i].setAttribute("stroke", "white");
            }
        }
    }
    //画子树
    if (d.children != undefined) {
        for (i = 0; i < d.children.length; i++) {
            Draw(d.children[i]);
        }
    }
}

function Change() {
    //初始化布局
    MinHeight = 10000;
    MaxHeight = 0;
    tree.height = 100;
    FindNode(tree);
    Position(tree);
    Draw(tree);
}

function FindNode(d){

    if (d.id == num) {
        d.extended = d.extended === "Yes" ? "No" : "Yes";
    } else {
        if (d.children != undefined) {
            for (var i = 0; i < d.children.length; i++) {
                FindNode(d.children[i]);
            }
        }
    }
}

function BezierCurve(p) {
    var str = "M" + p[0].x + "," + p[0].y;
    for (var t = 0.02; t <= 1; t += 0.02) {
        var x1 = (1 - t) * p[0].x + t * p[1].x;
        var y1 = (1 - t) * p[0].y + t * p[1].y;
        var x2 = (1 - t) * p[1].x + t * p[2].x;
        var y2 = (1 - t) * p[1].y + t * p[2].y;
        var x = (1 - t) * x1 + t * x2;
        var y = (1 - t) * y1 + t * y2;
        str += "L" + x + "," + y;
    }
    return str;
}