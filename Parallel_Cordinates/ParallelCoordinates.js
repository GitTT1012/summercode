var Width = 520;
var Height = 200;
var nodes = [];
var max_v = [0,0,0,0,0,0];
/*Colors with specific meaning
var colors = {
    "Dairy and Egg Products": '#ff7f0e',
    "Spices and Herbs": '#aec7e8',
    "Baby Foods": '#555',
    "Fats and Oils": '#ffbb78',
    "Poultry Products": '#d62728',
    "Soups, Sauces, and Gravies": '#98df8a',
    "Vegetables and Vegetable Products": '#2ca02c',
    "Sausages and Luncheon Meats": '#ff9896',
    "Breakfast Cereals": '#9467bd',
    "Fruits and Fruit Juices": '#c5b0d5',
    "Nut and Seed Products": '#8c564b',
    "Beverages": '#c49c94',
    "Finfish and Shellfish Products": '#e377c2',
    "Legumes and Legume Products": '#f7b6d2',
    "Baked Products": '#7f7f7f',
    "Sweets": '#c7c7c7',
    "Cereal Grains and Pasta": ' #bcbd22',
    "Fast Foods": '#dbdb8d',
    "Meals, Entrees, and Sidedishes": '#17becf',
    "Snacks": '#9edae5',
    "Ethnic Foods": '#e7ba52',
    "Restaurant Foods": '#1f77b4'
}
*/
var colors = [
"#ef5b9c",
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

var mySvg = document.getElementById("drawing");
mySvg.setAttribute("width", Width);
mySvg.setAttribute("height", Height);

function Layout() {
    d3.csv("ABBREV.csv", function(csv){
    
        data = csv;
        for (var i in data) {
            nodes[i] = new Node();

            nodes[i].name = data[i].Shrt_Desc;
            nodes[i].id = parseInt(data[i].NDB_No);

            nodes[i].water = parseInt(data[i].Water_);
            if (nodes[i].water > max_v[0]) {
                max_v[0] = nodes[i].water;
            }

            nodes[i].protein = parseInt(data[i].Protein_);
            if (nodes[i].protein > max_v[1]) {
                max_v[1] = nodes[i].protein;
            }

            nodes[i].lipid = parseInt(data[i].Lipid_Tot_);
            if (nodes[i].lipid > max_v[2]) {
                max_v[2] = nodes[i].lipid;
            }

            nodes[i].ash = parseInt(data[i].Ash_);
            if (nodes[i].ash > max_v[3]) {
                max_v[3] = nodes[i].ash;
            }

            nodes[i].carbohydrt = parseInt(data[i].Carbohydrt_);
            if (nodes[i].carbohydrt > max_v[4]) {
                max_v[4] = nodes[i].carbohydrt;
            }

            nodes[i].fiber = parseInt(data[i].Fiber_TD_);
            if (nodes[i].fiber > max_v[5]) {
                max_v[5] = nodes[i].fiber;
            }
            var n = parseInt(i) % 10;
            nodes[i].color = colors[n];
            //console.log(colors[n]);
        }

        Draw();
    });
}

function Node() {

    this.name = "default";
    this.id = 0;
    
    this.water = 0;
    this.protein = 0;
    this.lipid = 0;
    this.ash = 0;
    this.carbohydrt = 0;
    this.fiber = 0;

    this.color = "black";
}

function Draw() {
    //Draw parallel axis
    for (var i = 0; i < 6; i++) {
        var axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
        axis.setAttribute("x1", 10 + 100 * i);
        axis.setAttribute("y1", "0");
        axis.setAttribute("x2", 10 + 100 * i);
        axis.setAttribute("y1", "200");
        axis.setAttribute("stroke", "black");
        mySvg.appendChild(axis);
    }
    //Draw links of nutrients
    for (i = 0; i < nodes.length; i++) {
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        var str = "M";
        str += 10 + "," + (Height - 2 * nodes[i].water);
        str += "L" + 110 + "," + (Height - 2 * nodes[i].protein);
        str += "L" + 210 + "," + (Height - 2 * nodes[i].lipid);
        str += "L" + 310 + "," + (Height - 2 * nodes[i].ash);
        str += "L" + 410 + "," + (Height - 2 * nodes[i].carbohydrt);
        str += "L" + 510 + "," + (Height - 2 * nodes[i].fiber);
        path.setAttribute("d", str);
        //Error use path.setAttribute("fill", none);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", nodes[i].color);
        path.setAttribute("stroke-opacity", "0.4");
        mySvg.appendChild(path);
    }

}