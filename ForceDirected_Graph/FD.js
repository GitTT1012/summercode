window.onload=function() {

    var colors = ["#ef5b9c","#f47920","#ffd400","#7fb80e","#5c7a29","#007d65","#009ad6","#11264f","#8552a1","#596032","#46485f"],
		_width = 1000,
		_height = 500,
		_radius = 10,
		_Repulsion = 500,
		_Attraction = 0.05,
		_Centerforce = 0.01,
		links = [],
		nodes = [],
		_num = -1,
		isDrag = false,
		mySvg;

	d3.json("miserables.json", function(json) {
		var dataset;

		dataset = json;
		for(var i in dataset.nodes) {
			nodes[i] = {x: 10 + Math.random() * 980, y: 10 + Math.random() * 480, id: parseInt(dataset.nodes[i].group), w: 1};
		}
		for(var i in dataset.links) {
			links[i] = {s: dataset.links[i].source, t: dataset.links[i].target, v: dataset.links[i].value};
		}
		//layout();
		var container = d3.select("body").append("div");
		var cont = document.getElementsByTagName("div")[0];

		mySvg = container.append("svg")
						.attr({
							width: _width,
							height: _height,
						});

		var lines = mySvg.selectAll("line")
							.data(links)
							.enter()
							.append("line")
							.attr({
								x1: function(d) { return nodes[d.s].x; },
								y1: function(d) { return nodes[d.s].y; },
								x2: function(d) { return nodes[d.t].x; },
								y2: function(d) { return nodes[d.t].y; },
							});

		var circles = mySvg.selectAll("circle")
							.data(nodes)
							.enter()
							.append("circle")
							.attr({
								cx: function(d) { return d.x; },
								cy: function(d) { return d.y; },
								r: _radius,
								fill: function(d) { return colors[d.id]; },
							})
							.on("mousedown", function(d, i) {
								isDrag = true;
								_num = i;
							})
							.on("mousemove", function() {
								if(isDrag) {
									var x = d3.mouse(cont)[0],
										y = d3.mouse(cont)[1];
									if(isBountry(x, y)){
										if(_num !== -1){
											nodes[_num].x = d3.mouse(cont)[0];
											nodes[_num].y = d3.mouse(cont)[1];
											d3.select(this)
												.attr({
													cx: x,
													cy: y,
												});
										}
									} else {
										isDrag = false;
										_num = -1;
									}
								}
							})
							.on("mouseup", function() {
								if(isDrag){
									isDrag = false;
									_num = -1;
									//layout();
								}
							})
							.on("mouseout", function() {
								if(isDrag){
									isDrag = false;
									_num = -1;
									//layout();
								}
							});

		layout();
	});

	var layout = function() {
/*		
		for(var i = 0; i < _Max; i++){
			aForce();
			rForce();
			cForce();
		}
*/
		aForce();
		rForce();
		cForce();
/*
		mySvg.selectAll("line")
				.attr({
					x1: function(d) { if(d.s !== _num){ return nodes[d.s].x; } },
					y1: function(d) { if(d.s !== _num){ return nodes[d.s].y; } },
					x2: function(d) { if(d.t !== _num){ return nodes[d.t].x; } },
					y2: function(d) { if(d.t !== _num){ return nodes[d.t].y; } },
				});
		mySvg.selectAll("circle")
				.attr({
					cx: function(d, i) { if(i !== _num){ return d.x; } },
					cy: function(d, i) { if(i !== _num){ return d.y; } },
				});
*/
		mySvg.selectAll("line")
				.attr({
					x1: function(d) { return nodes[d.s].x; },
					y1: function(d) { return nodes[d.s].y; },
					x2: function(d) { return nodes[d.t].x; },
					y2: function(d) { return nodes[d.t].y; },
				});

		mySvg.selectAll("circle")
				.attr({
					cx: function(d) { return d.x; },
					cy: function(d) { return d.y; },
				});

		setTimeout(layout, 10);
	};

	var aForce = function() {
		for(var j in links){
			nodes[links[j].s].w++;
		}
		for(var j in links){
			var snode = nodes[links[j].s],
				tnode = nodes[links[j].t],
				threshold = 2 * _radius,
				dist = Dist(tnode, snode),
				force_x = 0,
				force_y = 0,
				sweight = 0;
			if(dist > threshold){
				force_x = _Attraction * (tnode.x - snode.x);
				force_y = _Attraction * (tnode.y - snode.y);
				sweight = snode.w + tnode.w;
				if(links[j].s !== _num){
					snode.x += force_x * snode.w / sweight;
					snode.y += force_y * snode.w / sweight;				
				}
				if(links[j].t !== _num){
					tnode.x -= force_x * tnode.w / sweight;
					tnode.y -= force_y * tnode.w / sweight;
				}
			}
		}
	};

	var rForce = function() {
		var threshold = 2 * _radius,
		force_x = 0,
		force_y = 0;
		for(var i in nodes){
			if(parseInt(i) === _num){
				break;
			}
			for(var j in nodes){
				if(i !== j){
					var dist = Dist(nodes[j], nodes[i]),
						temp = _Repulsion / Math.pow(dist, 3);
					force_x = temp * (nodes[i].x - nodes[j].x);
					force_y = temp * (nodes[i].y - nodes[j].y);
					nodes[i].x += force_x;
					nodes[i].y += force_y;
				}
			}
		}
	};

	var cForce = function() {
		for(var i in nodes){
			if(parseInt(i) === _num){
				break;
			}
			nodes[i].x += _Centerforce * (_width / 2 - nodes[i].x);
			nodes[i].y += _Centerforce * (_height / 2 - nodes[i].y);
		}
	};

	var Dist = function(node1, node2) {
		var dist = 0;
		dist += Math.pow((node2.x - node1.x), 2);
		dist +=	Math.pow((node2.y - node1.y), 2);
		dist = Math.sqrt(dist);
		return dist;
	}

	var isBountry = function(x, y) {
		if(x<_width){
			if(y<_height){
				return true;
			}
		}
		return false;
	};
};