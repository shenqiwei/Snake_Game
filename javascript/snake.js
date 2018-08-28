// 初始化时间周期
let time = 50;
// 执行对象
let time_object;
// 初始化时间等级
let time_level = 1;
// 初始化方向变量
let direction = "up";
// 初始化积分变量
let integral = 0;
// 初始化等级
let level = 0;
// 升级差数
let condition = 10;
// 初始化长度变量
let body = 30;
// 初始坐标
let xy = [200,190];
// 初始蛇参数
let snakes = Array();
// 初始化面包屑数量
let bread_mun = 9;
// 初始化面包屑
let bread = Array();
// 初始化移动速度
let speed = 1;
// 初始化暂停变量
let pause_status = false;
//  初始化效果变量
let pause_display = true;
// 初始化计时模块变量
let pause_display_time = 0;
// 初始化游戏停止状态
let stop_status = true;
// 贪吃蛇做函数
function main()
{
    if(pause_status && stop_status){
        if(integral > 10) level = Math.floor(integral/condition)+1;
        time = (50 - level*5 > 1)?50 - level*5:1;
        if(level > 1) bread_mun = level+9;
        if(level > 10) level = 10;
        // 监听键盘对象
        document.onkeydown=function(event){
            if(event.keyCode > 0){
                if(keyBoard[event.keyCode] === 'up'){
                    if(direction === "up") direction = "left";
                    else if(direction === "down") direction = "right";
                    else direction = "up";
                }else if(keyBoard[event.keyCode] === 'down'){
                    if(direction === "up") direction = "right";
                    else if(direction === "down") direction = "left";
                    else direction = "down";
                }else if(keyBoard[event.keyCode] === 'left'){
                    if(direction === "left") direction = "down";
                    else if(direction === "right") direction = "up";
                    else direction = "left";
                }else{
                    if(direction === "left") direction = "up";
                    else if(direction === "right") direction = "down";
                    else direction = "right";
                }
            }
        };
        // 初始化蛇关键坐标
        if(snakes.length === 0){
            for(let s = 0;s < body;s++){
                snakes.push({"x":xy[0],"y":(xy[1]+s)});
            }
        }
        snake(); // 调用蛇行为函数
        if(level > time_level){
            clearInterval(time_object);
            time_level = level;
            running(time);
        }
    }else{
        if(!pause_status){
            if(pause_display_time > 20) pause_display_time = 0;
            if(pause_display){
                if(pause_display_time <= 10){
                    document.getElementById("pause").innerText = "PAUSE";
                    pause_display = false;

                }
            }else{
                if(pause_display_time > 10) {
                    document.getElementById("pause").innerText = null;
                    pause_display = true;
                }
                pause_display_time +=1;

            }
            pause_display_time +=1;
        }
    }
}

// 面包屑
function breadcrumb()
{
    if(bread.length < bread_mun){
        let count =  bread_mun - bread.length;
        for(let i = 0;i < count;i++){
            let x = 40*Math.round(Math.random()*10);
            if(x === 0) x += 30;
            if(x === 400) x -= 30;
            let y = 40*Math.round(Math.random()* 10);
            if(y === 0) y += 30;
            if(y === 400) y -= 30;
            let point = Math.round(Math.random()*10);
            let grade = 0;
            if(point >= 5 && point < 8){
                grade = 2;
            }else if(point >= 5){
                grade = 3;
            }else{
                grade = 1;
            }
            bread.push({"x":x,"y":y,"point":point,"grade":grade});
        }
    }
    // console.log(bread);
    let breadcrumb = "";
    for(let i = 0;i < bread.length;i++){
        if(bread[i]["point"] >= 5 && bread[i]["point"] < 8){
            breadcrumb += "<div class='greed_breadcrumb' style='left:"+bread[i]["x"]+"px;top:"+bread[i]["y"]+"px;'></div>"
        }else if(bread[i]["point"] >= 5){
            breadcrumb += "<div class='red_breadcrumb' style='left:"+bread[i]["x"]+"px;top:"+bread[i]["y"]+"px;'></div>"
        }else{
            breadcrumb += "<div class='breadcrumb' style='left:"+bread[i]["x"]+"px;top:"+bread[i]["y"]+"px;'></div>"
        }
    }
    document.getElementById("bread").innerHTML = breadcrumb;
}
// 长个
function grow(xy)
{
    let status = false;
    let grow = Array();
    let x = xy[0],y = xy[1];
    grow.push({"x":x,"y":y});
    for(let i = 0;i < grow.length;i++){
        for(let j = 0;j < bread.length;j++){
            for(let c = -3;c < 5;c++){
                for(let l = -3;l < 5;l++){
                    if(bread[j]["x"]+c === grow[i]["x"] &&  bread[j]["y"]+l === grow[i]["y"]){
                        let num = bread[j]["grade"];
                        let last_first = snakes[body-1];
                        let last_second = snakes[body-2];
                        if(last_first["x"] > last_second["x"]){
                            for(let n = 0;n < num;n++){
                                snakes.push({"x":last_first[x]+n,"y":last_first[y]})
                            }
                        }
                        if(last_first["x"] < last_second["x"]){
                            for(let n = 0;n < num;n++){
                                snakes.push({"x":last_first[x]-n,"y":last_first[y]})
                            }
                        }
                        if(last_first["y"] > last_second["y"]){
                            for(let n = 0;n < num;n++){
                                snakes.push({"x":last_first[x],"y":last_first[y]+n})
                            }
                        }
                        if(last_first["y"] < last_second["y"]){
                            for(let n = 0;n < num;n++){
                                snakes.push({"x":last_first[x],"y":last_first[y]-n})
                            }
                        }
                        integral += num;
                        status = true;
                        bread.splice(j,1);
                        break;
                    }
                }
                if(status) break;
            }
            if(status) break;
        }
        if(status) break;
    }
}
// 蛇
function snake()
{
    breadcrumb(); // 调用面包屑函数
    grow(xy);
    let x = xy[0],y = xy[1];
    // 设置游戏停止界限
    let snake_body = "";
    if(direction === "up"){
        xy[1] -= speed; // 向上移动
        for(let i = 0;i < speed;i++){
            snakes.pop();
            snakes.unshift({"x":x,"y":y-i});
        }
    }else if(direction === "down"){
        xy[1] += speed; // 向下移动
        for(let i = 0;i < speed;i++){
            snakes.pop();
            snakes.unshift({"x":x,"y":y+i});
        }
    }else if(direction === "left"){
        xy[0] -= speed; // 向左移动
        for(let i = 0;i < speed;i++){
            snakes.pop();
            snakes.unshift({"x":x-i,"y":y});
        }
    }else{
        xy[0] += speed; // 向右移动
        for(let i = 0;i < speed;i++){
            snakes.pop();
            snakes.unshift({"x":x+i,"y":y});
        }
    }
    for(let i = 0;i < snakes.length;i++){
        let id = "snake";
        if(i > 0){
            id = id+i;
        }
        let snake_class = "active";
        if(i === 0){
            snake_class = "active_head";
        }else if(i === (snake.length-1)){
            snake_class = "active_tail";
        }
        snake_body += "<div class='"+snake_class+"' id='"+id+"' style='left:"+snakes[i]["x"]+"px;top:"+snakes[i]["y"]+"px;'></div>";

    }
    document.getElementById("point").innerText = "X:"+xy[0]+",Y:"+xy[1];
    document.getElementById("direction").innerText = direction;
    document.getElementById("goal").innerText = integral.toString();
    document.getElementById("zone").innerHTML = snake_body;
    if(x >= 397 || x <= -1 || y >= 397 || y <= -1){
        stop_status = false;
        document.getElementById("over").style.display = "block";
    }
}

function pause()
{
    pause_status = false;
    document.getElementById("pause").style.display = "block";
}

function start()
{
    if(!stop_status){
        reset();
        stop_status = true;
        document.getElementById("over").style.display = "none";
        clearInterval(time_object);
        running(time);
    }
    if(!pause_status){
        pause_status = true;
        document.getElementById("pause").style.display = "none";
    }
}

function reset()
{
    pause_status = false;
    document.getElementById("pause").style.display = "none";
    time = 50;
    direction = "up";
    condition = 10;
    integral = 0;
    level = time_level = 1;
    xy = [200,190];
    snakes = Array();
    body = 30;
    document.getElementById("over").style.display = "none";
}

function stop()
{
    if(stop_status){
        if(confirm("确定结束游戏？")){
            pause_status = true;
            document.getElementById("pause").style.display = "none";
            stop_status = false;
            document.getElementById("over").style.display = "block";
        }
    }
}

function running(period=50){
    time_object = setInterval("main()",period);
}