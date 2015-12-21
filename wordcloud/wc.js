( function () {
	// 创建一个canvas像素点矩阵
	var myCanvas = [],
		myBoards = [],
		wCanvas = window.screen.availWidth / 2,
		hCanvas = window.screen.availHeight - 300,
		// 读取键入文本
		myText,
		textwords,
		// 矩形螺旋相关参数
		stepLength, // 不长，stepCount为2时自增5个像素单位
		stepDirectionx, // 1表示x轴正向，0表示不移动，-1表示x轴负向
		stepDirectiony,	// 1表示y轴正向，0表示不移动，-1表示y轴负向
		stepCount, // 0表示没有初始状态，1表示移动了一步，2表示移动了两步
		// 螺旋曲线模型
		time,
		step,
		delta = Math.PI / 60,
		// 绘图变量
		myCanvas,
		context, // 获取canvas绘图上下文
		mySvg;
	
	layout();
	// 实现文字云layout
	function layout() {
		d3.json('word.json', function(error, words) {
			if(error) throw error;
			initCanvasandSvg();
			var len = words.length,
				temp;
			for(var l = 0; l < len; l++) {
				temp = Math.random();
				// 采用随机布点与spiralMove结合使用方能获得致密布局
				words[l].x = (wCanvas / 3 + 100 * temp) << 1 >> 1; 
				words[l].y = (hCanvas / 3 + 100 * temp) << 1 >> 1;
				words[l].w = 0; // 在随后的像素获取中进行初始化
				words[l].h = Math.sqrt(words[l].value) * 10;
				words[l].font = "bold " + words[l].h + "px Arial";
				placeOneWord(words[l]);
			}
			/* 布局完成后，在svg图形中绘制文字云
			mySvg.selectAll('text')
				.data(words)
				.enter()
				.append('text')
				.text(function(d) { 
					return d.text;
				})
				.attr({
					x: function(d) { return d.x; },
					y: function(d) { return d.y; },
				})
				.attr('text-anchor', 'start')
				.attr('font-family', 'Arial')
				.attr('font-size', function(d) {
					return d.h;
				});
			*/
		});
	}
	// 设置canvas画布大小并初始化myCanvas数组用于储存其像素点分布情况
	function initCanvasandSvg() {
		var i,
			j;
		myCanvas = d3.select('canvas')
			.attr({
				width: wCanvas,
				height: hCanvas,
			});
		for(i = 0; i < hCanvas; i++) {
			myCanvas[i] = [];
			for(j = 0; j < wCanvas; j++) {
				myCanvas[i][j] = 0;
			}
		}
		context = document.getElementById('myCanvas')
			.getContext('2d');
		// 设置上下文环境，设置文本基线为Top
		context.textBaseline = 'top';
		/*
		mySvg = d3.select('svg')
			.attr({
				width: wCanvas,
				height: hCanvas,
			});
		*/
		myText = document.getElementById('myText');
		myText.onchange = function() {
			var temp = myText.value,
				len,
				i,
				j,
				l;
			textwords = textIntoWords(temp);
			context.clearRect(0, 0, wCanvas, hCanvas);
			len = textwords.length;
			
			for(i = 0; i < wCanvas; i++) {
				myCanvas[i] = [];
				for(j = 0; j < hCanvas; j++) {
					myCanvas[i][j] = 0;
				}
			}
			
			for(l = 0; l < len; l++) {
				temp = Math.random();
				textwords[l].x = (wCanvas / 3 + 100 * temp) << 1 >> 1; 
				textwords[l].y = (hCanvas / 3 + 100 * temp) << 1 >> 1;
				textwords[l].w = 0; // 在随后的像素获取中进行初始化
				textwords[l].h = Math.sqrt(textwords[l].value) * 10;
				textwords[l].font = "bold " + textwords[l].h + "px Arial";
				placeOneWord(textwords[l]);
			}
		}
	}
	// 将每一个单词放置到不发生冲突的位置
	function placeOneWord(d) {
		var i,
			j,
			k;
		// 初始化螺旋参数
		time = 0;
		step = 0.05;
		// 初始化矩形螺旋移动各参数
		stepLength = 0;
		stepDirectionx = 0;
		stepDirectiony = 0;
		stepCount = 0;
		getOneWordPixel(d);		
		while(isCollision(d)) {
			spiralMove(d);
		}
		// 更新myCanvas数组
		for(k = 0, i = d.y; i < d.y + d.h; i++) {
			for(j = d.x; j < d.x + d.w; j++) {
				myCanvas[i][j] = myCanvas[i][j] | myBoards[k++];
			}
		}
		// 在Canvas画布上绘制单词
		context.fillText(d.text, d.x, d.y);
	}
	// 获得每一个单词的填充像素点
	function getOneWordPixel(d) {
		var i = 0,
			k = 0,
			len;
		myBoards = [];
		// 在另一块canvas上画出单词获得填充像素分布并用myBoard存储
		context.font = d.font;
		context.fillText(d.text, 0, 0);
		// 绘制包围单词的矩形选框并确保选框宽度为32的倍数
		d.w = (context.measureText(d.text).width >> 5 << 5) + 32;
		var data = context.getImageData(0, 0, d.w, d.h).data;
		for(len = data.length; i < len; i+=4) {
			if(data[i + 3] === 0){
				myBoards[k++] = 0;
			} else {
				myBoards[k++] = 1;
				//console.log(k);
			}
		}
		context.clearRect(0, 0, d.w, d.h);
	}
	// 检测新放置单词是否与之前放置的单词发生碰撞
	function isCollision(d) {
		var i,
			j,
			k = 0,
			a = 0,
			b = 0,
			t = 0;
		for(i = d.y; i < d.y + d.h; i++) {
			for(j = d.x; j < d.x + d.w; j+=32) {
				a = 0;
				b = 0;
				// 采用32倍压缩算法提高检测效率
				for(k = 0; k < 32; k++) {
					a += myCanvas[i][j + k] << (31 - k);
					b += myBoards[t++] << (31 - k);
				}
				if(a & b) {
					return true;
				}
			}
		}
		return false;
	}
	// 矩形螺旋
	function spiralRectMove(d) {
		var temp;
		// 位运算自增一
		++stepCount;
		temp = stepCount % 4;
		if(temp === 0) {
			stepDirectionx = 1;
			stepDirectiony = 0;
			stepLength += 5;
		}
		if(temp === 1) {
			stepDirectionx = 0;
			stepDirectiony = 1;
		}
		if(temp === 2) {
			stepDirectionx = -1;
			stepDirectiony = 0;
			stepLength += 5;
		}
		if(temp === 3) {
			stepDirectionx = 0;
			stepDirectiony = -1;
		}
		d.x += stepDirectionx * stepLength;
		d.y += stepDirectiony * stepLength;
	}
	// 曲线螺旋 
	function spiralMove(d) {
		time += 10;
		d.x += (step * time * Math.cos(time * delta)) << 1 >> 1;
		d.y += (step * time * Math.sin(time * delta)) << 1 >> 1;
	}
	// 处理读入文本from xiao xie
	function textIntoWords(str) {
 		var words =  str.replace(/[\s|\~|\`|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\||\\|\[|\]|\{|\}|\;|\:|\"|\'|\,|\¡°|\,|\¡±|¡\<|\.|\>|\/|\¡ª|\?|\t|\n]+/g, " ").split(" ");
 		console.log(words);
    	if(words[0] == "")
        	words.shift();
    	if(words[words.length - 1] == "")
        	words.pop();
    	var res = [];
    	for(var i = 0, len = words.length; i < words.length; i++){
        	var id = hasProperty(res, words[i]);
        	if(id >= 0){
            	res[id].value++;
        	}
        	else{
            	res.push({text:words[i], value:1});
        	}
    	}
    	return res.sort(function(a,b){ return b.value - a.value; });
	}
	// 遍历res对象获取相应单词的频率
	function hasProperty(arr, name){
    	for(var i = 0; i < arr.length; i++){
        	if(arr[i].text === name)
            	return i;
    	}
    	return -1;
	}

} ());