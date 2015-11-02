var drawing = document.getElementById("Drawing");
var context = drawing.getContext("2d");

context.textAlign = "center";
context.textBaseline = "middle";

function Word() {

    this.cx = canvasW / 2;
    this.cy = canvasH / 2;

    this.ox = 0;
    this.oy = 0;

    this.W = 0;
    this.H = 0;

    this.cont = "Default";

    this.weight = 0;

    this.rotate = 0;

    this.data = [];

    this.Draw = function () {
        context.font = fonts[this.weight];
        context.fillStyle = colors[this.weight];
        //变换坐标系
        context.translate(this.cx, this.cy);
        context.rotate(this.rotate * angle);
        context.fillText(this.cont, 0, 0);
        //旋转回初始状态
        context.rotate(-this.rotate * angle);
        //坐标系回到初始状态
        context.translate(-this.cx, -this.cy);
    }
}

function getWordPixel(word) {

    context.font = fonts[word.weight];
    word.W = Math.round(context.measureText(word.cont).width);
    word.H = word.weight == 0 ? 6 : word.weight * 12;
    word.ox = Math.round(word.cx - word.W / 2);
    word.oy = Math.round(word.cy - word.H / 2);
    word.Draw();

    var imageDate = context.getImageData(word.ox, word.oy, word.W, word.H);

    var data = imageDate.data;
    var i = 0,
        k = 0,
        len = 0;
    for (len = data.length; i < len; i+=4) {
        if (data[i] + data[i + 1] + data[i + 2] == 0) {
            word.data[k++] = 0;
        } else {
            word.data[k++] = 1;
        }
    }
    context.clearRect(word.ox, word.oy, word.W, word.H);
}

function isCollision(word) {
    var i = 0,
        j = 0,
        k = 0;
    for (i = word.oy; i < word.oy + word.H; i++) {
        for (j = word.ox; j < word.ox + word.W; j++) {
            if (board[i][j] & word.data[k++] != 0) {
                return true;
            }
        }
    }
    return false;
}

function placeOneWord(word) {
    var i,
        j,
        k = 0;

    while (isCollision(word)) {
        var t = Math.random() < 0.5 ? -1 : 1,
            dt = -t,
            e = 4 / 3;
        context.clearRect(word.ox, word.oy, word.W, word.H);
        word.cx += e * t * Math.cos(t);
        word.cy += t * Math.sin(t);
        t = t * 0.1;
        getWordPixel(word);
    }

    for (i = word.oy, k = 0 ; i < word.oy + word.H; i++) {
        for (j = word.ox; j < word.ox + word.W; j++) {
            board[i][j] = board[i][j] | word.data[k++];
        }
    }
}

function Layout() {
    var i = 0,
    j = 0,
    k = 0;
    for (i = 0; i < canvasH; i++) {
        board[i] = [];
        for (j = 0; j < canvasW; j++) {
            board[i][j] = 0;
        }
    }
    for (var l in texts.words) {
        words[l] = new Word();
        words[l].cx = Math.round(canvasW * (Math.random() + 1) / 3);
        words[l].cy = Math.round(canvasH * (Math.random() + 1) / 3);
        words[l].cont = texts.words[l].cont;
        words[l].weight = texts.words[l].weight;
        words[l].rotate = texts.words[l].rotate;

        getWordPixel(words[l]);
        placeOneWord(words[l]);
    }
    for (var s in words) {
        words[s].Draw();
    }
}
