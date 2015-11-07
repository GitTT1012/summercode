var omega = 0,
    Width = 800,
    Height = 600,
    speed = 10,  //1~20即可表示速度范围，未证明
    gears = [],
    mySvg = document.getElementById("drawing");
mySvg.setAttribute("width", Width);
mySvg.setAttribute("height", Height);

function DrawGear(N, Radius, Position) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", "path"),
        cent = document.createElementNS("http://www.w3.org/2000/svg", "circle"),
        str = "M" + (Position.x + Radius) + "," + Position.y,
        alpha,
        theta,
        p = [],
        l,
        i,
        j;

    theta = 2 * Math.PI / N;
    l = Radius * Math.tan(theta / 4);

    for (i = 0; i < N; i++) {
        alpha = i * theta;
        //I use eight points to control one unit of the gear
        for (j = 0; j < 8; j++) {
            p[j] = { x: 0, y: 0 };
        }
        p[0].x = Position.x + Radius * Math.cos(alpha);
        p[0].y = Position.y + Radius * Math.sin(alpha);
        p[1].x = Position.x + Radius / Math.cos(theta / 4) * Math.cos(alpha + theta / 4);
        p[1].y = Position.y + Radius / Math.cos(theta / 4) * Math.sin(alpha + theta / 4);
        p[2].x = p[1].x + l * Math.cos(alpha + theta / 2);
        p[2].y = p[1].y + l * Math.sin(alpha + theta / 2);
        p[3].x = p[2].x + l * Math.cos(Math.PI / 6 + alpha + theta / 2);
        p[3].y = p[2].y + l * Math.sin(Math.PI / 6 + alpha + theta / 2);
        p[4].x = p[3].x + l * Math.cos(Math.PI / 2 + alpha + theta / 2);
        p[4].y = p[3].y + l * Math.sin(Math.PI / 2 + alpha + theta / 2);
        p[5].x = p[2].x - 2 * l * Math.cos(Math.PI / 2 - alpha - theta / 2);
        p[5].y = p[2].y + 2 * l * Math.sin(Math.PI / 2 - alpha - theta / 2);
        p[6].x = p[1].x - 2 * l * Math.cos(Math.PI / 2 - alpha - theta / 2);
        p[6].y = p[1].y + 2 * l * Math.sin(Math.PI / 2 - alpha - theta / 2);
        p[7].x = Position.x + Radius * Math.cos(alpha + theta);
        p[7].y = Position.y + Radius * Math.sin(alpha + theta);
        //console.log(p);
        for (j = 0; j < 8; j++) {
            str += "L" + p[j].x + "," + p[j].y;
            //console.log(p[j]);
        }
    }
    //console.log(l*1.73);
    path.setAttribute("d", str);
    path.setAttribute("stroke", "black");
    path.setAttribute("fill-opacity", "0.5");
    path.setAttribute("fill", "blue");
    cent.setAttribute("cx", Position.x);
    cent.setAttribute("cy", Position.y);
    cent.setAttribute("r", "5");
    cent.setAttribute("stroke", "black");
    cent.setAttribute("fill", "white");
    mySvg.appendChild(path);
    mySvg.appendChild(cent);
    gears.push(path);
}

function Rotate() {
    var d = 13.70;
    gears[0].setAttribute("transform", "rotate(" + (5 -omega / 5.28) + "," + Width / 2 + "," + Height / 2 + ")");
    gears[1].setAttribute("transform", "rotate(" + omega + "," + Width / 2 + "," + Height / 2 + ")");
    gears[2].setAttribute("transform", "rotate(" + (-omega / 2) + "," + (Width / 2 + (150 + d) * Math.cos(Math.PI / 6)) + "," + (Height / 2 + (150 + d) * Math.sin(Math.PI / 6)) + ")");
    gears[3].setAttribute("transform", "rotate(" + (-omega / 2) + "," + (Width / 2 - (150 + d) * Math.cos(Math.PI / 6)) + "," + (Height / 2 + (150 + d) * Math.sin(Math.PI / 6)) + ")");
    gears[4].setAttribute("transform", "rotate(" + (-omega / 2) + "," + Width / 2 + "," + (Height / 2 - 150 - d) + ")");
    //速度存在误差，累计起来将出现齿轮脱离情况，故在短时间范围内将角速度清零
    if (omega >= 360) {
        omega = 0;
    }
    omega += speed;
    setTimeout("Rotate()", 100);
}

function Layout() {
    var d = 13.70;
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", Width / 2);
    circle.setAttribute("cy", Height / 2);
    circle.setAttribute("r", "300");
    circle.setAttribute("fill-opacity", "0.8");
    circle.setAttribute("fill", "yellow");
    circle.setAttribute("stroke", "black");
    mySvg.appendChild(circle);
    DrawGear(53, 264, { x: Width / 2, y: Height / 2 });
    gears[0].setAttribute("fill-opacity", "1");
    gears[0].setAttribute("fill", "white");
    //gears[0].setAttribute("transform", "rotate(5," + Width / 2 + "," + Height / 2 + ")");
    DrawGear(10, 50, { x: Width / 2, y: Height / 2 });
    DrawGear(20, 100, { x: Width / 2 + (150 + d) * Math.cos(Math.PI / 6), y: Height / 2 + (150 + d) * Math.sin(Math.PI / 6) });
    DrawGear(20, 100, { x: Width / 2 - (150 + d) * Math.cos(Math.PI / 6), y: Height / 2 + (150 + d) * Math.sin(Math.PI / 6) });
    DrawGear(20, 100, { x: Width / 2, y: Height / 2 - (150 + d) });
    Rotate();
}