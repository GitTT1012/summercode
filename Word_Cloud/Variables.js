var texts = {
    "words": [
        { "cont": "accessor", "weight": 6, "rotate": 0 },
        { "cont": "ambience", "weight": 6, "rotate": 0 },
        { "cont": "animate", "weight": 5, "rotate": 0 },
        { "cont": "asynchronous", "weight": 4, "rotate": 0 },
        { "cont": "batch", "weight": 4, "rotate": 0 },
        { "cont": "clutter", "weight": 4, "rotate": 0 },
        { "cont": "configurable", "weight": 4, "rotate": 0 },
        { "cont": "depict", "weight": 3, "rotate": 0 },
        { "cont": "dispatch", "weight": 3, "rotate": 0 },
        { "cont": "genre", "weight": 3, "rotate": 0 },
        { "cont": "glyph", "weight": 3, "rotate": 0 },
        { "cont": "hiearchical", "weight": 3, "rotate": 0 },
        { "cont": "inherent", "weight": 3, "rotate": 0 },
        { "cont": "loop", "weight": 3, "rotate": 0 },
        { "cont": "nuances", "weight": 3, "rotate": 0 },
        { "cont": "paticipator", "weight": 2, "rotate": 0 },
        { "cont": "placement", "weight": 2, "rotate": 0 },
        { "cont": "quadtree", "weight": 2, "rotate": 0 },
        { "cont": "relevant", "weight": 2, "rotate": 0 },
        { "cont": "remixer", "weight": 2, "rotate": 0 },
        { "cont": "rendering", "weight": 2, "rotate": 0 },
        { "cont": "retrieve", "weight": 2, "rotate": 0 },
        { "cont": "riddle", "weight": 2, "rotate": 0 },
        { "cont": "specified", "weight": 1, "rotate": 0 },
        { "cont": "spiral", "weight": 1, "rotate": 0 },
        { "cont": "stuttering", "weight": 1, "rotate": 0 },
        { "cont": "subtler", "weight": 0, "rotate": 0 },
        { "cont": "tremendous", "weight": 0, "rotate": 0 },
        { "cont": "typography", "weight": 0, "rotate": 0 },
    ],
};

var words = [];

var canvasW = 960;
var canvasH = 720;

var board = [];

var colors = ["#ef5b9c",
"#f47920",
"#ffd400",
"#7fb80e",
"#5c7a29",
"#007d65",
"#009ad6",
"#11264f",
"#8552a1",
"#596032",
"#46485f"];

var fonts = ["bold 6px Arial",
    "bold 12px Arial",
    "bold 24px Arial",
    "bold 36px Arial",
    "bold 48px Arial",
    "bold 60px Arial",
    "bold 72px Arial"];

var angle = Math.PI / 2;