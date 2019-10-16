// 引入express
const express = require('express');
// 引入body-parser
const bodyParser = require('body-parser');
// 引入cookie-parser 用于解析cookie
const cookieParser = require('cookie-parser');
// 引入express-session
const session = require('express-session');


// 创建服务
const app = express();

// 使用express4就引入了的body-parser包解析请求体中的数据
app.use(bodyParser.urlencoded({
    extended: false
}));

// 使用cookie-parser
app.use(cookieParser());

// 配置express-session
let conf = {
    secret: '123456', //加密字符串。 使用该字符串来加密session数据，自定义
    resave: false, // 强制保存session即使它并没有变化
    saveUninitialized: false //强制将未初始化的session存储。当新建了一个session且未
    //设定属性或值时，它就处于未初始化状态。
};

// 使用express-session
app.use(session(conf));



// 方式二: 后端接口 2.CORS解决跨域问题
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// })
app.all('*', function (req, res, next) {
    // console.log(`${Date.now()}:来自${req.connection.remoteAddress} 访问了 ${req.method}-${req.url}。参数是：${req.query},携带cookie:${req.headers.cookie}`);
    res.header('Access-Control-Allow-Origin', req.headers.origin); //需要显示设置来源
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', true); //带cookies
    next();
});


// 方式二： 后端接口 1.接口设置
// 登录
// app.post('/login', (req, res) => {
//     // console.log(req.body);

//     let { username, password } = req.body;

//     if (username == 'admin' && password == 123) {
//         // 当请求成功时:  原生方法之设置cookie
//         // res.setHeader('set-cookie', 'username=admin');
//         // express自带方法设置cookie
//         res.cookie('username', 'admin');
//         res.send({
//             code: 200,
//             msg: '登录成功'
//         })
//     } else {
//         res.send({
//             code: 500,
//             msg: '登录失败！'
//         })
//     }
// })

// session 版
app.post('/login', (req, res) => {
    // console.log(req.body);

    let { username, password } = req.body;

    if (username == 'admin' && password == 123) {

        // 改造1：当请求成功时，设置session给浏览器
        req.session.username = 'admin';

        res.send({
            code: 200,
            msg: '登录成功'
        })
    } else {
        res.send({
            code: 500,
            msg: '登录失败！'
        })
    }
})


// 检查登录状态
app.get('/checkLogin', (req, res, next) => {

    console.log('------------------------------------------session----------------------------');
    console.log(req.session);

    // 改造二 判断session是否相等
    let { username } = req.session;

    console.log(username);

    if (username === 'admin') {
        res.send({ username, code: 200, msg: '已经登录' });
    } else {
        res.send({ code: 500, msg: '未登录' });
    }
})


// 退出功能      bug: 退出之后点击返回，还是显示登录状态
app.get('/logout', (req, res) => {
    //改造三  销毁session
    req.session.destroy();
    res.send({ code: 200, msg: '退出成功！' });
})


// 方式一： 后端接口
// app.get('/test', (req, res) => {

//     let param = JSON.stringify(MSG);

//     // res.send('fn(' + param + ');'); // 可行   
//     res.send(`fn({code:200,data:${param},msg:'请求成功'});`);
//     // 接收的参数必须是JSON字符串？

// })




// 监听端口
app.listen(8080, () => {
    console.log('8080: success!');
})