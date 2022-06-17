//导入数据库操作模块
const db = require('../db/index')
//导入bcryptj对用户名进行加密
const bcrypt = require('bcryptjs')
//导入 Token 字符串包
const jwt = require('jsonwebtoken')
//导入config的文件 
const config = require('../config')
//注册用户的处理函数
exports.regUser = (req,res) => {
    //获取客户端提交到服务器的用户信息
    const userinfo = req.body
    // console.log(userinfo);
    //对表单中的数据，进行合法性的校验
    // if(!userinfo.username || !userinfo.password) {
    //     // return res.send({status: 1, message: '用户名或密码不合法!'})
    //     return res.send('用户名或密码不合法')
    // }
    //定义sql语句
    const sqlStr = 'select * from ev_users2 where username =?'
    db.query(sqlStr, [userinfo.username], function (err, results) {
        // 执行 SQL 语句失败
        if (err) {
          // return res.send({ status: 1, message: err.message })
          return res.cc(err)
        }
        // 用户名被占用
        if (results.length > 0) {
          // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
          return res.cc('用户名被占用，请更换其他用户名！')
        }
        // TODO: 用户名可用，继续后续流程...
        //对用户的密码 ， 进行bcrypt加密， 返回值是加密之后的密码字符串
        //bcrypt.hashSync(userinfo.password,10)  (明文密码，随机盐的长度)
        // console.log(userinfo);
        userinfo.password = bcrypt.hashSync(userinfo.password,10)
        // console.log(userinfo);
        //定义插入新用户的 sql 语句
        const sql = 'insert into ev_users2 set ?'
        //调用 db.query() 执行SQL 语句
        db.query(sql, {username: userinfo.username, password: userinfo.password}, (err, results) =>{
               //判断 SQL 语句是否执行成功
              //  if(err) return res.send({status: 1, message: err.message})
              if(err) return res.cc(err)
               //判断影响行数是否为 1
              //  if(results.affectedRows !== 1) return res.send({status :1 ,message: '注册用户失败，请稍后再试!'})
              if(results.affectedRows !==1) return res.cc('注册用户失败，请稍后再试!')
               //注册用户成功
              //  res.send({status: 1, message: '注册用户成功'})
              res.cc('注册用户成功')
        })
      })

}
//登陆的处理函数
exports.login = (req,res) =>{
  //1.接受表单数据
  const userinfo = req.body
  //2.定义 sql语句：
  const sql = 'select * from ev_users2 where username=?'
  //3.执行sql语句，查询用户的数据
  db.query(sql,userinfo.username,function(err,results){
    //执行语句失败
    if(err) return res.cc(err)
    //执行 sql语句成功，但是查询到数据条数不等于 1
    if(results.length !==1) return res.cc('登陆失败')
    //TODO: 判断用户输入的登录密码是否和数据库中的密码一致
    // res.send('login ok')
    //加上这个以后 ，只对加密的的密码可以使用
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    //如果对比的结果等于 false. 则证明用户输入的密码错误
    if(!compareResult) return res.cc('登陆失败!')
    // res.send('ok')
    //  TODO:登录成功过生成 Token字符串
    //剔除完毕之后， user中只保留用户的id, username, nickname, email 这四个属性的值
     const user = {...results[0], password:'', user_pic: ''}
    //  console.log(user)
    //生成Token 字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn:config.expiresIn})
    //将生成的Token 字符串响应给客户端
    res.send({
      status:0,
      message: '登陆成功!',
      //为了方便客户端使用 Tokenm ，在字符串直接拼接上Bearer 的前缀
      token :'Bearer '  +tokenStr
    })
  })

}