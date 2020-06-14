let clock = null;
let state = 0;
let speed = 8;
let level = 1
let currentScore = 0



window.onload = () => {
    const startButton = $('.start')
    startButton.onclick = start
}

// 工具封装
// 根据id来获取元素
function $(node) {
    return document.querySelector(node);
}

// 创建div, className是其类名
function creatediv(className) {
    var div = document.createElement('div');
    div.className = className;
    return div;
}

//点击开始游戏按钮 开始游戏
function start() {
    $('.start').classList.add('hidden')

    for (var i = 0; i < 4; i++) {
        createrow();
    }

    // 添加onclick事件
    $('main').onclick = function (ev) {
        ev = ev || event
        judge(ev);
    }

    // 定时器 每30毫秒调用一次move()
    clock = window.setInterval(move, 50);
}


// 判断是否点击黑块、白块
function judge(ev) {
    if (ev.target.className.indexOf('black') === -1 && ev.target.className.indexOf('cell') !== -1) {
        ev.target.parentNode.pass1 = 1; //定义属性pass1，表示此行row的白块已经被点击
    }

    if (ev.target.className.indexOf('black') !== -1) {
        //点击目标元素 类名中包含 black 说明是黑块
        ev.target.className = 'cell';
        // TODO
        ev.target.parentNode.pass = 1; //定义属性pass，表明此行row的黑块已经被点击
        score();
    }


}


// 游戏结束
function fail() {
    clearInterval(clock);
    // confirm(`你的最终得分为${currentScore}`);
    failShow()
    setTimeout(() => { reset() }, 1500)
}
function reset() {
    var con = $('#con');
    con.innerHTML = "";
    $('.start').classList.remove('hidden')
    $('#con').style.top = '-408px';
    $('#score').innerHTML = `score 0`
    speed = 8
    level = 1
    score = 0
}

// 创造一个<div class="row">并且有四个子节点<div class="cell">
function createrow() {
    var con = $('#con');
    var row = creatediv('row'); //创建div className=row
    const time = 75000 / speed
    row.style.transition = `all ${time}s linear`
    row.style.height = '150px'
    var arr = creatcell(); //定义div cell的类名,其中一个为cell black

    con.appendChild(row); // 添加row为con的子节点

    for (var i = 0; i < 4; i++) {
        row.appendChild(creatediv(arr[i])); //添加row的子节点 cell
    }

    if (con.firstChild == null) {
        con.appendChild(row);
    } else {
        con.insertBefore(row, con.firstChild);
    }
}


// 创建一个类名的数组，其中一个为cell black, 其余为cell
function creatcell() {
    var temp = ['cell', 'cell', 'cell', 'cell',];
    var i = Math.floor(Math.random() * 4);//随机产生黑块的位置 Math.random()函数参数 0~1的随机数
    temp[i] = 'cell black';
    return temp;
}

//让黑块动起来
function move() {
    let con = $('#con');
    let top = parseInt(window.getComputedStyle(con, null)['top']);

    if (speed + top > 0) {
        top = 0;
    } else {
        top += speed;
    }

    con.style.top = top + 'px';//不断移动top值，使它动起来
    over();
    if (top === 0) {
        createrow();
        con.style.top = '-150px';
        delrow();
    }
}

// 判断游戏是否结束
function over() {
    let rows = con.childNodes;
    if ((rows.length === 6) && (rows[rows.length - 1].pass !== 1)) {
        fail();
    }
    for (let i = 0; i < rows.length; i++) {
        if (rows[i].pass1 === 1) {
            fail();
        }
    }
}




// 加速函数
function speedup() {
    speed += 2;
}

//删除某行
function delrow() {
    var con = $('#con');
    if (con.childNodes.length === 7) {
        con.removeChild(con.lastChild);
    }
}

// 记分
function score() {
    currentScore += 1
    $('#score').innerHTML = `score ${currentScore}`;//修改分数
    if (currentScore % 10 === 0) {//当分数是10 的倍数时使用加速函数，越来越快
        speedup();
        levelShow()
    }
}

// 关数显示
function levelShow() {
    level += 1
    $(".level").innerHTML = `LEVEL ${level} `
    $(".level").classList.add('show')
    setTimeout(() => {
        $(".level").classList.remove('show')
    }, 1500)
}

function failShow() {
    $(".level").innerHTML = `fail`
    $(".level").classList.add('show')
    setTimeout(() => {
        $(".level").classList.remove('show')
    }, 1500)
}