//导入express
const express = require('express')
const joi = require('joi')
const config = require('./config')
//解析token的中间件
const { expressjwt: jwt } = require('express-jwt')


//创建实例对象
const app = express()
//封装返回信息的函数
app.use((req, res, next) => {
  //status默认为1，标识失败
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

//导入并配置cors中间件，解决跨域问题
const cors = require('cors')
app.use(cors())

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false, limit: '50mb' }))



//注册解析token的中间件
app.use(jwt({
  secret: config.jwtSecretKey,
  algorithms: ["HS256"],
}).unless({ path: [/^\/api\//] }))

//导入路由模块
//用户注册登录
const userRouter = require('./router/user')
app.use('/api', userRouter)
//获取用户基本信息
const userInfoRouter = require('./router/userinfo')
app.use('/my', userInfoRouter)
//获取文章分类
const artCateRouter = require('./router/artcate')
app.use('/my/article', artCateRouter)

//错误级别中间件
app.use((err, req, res, next) => {
  // 数据验证失败
  if (err instanceof joi.ValidationError) return res.cc(err)
  //认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份信息认证失败')
  console.log(111);
  console.log(res.cc);
  res.cc(err)
})

//启动服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007');
})