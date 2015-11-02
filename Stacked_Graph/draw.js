var t = 0.01;  //Step Length of BezierCurve Which Decides Literation Times
var ac = 1000;  //Amplifying Coefficient


function Point() {
    this.x = 0;
    this.y = 0;
}

function Draw(Layer) {
    var i,
        j = 0,
        end,
        begin,
        points = [];
    
    begin = Layer.onset - 1;
    end = Layer.end + 1;

//    context.fillStyle(Layer.color);

    for (i = begin; i < end + 1; i++) {
        points[j] = new Point();
        points[j].x = 10 + 10 * i;
        points[j].y = 505 + ac * Layer.yTop[i];
        j++;
    }
    context.moveTo(points[0].x, points[0].y);
    BezierCurve(points);
    context.stroke();

    j = 0;
    for (i--; i > begin - 1; i--) {
        points[j].x = 10 + 10 * i;
        points[j].y = 505 + ac * Layer.yBottom[i];
        j++;
    }
    BezierCurve(points);
    context.stroke();
    //context.fill();
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