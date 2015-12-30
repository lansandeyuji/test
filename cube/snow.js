define('component/act-anim-snow',[],function(){
    var Browser = $.browser,
    	app ={};
    if (Browser.msie && Browser.version <= 8)
        return;
    var snow = function() {
        function r(a) {
            return a * Math.random()
        }
        function getCanvasEle() {
            return document.createElement("canvas")
        }
        function t() {
            var a;
            for (var d = 0; d < m; d++)
                a = d < m * .6 ? 0 : d < m * .8 ? 1 : d < m * .9 ? 2 : d < m * .98 ? 3 : 4, o[d] = [r(b), r(c), a]
        }
        function u() {
            var a, d, e, f;
            p += .01, d = Math.sin(p);
            for (a = 0; a < m; a++) {
                f = o[a], 
                e = Math.sin(4 * p + a), 
                f[1] += f[2] / 2 + (2 + e), 
                f[0] += 6 * (d + e / 2) / (10 / f[2]), 
                f[1] > c && (f[1] = -n, f[0] = r(b));
                if (f[0] > b || f[0] < -n)
                    d > 0 ? f[0] = -n : f[0] = b;
                o[a] = f
            }
        }
        function draw() {
            var a;
            ctx.fillStyle = l, ctx.clearRect(0, 0, b, c), ctx.beginPath();
            for (a = 0; a < m; a++)
                ctx.drawImage(i[o[a][2]], o[a][0], o[a][1]);
            ctx.fill(), u()
        }
        function resizeHandler(a) {
            b = window.innerWidth, 
            c = window.innerHeight, 
            canvas !== undefined && (canvas.width = b, canvas.height = c, m = b * c / 6e3, l = ctx.createLinearGradient(0, 0, 0, c), t())
        }
        function init() {
            window.addEventListener("resize", snow.resizeHandler, !1), 
            canvas = document.createElement("canvas"), 
            canvas.style.position = "fixed", 
            canvas.style.top = "0px", 
            canvas.style.left = "0px", 
            canvas.style.zIndex = 5e3, 
            canvas.style.pointerEvents = "none", 
            canvas.id = "canvas_snow", 
            document.body.appendChild(canvas), 
            ctx = canvas.getContext("2d"), 
            ctx.strokeStyle = "none",

            snowImg.onload = function(){
                d = getCanvasEle(), 
                e = getCanvasEle(), 
                f = getCanvasEle(), 
                g = getCanvasEle(), 
                h = getCanvasEle(), 
                i = [d, e, f, g, h], 
                // y({canvas: d,width: n * .4,height: n * .4,color: "#FFF",soft: .05}), 
                // y({canvas: e,width: n * .5,height: n * .5,color: "#FFF",soft: .05}), 
                // y({canvas: f,width: n * .6,height: n * .6,color: "#FFF",soft: .3}), 
                // y({canvas: g,width: n * .8,height: n * .8,color: "#FFF",soft: .2}), 
                // y({canvas: h,width: n,height: n,color: "#FFF",soft: .05}), 
                y({canvas: d,width: n * .4,height: 0.4,color: "#FFF",soft: .05}), 
                y({canvas: e,width: n * .5,height: 0.5,color: "#FFF",soft: .05}), 
                y({canvas: f,width: n * .6,height: 0.6,color: "#FFF",soft: .3}), 
                y({canvas: g,width: n * .8,height: 0.8,color: "#FFF",soft: .2}), 
                y({canvas: h,width: n,height: 1,color: "#FFF",soft: .05}), 

                resizeHandler(null), 
                app.snowTimer = setInterval(function() {
                    q(snow.draw)
                }, 50)
            }
        }
        function y(a) {
            var canvasEle, c, ctxWidth, ctxHeight, ctxWidCenter, ctxHeiCenter, soft, color, j;
            ctxWidth = a.width || 30;
            ctxHeight = a.height || 30;
            ctxWidCenter = ctxWidth / 2, ctxHeiCenter = ctxHeight / 2;
            color = a.color || "#FFF"; 
            soft = a.soft || 0; 
            canvasEle = a.canvas; 
            canvasEle.width = ctxWidth; 
            canvasEle.height = ctxWidth; 
            c = canvasEle.getContext("2d"); 
            c.clearRect(0, 0, ctxWidth, ctxHeight); 
            // j = c.createRadialGradient(ctxWidCenter, ctxHeiCenter, 0, ctxWidCenter, ctxHeiCenter, ctxWidCenter), //绘制一个矩形，并用放射状/圆形渐变进行填充
            // j.addColorStop(0, color), //定义一个从黑到白的渐变，作为矩形的填充样式
            // j.addColorStop(.1, color), 
            // j.addColorStop(.85, z(color, soft)), 
            // j.addColorStop(1, z(color, 0)), 
            // c.fillStyle = j, 
            // c.fillRect(0, 0, ctxWidth, ctxHeight)
            c.drawImage(snowImg, ctxWidCenter, ctxHeiCenter, snowWidth*n, snowHeight*n);
        }
        function z(a, b) {
            var c, d, e;
            return a = a.replace(/^s*#|s*$/g, ""), 
            a.length === 3 && (a = a.replace(/([0-9a-fA-F])/g, "$1$1")), 
            d = parseInt(a.substr(2, 2), 16), 
            e = parseInt(a.substr(4, 2), 16), 
            c = parseInt(a.substr(0, 2), 16), 
            "rgba(" + c + ", " + d + ", " + e + ", " + b + ")"
        }
        var b, c, d, e, f, g, h, i = [], canvas, ctx, l, m, n = 20/*width*/, o = [], p = 0, 
        q = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(a) {
                window.setTimeout(snow, 62.5)
            }
        }();

        var snowImg = new Image();
        var snowWidth = 30 , snowHeight = 28.7;
        snowImg.src = 'http://s18.mogucdn.com/p1/151214/upload_ifrdizbzhazdinrxguzdambqmeyde_300x287.png';
        return {init: init,draw: draw,resizeHandler: resizeHandler}
    }();

    (snow.init(), Browser.ie && setTimeout(function() {
        clearTimeout(app.snowTimer), $("canvas_snow").dispose()
    }, 2e3))

});
require(['component/act-anim-snow'], function(){
});
