<template>
 <div class="container">
     <div class="wrap">
        <div class="header">
            <div class="btn">
                <button id="start">开始</button>
                <button id="stop">停止</button>
                <button id="restart">重新开始</button>
            </div>
            <p><span class="score">50</span>分</p>
        </div>
        <div class="content">
            <canvas id="canvas" width="500" height="400" style="border:5px solid #2f0606;"></canvas>
        </div>
        <div class="footer">
            ↑ ↓ ← → 控制方向
        </div>
    </div>
 </div>
</template>

<script>
    const width = 500,height = 400;
    var data = {
            // 初始头位置
            x: 2,
            y: 2,
            size: 20, //大小
            timeout: 200, // 每隔多久刷新
        };
        var score = 0;
        var canvas,ctx,snake,food;

        /**
         * 初始化画布
         */
        function init() {
            canvas = document.getElementById('canvas');
            ctx = canvas.getContext('2d');
            snake = new Snake(data.x, data.y);
            food = new Food();
            getKey();
            draw();
            document.getElementById('start').onclick = function() {
                snake.stop();
                snake.move();
            };
            document.getElementById('stop').onclick = function() {
                snake.stop();
            };
            document.getElementById('restart').onclick = function() {
                snake.stop();
                snake = new Snake(data.x, data.y);
                food = new Food();
                score = 0;
                snake.move();
            };
            // time = setInterval(function() {
            // draw();
            // snake.move()
            // }, data.timeout)
        }

        /**
         * 按键时间
         */
        function getKey() {
            document.onkeydown = function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];
                
                if(e && e.keyCode == 38){//下
                    if (snake.direction !== 'top') {
snake.direction = 'bottom';
}
                }
                if(e && e.keyCode == 37){//左
                    if (snake.direction !== 'right') {
snake.direction = 'left';
}
                }

                if(e && e.keyCode == 39){//右
                    if (snake.direction !== 'left') {
snake.direction = 'right';
}
                }
                
                if(e && e.keyCode == 40){//上
                    if (snake.direction !== 'bottom') {
snake.direction = 'top';
}
                }
            };
        }

        /**
         * 绘图
         */
        function draw() {
            ctx.fillStyle = '#c0b4b4';
            var img = new Image();
            img.src = 'http://img0.imgtn.bdimg.com/it/u=332248981,2934284699&fm=26&gp=0.jpg';
            //图片加载完后，将其显示在canvas中
            img.onload = function(){
                ctx.drawImage(this, 0, 0,width,height);
                // context.drawImage(this, 0, 0, 1080, 980)改变图片大小到1080*980
            };
            // ctx.fillRect(0, 0, 500, 500);
            for (var i = 0; i < snake.body.length; i++) {
                ctx.save();
                ctx.translate(snake.body[i][0] * data.size, snake.body[i][1] * data.size);
                if (i === 0) {
                    ctx.fillStyle = 'DarkGreen';
                } else {
                    ctx.fillStyle = 'green';
                }
                ctx.fillRect(0, 0, data.size, data.size);
                ctx.restore();
            }
            ctx.save();
            ctx.translate(food.x * data.size, food.y * data.size);
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(data.size / 2, data.size / 2, data.size / 2, 0, Math.PI * 2, false); 
            ctx.fill();
            // ctx.fillRect(0, 0, data.size, data.size);
            // var img = new Image()
            // img.src = 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1787375589,83343043&fm=26&gp=0.jpg'
            // //图片加载完后，将其显示在canvas中
            // img.onload = function(){
            //     ctx.drawImage(0, 0,data.size, data.size)
            //     // context.drawImage(this, 0, 0, 1080, 980)改变图片大小到1080*980
            // }
            ctx.restore();
            document.getElementsByClassName('score')[0].innerHTML = score;
            requestAnimationFrame(draw);
        }

        /**
         * 创建蛇对象
         */
        function Snake(x, y) {
            this.moving = true;
            this.body = [[x, y]]; // 蛇的身体
            this.direction = 'right'; // 初始方向
            this.time = null;
            this.move = function() {
                var _this = this;
                this.time = setInterval(function () {
                    var last = [].concat(_this.body[_this.body.length - 1]);
                    for (var i = _this.body.length - 1;i >= 1;i--) {
                        _this.body[i][0] = _this.body[i - 1][0];
                        _this.body[i][1] = _this.body[i - 1][1];
                    }
                    switch (_this.direction) {
                        case 'right':
                            _this.body[0][0] += 1;
                            break;
                        case 'bottom':
                            _this.body[0][1] -= 1;
                            break;
                        case 'left':
                            _this.body[0][0] -= 1;
                            break;
                        case 'top':
                            _this.body[0][1] += 1;
                            break;
                    }
                    // 检查是否遇到食物
                    if (_this.body[0][0] === food.x && _this.body[0][1] === food.y) {
                        _this.eat(last);
                    }
                    // 检查是否遇到自己身体
                    var index = _this.body.findIndex(function(e, i) {
                        return i !== 0 && (_this.body[0][0] === e[0] && _this.body[0][1] === e[1]);
                    });
                    if (index !== -1 || (_this.body[0][0] === last[0] && _this.body[0][1] === last[1] )) {
                        alert('你撞到自己了');
                        _this.stop();
                    }
                    // 检查是否撞墙
                    if (_this.body[0][0] < 0 || _this.body[0][0] > (width / data.size - 1) || _this.body[0][1] < 0 || _this.body[0][1] > (height / data.size - 1)) {
                        alert('你撞墙了');
                        _this.stop();
                    }
                }, data.timeout);
            };
            this.eat = function(last) {
                this.body.push(last);
                score += 1;
                food = new Food();
            };
            this.stop = function() {
                clearInterval(this.time);
            };
        }

        /**
         * 食物
         */
        function Food() {
            this.x = Math.floor(Math.random() * (width / data.size));
            this.y = Math.floor(Math.random() * (height / data.size));
        }
 export default {
   name: '',
   data(){
     return {
         snake: {},
         width: width,
         height: height
     };
   },
   components: {

   },
   created() {
   },
   mounted() {
       init();
//        let canvas = document.getElementById("canvas");
//         console.log('canvas',canvas)
//         let ctx = canvas.getContext("2d")
//         ctx.fillStyle = "#c0b4b4";
//         ctx.fillRect(0, 0, 500, 300);
//         let data = new Food()
//         let snake = new Snake(data.x, data.y);
//         for (var i = 0; i< snake.body.length; i++) {
//     ctx.save()
//     ctx.translate(snake.body[i][0] * data.size, snake.body[i][1] * data.size);
//     if (i === 0) {
//         ctx.fillStyle = "DarkGreen";
//     } else {
//         ctx.fillStyle = "green";
//     }
//     ctx.fillRect(0, 0, data.size, data.size);
//     ctx.restore()
// }
// ctx.save()
// ctx.translate(food.x * data.size, food.y * data.size);
// ctx.fillStyle = "OrangeRed";
// ctx.fillRect(0, 0, data.size, data.size);
// ctx.restore()
//     document.getElementById('begin').addEventListener('click',()=>{
//         snake.move()
//     })
   },
   methods: {
   }
 };
</script>

<style type='text/scss' lang='scss' scoped>
.container{
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background: #fff;
    padding: 300px;
}
 .wrap{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        .header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 500px;
            height: 60px;
        }
        button {
            background-color: #4CAF50; /* Green */
            border: none;
            color: white;
            padding: 5px 15px;
            border-radius: 5px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
        }
</style>
