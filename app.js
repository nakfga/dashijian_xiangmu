//导入 express模块
const express = require('express')
//创建 express 的服务器实例
const app = express()
const joi = require('joi')
//1.导入cors中间件
const cors = require('cors')
//将cors 注册为全局中间件
app.use(cors())
//配置解析表单数据的中间件，注意：application/x-www-form-urlencoded 这个中间件只能解析这个表单数据
 app.use(express.urlencoded({extended: false}))
 //一定要在路由之前， 封装 res.cc 函数
 app.use(function (req, res, next){
     //status 默认值为1， 表示失败的情况
     //err 的值， 可能是一个错误对象， 也可能是一个错误的描述字符串
     res.cc = function(err, status = 1) {
         res.send({
             status,
             message: err instanceof Error ? err.message : err
         })
     }
     next()
 })
 //一定要在路由之前配置 Token中间件
 //导入配置文件
 const config = require('./config')
 //解析 token 的中间件
 const expressJWT = require('express-jwt')
 //只用 .inless({path: [/^\/api/\//]}) 指定哪些接口不需要进行 Token的身份认证
 app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))

 //导入并注册用户路由模块
 const userRouter = require('./router/user')
//使路由模块变成全局中间件
app.use('/api',userRouter)

 //导入并使用个人中心的路由模块
 const userinfoRouter = require('./router/userinfo')
 //注意： 以/my开头的接口，都是有权限的接口，需要进行 Token 身份认证
 app.use ('/my', userinfoRouter)

 //导入并使用文章分类路由模块 
const artCateRouter = require('./router/artcate')

  //为了文章分类的路由挂载统一的访问前缀 /my/article
  app.use('/my/article', artCateRouter)


// 错误中间件
app.use(function (err, req, res, next) {
    // 数据验证失败
    if (err instanceof joi.ValidationError) return res.cc(err)
    //捕获身份认证失败错误
    if(err.name === 'UnauthorizedError') return res.cc('身份认证失败!')
    // 未知错误
    res.cc(err)
  })
 //用 app.listne 方法，指定端口号并启动web服务器
app.listen(3008, ()=>{
    console.log('api server running at http://127.0.0.1:3008');
})