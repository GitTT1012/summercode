var tree = {};
var row = {};
var t = 0;

var drawing = document.getElementById("context");
var ctx = drawing.getContext("2d");

/*
var ctx = document.getElementById('context');
var mySvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
mySvg.setAttribute("width", 640);
mySvg.setAttribute("height", 480);
mySvg.setAttribute("version", "1.2");// IE9+ support SVG 1.1 version
mySvg.setAttribute("baseProfile", "tiny");
mySvg.setAttribute("id", "mySvg");
ctx.appendChild(mySvg);
*/

function Initialize() {

    d3.json("flare.json", function (error, data) {
        tree = data;
        DataToTree(tree);
        SortAll(tree);
        TreeToRect(tree);
        Layout(tree);
    })
}

function DataToTree(d) {

    if (d.children !== undefined) {
        d.size = 0;
        //d.rect = new Rectangle();
        for (var i in d.children) {
            if (d.children[i].size !== undefined) {
                d.size += d.children[i].size;
            } else {
                DataToTree(d.children[i]);
                d.size += d.children[i].size;
            }
        }
        //d.rect.area = 640 * 480 * d.size / 956129;
    }
}

function TreeToRect(d){

    var i;

    d.rect = new Rectangle();
    d.rect.area = 640 * 480 * d.size / 956129;
    
    if(d.children !== undefined){

        for(i=0; i<d.children.length; i++){

            TreeToRect(d.children[i]);
        }
    }
}

function SortAll(d) {
    if (d.children !== undefined) {
        var temp,
            i,
            j,
            done = 1;
        while (done) {
            done = 0;
            for (i = 0; i < d.children.length - 1; i++) {
                if (d.children[i].size < d.children[i + 1].size) {
                    done = 1;
                    temp = d.children[i];
                    d.children[i] = d.children[i + 1];
                    d.children[i + 1] = temp;
                }
            }
        }
        for (j = 0; j < d.children.length; j++) {
            SortAll(d.children[j]);
        }
    } else {
        return;
    }
}

function Rectangle() {

    this.ox = 0;
    this.oy = 0;

    this.w = 640;
    this.h = 480;

    this.cx = 320;
    this.cy = 240;

    this.area = 307200;

}

function Layout(d) {
    
    t = 0;
    row = {};

    var j = 0;

    if (d.children !== undefined) {

        Squarify2(d, 0);

        for (j = 0; j < d.children.length; j++) {

                Layout(d.children[j]);
        }

    } else {

        Draw(d);

    }
}

function WorstRatio1(d, n) {

    var i,
        j,
        s,
        sum,
        data,
        temp,
        done = 0,
        aspects = {};

    s = 0;

    data = d;

    for (j = 0; row[j] !== undefined; j++) {
        s += row[j];
    }

    row[j] = data.children[n].rect.area;

    s += row[j];

    sum = s;

    for (j; j >= 0; j--) {

        s -= data.children[n - j].rect.area;

        if (data.rect.w <= data.rect.h) {

            data.children[n - j].rect.ox = data.rect.ox + data.rect.w * s / sum;
            data.children[n - j].rect.oy = data.rect.oy;
            data.children[n - j].rect.w = data.rect.w * data.children[n - j].rect.area / sum;
            data.children[n - j].rect.h = data.children[n - j].rect.area / data.children[n - j].rect.w;

        } else {

            data.children[n - j].rect.oy = data.rect.oy + data.rect.h * s / sum;
            data.children[n - j].rect.ox = data.rect.ox;
            data.children[n - j].rect.h = data.rect.h * d.children[n - j].rect.area / sum;
            data.children[n - j].rect.w = data.children[n - j].rect.area / data.children[n - j].rect.h;

        }
    }

    j = 0;

    for (i = 0; row[i] !== undefined; i++) {

        if (data.children[n - i].rect.w <= data.children[n - i].rect.h) {

            aspects[j++] = data.children[n - i].rect.h / data.children[n - i].rect.w;

        } else {

            aspects[j++] = data.children[n - i].rect.w / data.children[n - i].rect.h;

        }

    }

    sum -= row[j-1];

    i--;

    if (data.rect.w <= data.rect.h) {

        data.children[n - j + i].rect.ox = data.rect.ox;
        data.children[n - j + i].rect.oy = data.rect.oy;
        data.children[n - j + i].rect.w = data.rect.w * data.children[n - j + i].rect.area / sum;
        data.children[n - j + i].rect.h = data.children[n - j + i].rect.area / data.children[n - j+  i].rect.w;

    } else {

        data.children[n - j + i].rect.oy = data.rect.oy;
        data.children[n - j + i].rect.ox = data.rect.ox;
        data.children[n - j + i].rect.h = data.rect.h * d.children[n - j + i].rect.area / sum;
        data.children[n - j + i].rect.w = data.children[n - j + i].rect.area / data.children[n - j + i].rect.h;

    }

    for (i--; i > 0; i--) {

        if (data.rect.w <= data.rect.h) {

            data.children[n - j + i].rect.ox = data.children[n - j + i + 1].rect.ox + data.children[n - j + i + 1].rect.w;
            data.children[n - j + i].rect.oy = data.rect.oy;
            data.children[n - j + i].rect.w = data.rect.w * data.children[n - j + i].rect.area / sum;
            data.children[n - j + i].rect.h = data.children[n - j + i].rect.area / data.children[n - j + i].rect.w;

        } else {

            data.children[n - j + i].rect.oy = data.children[n - j + i + 1].rect.oy + data.children[n - j + i + 1].rect.h;
            data.children[n - j + i].rect.ox = data.rect.ox;
            data.children[n - j + i].rect.h = data.rect.h * d.children[n - j + i].rect.area / sum;
            data.children[n - j + i].rect.w = data.children[n - j + i].rect.area / data.children[n - j + i].rect.h;

        }
    }

    data.children[n].rect.ox = 0;
    data.children[n].rect.oy = 0;
    data.children[n].rect.w = 640;
    data.children[n].rect.h = 480;

    while (done) {

        done = 0;

        for (i = 0; i < j - 1; i++) {

            if (aspects[i] < aspects[i + 1]) {

                temp = aspects[i];
                aspects[i] = aspects[i + 1];
                aspects[i + 1] = temp;

                done = 1;
            }

        }
    }

    return aspects[0];
}

function WorstRatio2(d, n) {

    var i,
        k,
        temp,
        data,
        j = 0,
        done = 1,
        aspects = {};

    data = d;

    if (data.rect.w <= data.rect.h) {

        data.rect.oy += data.children[n - 1].rect.h;
        data.rect.h -= data.children[n - 1].rect.h;
        k = 0;

    } else {

        data.rect.ox += data.children[n - 1].rect.w;
        data.rect.w -= data.children[n - 1].rect.w;
        k = 1;

    }

    if (data.rect.w <= data.rect.h) {

        data.children[n].rect.w = data.rect.w;
        data.children[n].rect.h = data.children[n].rect.area / data.rect.w;

    } else {

        data.children[n].rect.h = data.rect.h;
        data.children[n].rect.w = data.children[n].rect.area / data.rect.h;

    }

    for (i = 0; row[i] !== undefined; i++) {

        if (d.children[n - i].rect.w <= d.children[n - i].rect.h) {

            aspects[j++] = d.children[n-i].rect.h / d.children[n-i].rect.w;

        } else {

            aspects[j++] = d.children[n - i].rect.w / d.children[n - i].rect.h;

        }

    }

    if (k == 0) {

        data.rect.oy -= data.children[n - 1].rect.h;
        data.rect.h += data.children[n - 1].rect.h;

    } else {

        data.rect.ox -= data.children[n - 1].rect.w;
        data.rect.w += data.children[n - 1].rect.w;

    }

    data.children[n].rect.w = 640;
    data.children[n].rect.h = 480;

    while (done) {

        done = 0;

        for (i = 0; i < j - 1; i++) {

            if (aspects[i] < aspects[i + 1]) {

                temp = aspects[i];
                aspects[i] = aspects[i + 1];
                aspects[i + 1] = temp;

                done = 1;
            }

        }
    }
     
    return aspects[0];

}



function Squarify2(d, num) {

    var sum,
    w1,
    w2,
    j = 0,
    s = 0;

    if (num == d.children.length) {
        return;
    }

    if (num == 0) {

        if (d.rect.w <= d.rect.h) {

            d.children[num].rect.ox = d.rect.ox;
            d.children[num].rect.oy = d.rect.oy;
            d.children[num].rect.w = d.rect.w;
            d.children[num].rect.h = d.children[num].rect.area / d.rect.w;

        } else {

            d.children[num].rect.ox = d.rect.ox;
            d.children[num].rect.oy = d.rect.oy;
            d.children[num].rect.h = d.rect.h;
            d.children[num].rect.w = d.children[num].rect.area / d.rect.h;

        }

        row[t++] = d.children[num].rect.area;
        num++;

        Squarify2(d, num);

        return;

    }

    w1 = WorstRatio1(d, num);

    w2 = WorstRatio2(d, num);

    if (w1 <= w2) {

        for (j = 0; row[j] !== undefined; j++) {
            s += row[j];
        }

        sum = s;

        for (j; j > 0; j--) {

            s -= d.children[num - j + 1].rect.area;

            if (d.rect.w <= d.rect.h) {

                d.children[num - j + 1].rect.ox = d.rect.ox + d.rect.w * s / sum;
                d.children[num - j + 1].rect.oy = d.rect.oy;
                d.children[num - j + 1].rect.w = d.rect.w * d.children[num - j + 1].rect.area / sum;
                d.children[num - j + 1].rect.h = d.children[num - j + 1].rect.area / d.children[num - j + 1].rect.w;

            } else {

                d.children[num - j + 1].rect.oy = d.rect.oy + d.rect.h * s / sum;
                d.children[num - j + 1].rect.ox = d.rect.ox;
                d.children[num - j + 1].rect.h = d.rect.h * d.children[num - j + 1].rect.area / sum;
                d.children[num - j + 1].rect.w = d.children[num - j + 1].rect.area / d.children[num - j + 1].rect.h;

            }
        }

        row[t++] = d.children[num].rect.area;
        num++;

        Squarify2(d, num);

        return;

    } else {

        if (d.rect.w <= d.rect.h) {

            d.rect.oy = d.children[num - 1].rect.oy + d.children[num - 1].rect.h;
            d.rect.h = d.rect.h - d.children[num - 1].rect.h;

        } else {
            
            d.rect.ox = d.children[num - 1].rect.ox + d.children[num - 1].rect.w;
            d.rect.w = d.rect.w - d.children[num - 1].rect.w;

        }

        if (d.rect.w <= d.rect.h) {

            d.children[num].rect.w = d.rect.w;
            d.children[num].rect.h = d.children[num].rect.area / d.rect.w;

        } else {

            d.children[num].rect.h = d.rect.h;
            d.children[num].rect.w = d.children[num].rect.area / d.rect.h;

        }

        row = {};
        t = 0;

        row[t++] = d.children[num].rect.area;

        d.children[num].rect.ox = d.rect.ox;
        d.children[num].rect.oy = d.rect.oy;

        num++;

        Squarify2(d, num);

        return;

    }
}

function Draw(p) {

    /*
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");

    rect.setAttribute("x", p.rect.ox);
    rect.setAttribute("y", p.rect.oy);
    rect.setAttribute("width", p.rect.w);
    rect.setAttribute("height", p.rect.h);
    rect.setAttribute("stroke-width", "1");
    rect.setAttribute("stroke", "black");
    rect.setAttribute("fill", "#ef5b9c");

    mySvg.appendChild(rect);
    */

    ctx.moveTo(p.rect.ox, p.rect.oy);
    ctx.lineTo(p.rect.ox + p.rect.w, p.rect.oy);
    ctx.lineTo(p.rect.ox + p.rect.w, p.rect.oy + p.rect.h);
    ctx.lineTo(p.rect.ox, p.rect.oy + p.rect.h);
    ctx.lineTo(p.rect.ox, p.rect.oy);

    ctx.stroke();
    
}