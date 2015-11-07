var drawing = document.getElementById("drawing");
var context = drawing.getContext("2d");
var ac = 4000;  //Amplifying Coefficient
var layers = [];
var newlayers = [];

function Initialize() {
    d3.csv("lastfm.csv", function (dataset) {
        data = dataset;
        var records = [],
            name = "",
            i = 0,
            j = 0,
            recordsArray = 0;
        for (var key in data[0]) {
            recordsArray++;
        }
        recordsArray -= 2;

        for (i = 0; i < data.length; i++) {
            name = data[i]['name'];
            records = [];
            for (j = 0; j < recordsArray; j++) {
                records[j] = +data[i]['record' + j];
            }
            layers[i] = new Layer(name, records);
        }
        //console.log(layers[0]);
        newlayers = LayerSort(layers);
        Layout(newlayers);

        for (i = 0; i < 50; i++) {
            Draw(newlayers[i]);
        }

    })
}

function Layer(name, records) {
    var i;

    this.name = name;
    this.records = records;
    this.yBottom = [];      //The bottom line y position of a layer
    this.yTop = [];         //The top line y position of a layer
    this.onset = -1;
    this.end = 0;
    this.color = "rgba(144,144,144,0.5)";

    for (i = 0; i < records.length; i++) {
        if (records[i] > 0) {
            if (this.onset == -1) {
                this.onset = i;
            } else {
                this.end = i;
            }
        }
    }
}

function LayerSort(Layers) {
    var j = 0,
        n = Layers.length,
        newLayers = [],
        topCount = 0,
        topSum = 0,
        topList = [],
        botCount = 0,
        botSum = 0,
        botList = [],
        i = 0;

    for (i = 0; i < n; i++) {
        if (topSum < botSum) {
            topList[topCount++] = i;
            topSum += Layers[i].sum;
        } else {
            botList[botCount++] = i;
            botSum += Layers[i].sum;
        }
    }

    for (i = botCount - 1; i >= 0; i--) {
        newLayers[j++] = Layers[botList[i]];
    }
    for (i = 0; i < topCount; i++) {
        newLayers[j++] = Layers[topList[i]];
    }
    return newLayers;
}

function Layout(Layers) {
    // Set shape of baseline values(ThemeRiver Version).
    var n = Layers[0].records.length,
        m = Layers.length,
        baseline = [],
        i = 0,
        j = 0;

    // ThemeRiver is perfectly symmetrical, the baseline is 1/2 of the total height at any point
    for (i = 0; i < n; i++) {
        baseline[i] = 0;
        for (j = 0; j < m; j++) {
            baseline[i] += Layers[j].records[i];
        }
        baseline[i] *= -0.5;
    }

    for (i = 0; i < m; i++) {
        //Layers[i].yBottom = baseline;
        //这个错误纠结了很长很长时间，此表达式赋值的是引用，当baseline在之后被修改后，yBottom的值也跟着一起被修改
        //console.log(Layers[i].yBottom[Layers[i].onset]);
        for (j = 0; j < n; j++) {
            Layers[i].yBottom[j] = baseline[j];
            baseline[j] += Layers[i].records[j];
            Layers[i].yTop[j] = baseline[j];
        }
        //Layers[i].yTop = baseline;
    }
}

function Draw(Layer) {
    var i = 0,
        j = 0,
        end,
        begin,
        points = [];
    /* 此方式不正确，因为图层虽然上下对称，但是每个图层的oneset并不对称
    if (Layer.onset !== -1) {
        begin = Layer.onset - 1;
        end = Layer.end + 1;

        for (i = begin; i < end + 1; i++) {
            points[j] = new Point();
            points[j].x = 10 + 10 * i;
            points[j].y = 250 + ac * Layer.yTop[i];
            j++;
        }
        context.moveTo(points[0].x, points[0].y);
        BezierCurve(points);
        context.stroke();

        j = 0;
        for (i--; i > begin - 1; i--) {
            points[j].x = 10 + 10 * i;
            points[j].y = 250 + ac * Layer.yBottom[i];
            j++;
        }
        BezierCurve(points);
        context.stroke();
        context.fillStyle = Layer.color;
        context.fill();
    }
    */
    for (i = 0; i < 100; i++) {
        points[i] = new Point();
        points[i].x = 10 + 10 * i;
        points[i].y = 250 + ac * Layer.yTop[i];
    }
    context.moveTo(points[0].x, points[0].y);
    BezierCurve(points);
    //context.stroke();
    for (i = 99; i >= 0; i--) {
        points[j].x = 10 + 10 * i;
        points[j].y = 250 + ac * Layer.yBottom[i];
        j++;
    }
    BezierCurve(points);
    context.stroke();
    context.fillStyle = Layer.color;
    context.fill();
}

function BezierCurve(p) {
    var i;
    t = 0.01;
    for (i = 0; i < 100; i++) {
        BezierPoint(p);
        t += 0.01;
    }
}

function BezierPoint(p) {
    var x,
        y,
        i;

    var points = [];

    if (p.length == 2) {
        x = p[0].x + t * (p[1].x - p[0].x);
        y = p[0].y + t * (p[1].y - p[0].y);
        context.lineTo(x, y);
    } else {
        for (i = 0; i < p.length - 1; i++) {
            points[i] = new Point();
            points[i].x = p[i].x + t * (p[i + 1].x - p[i].x);
            points[i].y = p[i].y + t * (p[i + 1].y - p[i].y);
        }
        BezierPoint(points);
    }
}

function Point() {
    this.x = 0;
    this.y = 0;
}

