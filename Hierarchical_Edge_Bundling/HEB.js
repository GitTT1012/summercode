var tree = {};
var data = {};
var treenodes = [];
var interval;
var radius = 400;
var paths = [];
var beta = 0.7;
var number = 0;


var mySvg = document.getElementById('mySvg');

function Initialize() {

    d3.json("flare-import.json", function (json) {

        var group;

        data = json;
        tree = GetTree(tree, 0);

        //group = GroupNum(tree);
        //console.log(group == json.length);
        interval = 2 * Math.PI / 257;
        treenodes = Getnodes();
        Sync(tree);
        SetID(tree);
        SetPosition(tree);
        Draw1();
        //console.log(tree);
        paths = GetPaths();
        Draw0(tree);
        Draw(data);
    });

}

function GetTree(d, n) {

    var j = 0;

    if (n == 0) {

        d = { name: "flare", position: { x: 500, y: 500 } };
        n++;

    }

    d.children = [];

    for (var i = 0; i < data.length; i++) {

        var array = data[i].name.split(".");

        if (j == 0) {

            if (d.name == array[n-1] && n < array.length) {

                d.children[j++] = { name: array[n], position: { x: 500, y: 500 } };

            }

        } else if (d.name == array[n-1] && d.children[j - 1].name !== array[n]) {

            if (n < array.length) {

                d.children[j++] = { name: array[n], position: { x: 500, y: 500 } };

            }
        }
    }

    for (i = 0; i < j; i++) {

        d.children[i] = GetTree(d.children[i], n+1);

    }

    return d;
}

function GroupNum(s) {
    /*
    var num = 0;

    if (d.children.length == 0) {

        return 1;
    } else {

        for (var i = 0; i < d.children.length; i++) {

            num += GroupNum(d.children[i]);
        }
    }

    return num;
    */
    var current,
        done = 0,
        num = 0,
        t = 0;

    for (var i = 0; i < data.length; i++) {
        var arr = data[i].name.split(".");
        
        if (i == 0) {
            current = arr[arr.length - 2];
        }

        if (arr[arr.length - 2] != current) {
            num++;
        }
        
        for (var j = 0; j < arr.length; j++) {
            if (arr[j] == s) {
                done = 1;
                break;
            }
        }
        if (done == 1) {
            break;
        }
        num++;
    }
    
    for (i; i < data.length; i++) {
        arr = data[i].name.split(".");
        if (arr[j] != s) {
            break;
        }
        t++;
    }
    
    return num + t / 2;
}

function FindOrder(s) {

    for (var i = 0; i < data.length; i++) {
        var arr = data[i].name.split(".");
        for (var j = 0; j < arr.length; j++) {
            if (arr[j] == s) {
                return j / arr.length + 0.1;
            }
        }
    }
}

function Sync(d) {
    /*
    var num = 0;

    if (d.children.length != 0) {

        for (var i = 0; i < d.children.length; i++) {
            num = GroupNum(d.children[i].name);
            d.children[i].position.x = 500 + FindOrder(d.children[i].name) * radius * Math.cos(num * 2 * Math.PI / params);
            d.children[i].position.y = 500 + FindOrder(d.children[i].name) * radius * Math.sin(num * 2 * Math.PI / params);
        }
    }

    for (i = 0; i < d.children.length; i++) {
        SetPosition(d.children[i]);
    }
    */

    if (d.children.length == 0) {

        d.position = treenodes[number].position;
        d.id = treenodes[number++].id;
    } else {

        for (var i = 0; i < d.children.length; i++) {

            Sync(d.children[i]);
        }
    }
}

function SetID(d) {

    if (d.children.length != 0) {

        var leftId,
            rightId;

        var n,
            a = d,
            b = d;

        while (a.children.length != 0) {
            n = a.children.length;
            a = a.children[0];
            if (a.children.length == 0) {
                leftId = a.id;
            }
        }
        while (b.children.length != 0) {
            n = b.children.length;
            b = b.children[n - 1];
            if (b.children.length == 0) {
                rightId = b.id;
            }
        }
        d.id = (leftId + rightId) / 2;

        for (var i = 0; i < d.children.length; i++) {
            SetID(d.children[i]);
        }
    }
}

function SetPosition(d) {
    
    if (d.children.length != 0 && d.name != "flare") {

        d.position.x = 500 + FindOrder(d.name) * radius * Math.cos(d.id * interval);
        d.position.y = 500 + FindOrder(d.name) * radius * Math.sin(d.id * interval);
    }
    for (var i = 0; i < d.children.length; i++) {
        SetPosition(d.children[i]);
    }
}

function GetPaths() {
    
    var links = [];

    for (i = 0; i < data.length; i++) {
        for (j = 0; j < data[i].imports.length; j++) {

            links.push(LCA(tree, data[i].name, data[i].imports[j]));
        }
    }
    return links;
}

function LCA(d, s1, s2) {

    var path = [],
        a1 = [],
        a2 = [];

    a1 = s1.split(".");
    a2 = s2.split(".");

    for (var i = 0; i < Math.min(a1.length, a2.length) ; i++) {
        if (a1[i] !== a2[i]) {

            break;
        }
    }

    for (var j = i; j < a1.length; j++) {

        path.push(FindNode(tree, a1[j]));
    }
    path.reverse();
    path.push(FindNode(tree, a1[i - 1]));
    for (j = i; j < a2.length; j++) {

        path.push(FindNode(tree, a2[j]));
    }

    return path;
}

function FindNode(d, s) {

    if (d.name == s) {

        return d.position;
    }

    for (var i = 0; i < d.children.length; i++) {
        if (FindNode(d.children[i], s) != undefined) {
            return FindNode(d.children[i], s);
        }
    }
}

function B(k, d, u, t) {

    var a1, a2, b1, b2;

    if (d == 1) {

        if (u < t[k + 1] && u > t[k]) {

            return 1;
        } else {

            return 0;
        }
    }

    a1 = u - t[k];
    a2 = t[k + d - 1] - t[k];
    b1 = t[k + d] - u;
    b2 = t[k + d] - t[k + 1];

    if (a2 == 0) {
        a2 = 1;
    }

    if (b2 == 0) {
        b2 = 1;
    }

    return a1 / a2 * B(k, d - 1, u, t) + b1 / b2 * B(k + 1, d - 1, u, t);
}

function GenT(d, n) {

    var t = [];

    for (var i = 0; i <= n + d; i++) {
        if (i < d) {
            t.push(0);
        }
        else if (i >= d && i <= n) {
            t.push(i - d + 1);
        }
        else {
            t.push(n - d + 2);
        }
    }

    var len = t[t.length - 1] - t[0];

    if (len != 0) {
        for (var i = 0; i < t.length; i++) {
            t[i] /= len;
        }
    }

    return t;
}

function B_Spline(p, u) {

    var a = { x: 0, y: 0 };
    var t = GenT(3, p.length - 1);

    for (var i = 0; i < p.length; i++) {
        a.x += p[i].x * B(i, 3, u, t);
        a.y += p[i].y * B(i, 3, u, t);
    }
    return a;
}

function DrawLine(q) {

    var list = [];

    for (var t = 0.01; t <= 1; t += 0.01) {
        list.push(B_Spline(q, t));
    }

    var str = "M";

    for (var i = 0 ; i < list.length; i++) {
        if (i == 0) {
            str += list[i].x + "," + list[i].y;
        }
        else {
            str += "L" + list[i].x + "," + list[i].y;
        }
    }
    return str;
}

function Fix(arr) {

    var n = arr.length;
    var newarr = [];

    for (var i = 0; i < n; i++) {

        newarr.push({ x: 0, y: 0 });
        newarr[i].x = (beta * arr[i].x) + (1 - beta) * (arr[0].x + (i / (n - 1)) * (arr[n - 1].x - arr[0].x));
        newarr[i].y = (beta * arr[i].y) + (1 - beta) * (arr[0].y + (i / (n - 1)) * (arr[n - 1].y - arr[0].y));
    }

    return newarr;
}

function Draw(d) {

    var k = 0;

    for (var i = 0; i < d.length; i++) {
        for (var j = 0; j < d[i].imports.length; j++) {

            var _path = Fix(paths[k]);
            var path = document.createElementNS("http://www.w3.org/2000/svg", "path");

            var str = DrawLine(_path);

            path.setAttribute("d", str);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "#1f77b4");
            path.setAttribute("stroke-opacity", 0.4);

            mySvg.appendChild(path);

            k++;
        }
    }

    Draw1();
}

function Draw0(d){

    if (d.children.length != 0) {

        if (d.name != "flare") {
            var angle = d.id * interval * 180 / Math.PI;
        } else {
            var angle = 0;
        }

        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        text.innerHTML = d.name;
        text.setAttribute("font-size", 12);
        text.setAttribute("font-family", "Arial");

        text.setAttribute("x", d.position.x);
        text.setAttribute("y", d.position.y);

        //text.setAttribute("text-anchor", "left");
        //text.setAttribute("dominant-baseline", "bottom");
        text.setAttribute("transform", "rotate(" + angle + "," + d.position.x + "," + d.position.y + ")");
        mySvg.appendChild(text);
    }

    for (var i = 0; i < d.children.length; i++) {

        Draw0(d.children[i]);
    }
}

function Getnodes() {

    var i,
        j,
        n,
        currentparent,
        nodes = [],
        array = [];

    j = 0;

    for (i = 0; i < data.length; i++) {

        array = data[i].name.split(".");
        n = array.length - 1;

        if (i == 0) {

            currentparent = array[n - 1];
        }

        if (currentparent == array[n - 1]) {

            nodes[i] = { name: array[n], id: j, position: { x: 0, y: 0 } };

        } else {

            nodes[i] = { name: array[n], id: ++j, position: { x: 0, y: 0 } };
            currentparent = array[n - 1];
        }

        nodes[i].position.x = 500 + radius * Math.cos(j * interval);
        nodes[i].position.y = 500 + radius * Math.sin(j * interval);
        ++j;
    }

    return nodes;
}

function Draw1() {

    /*
    var angle = [0,90,-90];

    for (var i = 0; i < 3; i++) {
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.innerHTML = treenodes[0].name;
        text.setAttribute("font-size", 36);
        text.setAttribute("font-family", "Arial");
        text.setAttribute("x", treenodes[0].position.x);
        text.setAttribute("y", treenodes[0].position.y);
        text.setAttribute("transform", "rotate(" + angle[i] + "," + treenodes[0].position.x + "," + treenodes[0].position.y + ")");
        mySvg.appendChild(text);
    }
    */
    
    for (var i = 0; i < treenodes.length; i++) {

        var angle = treenodes[i].id * interval * 180 / Math.PI;
        //var angle = Math.atan2(treenodes[i].position.y-500, treenodes[i].position.x-500);

        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        text.innerHTML = treenodes[i].name;
        text.setAttribute("font-size", 11);
        text.setAttribute("font-family", "Arial");

        text.setAttribute("x", treenodes[i].position.x);
        text.setAttribute("y", treenodes[i].position.y);
        //text.setAttribute("text-anchor", "left");
        //text.setAttribute("dominant-baseline", "bottom");
        text.setAttribute("transform", "rotate(" + angle + "," + treenodes[i].position.x + "," + treenodes[i].position.y + ")");

        mySvg.appendChild(text);
    }
    
}
