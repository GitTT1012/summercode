var drawing = document.getElementById("drawing");
var context = drawing.getContext("2d");

var layers = [];
var newlayers = [];

function Layer(name, records) {
    var i;

    this.name = name;
    this.records = records;
    this.yBottom = [];      //The bottom line y position of a layer
    this.yTop = [];         //The top line y position of a layer
    this.sum = 0;           //The sum of each layer
    this.volatility = 0;
    this.onset = -1;
    this.end = 0;
    this.color = '#000';
    this.position = null;

    for (i = 0; i < records.length; i++) {
        this.sum += records[i];
        // sum is the summation of all points
        if (records[i] > 0) {
            if (this.onset == -1) {
                this.onset = i;
            } else {
                this.end = i;
            }
        }
    }
}

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
};





