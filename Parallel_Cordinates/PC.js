window.onload = function () {
    d3.csv("ABBREV.csv", function (data) {
        var isDraw = false, //正在绘制选框
        isDrag = false, //正在移动选框
        isStop = false, //停止绘制曲线
        _yScale = [],   //y轴映射函数
        _yAxis = [],    //记录y坐标轴位置
        _rects = [],    //已存在的选框
        _lines = [],    //已绘制好的线条
        _yPosition,     //记录全局鼠标y值
        _Padding = 10,  //决定选框宽度
        _rect,          //正在画的选框
        _timeId,        //clearTimeout
        _order = 0,     //第几批次
        _num = 0,       //正在拖曳的矩形选框
        _width = 1000,  //svg宽度
        _height = 250,  //svg长度
        _dataset = data;

        cont = document.getElementById("container");
        //每个y坐标轴的最大值
        var MaxValues = [100, 902, 90, 100, 100, 100, 80, 100, 8000, 130];
        //初始化各个数组
        for (i = 0; i < 10; i++) {
            _yAxis[i] = 50 + i * 100;
            _rects[i] = { "id": false, "y1": 20, "y2": 220 };
        }
        //绘制mySvg
        var mySvg = d3.select("div")
                        .append("svg")
                        .attr({
                            width: _width,
                            height: _height,
                        });
        //画出十个平行坐标
        for (var i = 0; i < 10; i++) {
            _yScale[i] = d3.scale.linear()
                            .domain([0, MaxValues[i]])
                            .range([220, 20]);
            var yAxis = d3.svg.axis()
                            .scale(_yScale[i])
                            .orient("left");
            mySvg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + _yAxis[i] + ", 0)")
                .call(yAxis);
        };
        //
        mySvg.on("mousedown", function () {
            if (isBoundry(d3.event)) {
                //第一时间停止画线并且移除所有已存在数据
                var l = _lines.length;
                isStop = true;
                clearTimeout(_timeId);
                if (l !== 0) {
                    for (var j = 0; j < l; j++) {
                        _lines[j].remove();
                    }
                    _lines = [];
                }

                if (!isDrag) {
                    //注意clientX返回的坐标值与svg上不一致，使用D3提供的方法简化了很多运算
                    var x = d3.mouse(cont)[0],
                        y = d3.mouse(cont)[1],
                        num = 0,
                        temp = {};
                    isDraw = true;
                    num = GetNum(d3.event);
                    //每个坐标轴只允许画一个选框
                    if (_rects[num].id) {
                        _rects[num].r.remove();
                        _rects[num] = {};
                    }
                    _rect = mySvg.append("rect")
                                .attr({
                                    x: _yAxis[num] - _Padding,
                                    y: y,
                                    width: 2 * _Padding,
                                    height: 0,
                                    stroke: "rgb(144, 144, 144)",
                                    fill: "rgba(144, 144, 144, 0.2)",
                                });
                    temp = { "id": true, "y1": y, "y2": y, "r": _rect };
                    _rects[num] = temp;
                    _yPosition = y;
                }
                //添加矩形事件监听器
                _rect.on("mousedown", function () {
                    //绘制选框与移动选框不能同时存在
                    isDraw = false;
                    isDrag = true;
                    _num = GetNum(d3.event);
                    _yPosition = d3.mouse(cont)[1];
                });
                _rect.on("mousemove", function () {
                    if (isDrag) {
                        var y = d3.mouse(cont)[1],
                            dist = y - _yPosition;
                        console.log(_num);
                        //tranlate方法是从y值移动，这样子设置会导致回弹情况
                        //d3.select(this).attr("transform", "translate(0, " + dist + ")");
                        //越界情况
                        if (_rects[_num].y1 + dist >= 20 && _rects[_num].y2 + dist <= 220) {
                            d3.select(this).attr("y", (_rects[_num].y1 + dist));
                        } else {
                            isDrag = false;
                            isStop = false;
                            DrawLines();
                            if (dist < 0) {
                                _rects[_num].y2 += (20 - _rects[_num].y1);
                                _rects[_num].y1 = 20;
                            } else {
                                _rects[_num].y1 += (220 - _rects[_num].y2);
                                _rects[_num].y2 = 220;
                            }
                            //console.log(false);
                        }
                    }
                });
                _rect.on("mouseout", function () {
                    if (isDrag) {
                        isDrag = false;
                        var y = d3.mouse(cont)[1],
                            dist = y - _yPosition;
                        //越界情况
                        if (_rects[_num].y1 + dist >= 20 && _rects[_num].y2 + dist <= 220) {
                            _rects[_num].y1 += dist;
                            _rects[_num].y2 += dist;
                        } else {
                            if (dist < 0) {
                                _rects[_num].y2 += (20 - _rects[_num].y1);
                                _rects[_num].y1 = 20;
                            } else {
                                _rects[_num].y1 += (220 - _rects[_num].y2);
                                _rects[_num].y2 = 220;
                            }
                        }
                        d3.select(this).attr("y", _rects[_num].y1);
                        isStop = false;
                        DrawLines();
                    }
                });
                _rect.on("mouseup", function () {
                    if (isDrag) {
                        var y = d3.mouse(cont)[1],
                            dist = y - _yPosition;
                        //越界情况
                        if (_rects[_num].y1 + dist >= 20 && _rects[_num].y2 + dist <= 220) {
                            _rects[_num].y1 += dist;
                            _rects[_num].y2 += dist;
                        } else {
                            if (dist < 0) {
                                _rects[_num].y2 += (20 - _rects[_num].y1);
                                _rects[_num].y1 = 20;
                            } else {
                                _rects[_num].y1 += (220 - _rects[_num].y2);
                                _rects[_num].y2 = 220;
                            }
                        }
                        d3.select(this).attr("y", _rects[_num].y1);
                    }
                });
            }
        });

        mySvg.on("mousemove", function () {
            if (isDraw) {
                if (isBoundry(d3.event)) {
                    var y = d3.mouse(cont)[1],
                        h = y - _yPosition,
                        num = GetNum(d3.event);

                    if (h < 0) {
                        _rect.attr("y", y);
                        _rect.attr("height", -h);
                        _rects[num].y1 = y;
                    } else {
                        _rect.attr("height", h);
                        _rects[num].y2 = y;
                    }
                } else {
                    isDraw = false;
                    isStop = false;
                    DrawLines();
                }
            }
            //更新完矩形选框后，更新数据线

        });

        mySvg.on("mouseup", function () {
            if (isDraw) {
                isDraw = false;
            }
            if (isDrag) {
                isDrag = false;
            }
            if (isBoundry(d3.event)) {
                isStop = false;
                DrawLines();
            }
        });

        DrawLines();

        function DrawLines() {
            var rate = 1000,
                queuen = [],
                points = [];
            _order = 0;
            doFrame();

            function doFrame() {
                if (!isStop) {
                    rate = 100;
                    for (var j = 0; j < rate; j++) {
                        queuen[j] = _dataset[_order + j];
                    }
                    _order += rate;
                    var lineFunc = d3.svg.line()
                                        .x(function (d) { return d.x; })
                                        .y(function (d) { return d.y; })
                                        .interpolate("linear");

                    for (var j = 0; j < rate; j++) {
                        if (isWindow(queuen[j])) {
                            var path = mySvg.append("path")
                                    .attr("d", lineFunc(points))
                                    .attr("stroke", "blue")
                                    .attr("stroke-width", 2)
                                    .attr("stroke-opacity", 0.2)
                                    .attr("fill", "none");
                            _lines.push(path);
                        }
                    }
                    _timeId = setTimeout(doFrame, 100);
                }
            }

            function isWindow(d) {
                var k = -2;
                for (var s in d) {
                    if (k > -1 && k < 10) {
                        points[k] = {};
                        points[k].x = _yAxis[k];
                        if(d[s]){
                            points[k].y = _yScale[k](parseInt(d[s]));
                        } else {
                            points[k].y = 0;
                        }
                    } else if (k === 10) {
                        break;
                    }
                    k++;
                }
                for (k = 0; k < 10; k++) {
                    if (points[k].y < _rects[k].y1 || points[k].y > _rects[k].y2) {
                        return false;
                    }
                }
                return true;
            }
        }

        function isBoundry(e) {
            var x = e.clientX - 10,
                y = e.clientY - 10;
            if (y <= 220 && y >= 20) {
                for (var j = 0; j < 10; j++) {
                    if (x >= _yAxis[j] - _Padding && x <= _yAxis[j] + _Padding) {
                        return true;
                    }
                }
            }
            return false;
        }

        function GetNum(e) {
            var x = e.clientX - 10;
            for (var j = 0; j < 10; j++) {
                if (x >= _yAxis[j] - _Padding && x <= _yAxis[j] + _Padding) {
                    return j;
                }
            }
            return -1;
        }
    });
}