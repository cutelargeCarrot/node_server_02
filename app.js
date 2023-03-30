const express = require('express')
const joi = require('joi')

const app = express()

//配置解析 `application/x-www-form-urlencoded` 格式的表单数据的中间件：
app.use(express.urlencoded({ extended: false }))
// app.use(express.json())

//res.cc函数
app.use((req,res,next) => {
    //ststus: 默认值为1，表示失败的情况
    //err 的值 可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function(err,status = 1){
        res.send({
            status,
            message:err instanceof Error ? err.message:err
        })
    }
    next()
})

//cors跨域中间件
const cors = require('cors')
app.use(cors())

//解析JSON、Raw、文本、URL-encoded格式的请求体
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// 解析 token 的中间件
const config = require('./config')  // 导入配置文件
const expressJWT = require('express-jwt')
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

/*  注意：以 /my 开头的接口，都是有权限的接口，需要进行 Token 身份认证    */
//  用户路由模块
const userRouter = require('./router/user')
app.use('/api',userRouter)

//  用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    // next(createError(404));
    res.send('404 NO FOUND')
  });

// 错误中间件
app.use(function (err, req, res, next) {
    if (err instanceof joi.ValidationError) return res.cc(err)    // 数据验证失败
    if (err.name === 'UnauthorizedError'){       //身份认证失败后的错误
        return res.send({ status:401, message:'身份认证失败'})
      }
      res.send({  status:500, message:'未知错误'})
  })

//调用 listen 方法，指定端口号并启动 web 服务器
app.listen(3007,function(){
    console.log('api sever running at http://127.0.0.1:3007')
})