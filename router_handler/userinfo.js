//导入数据库操作
const db = require('../db/index')
//导入bcrypt.compareSync 
const bcrypt = require('bcryptjs')
//获取用户基本信息的处理函数
exports.getUserInfo =(req,res)=>{
    // res.send('ok')
    //根据客户的 id,查询用户的基本消息
    //注意： 为了防止用户的密码泄露， 需要排除 password 字段
    const sql = 'select id, username ,nickname, email, user_pic from ev_users2 where id=?'
   //调用 db.query() 执行SQL 语句
   //注意： req 对象上的 user 属性， 是Token 解析成功， express-jwt 中间件帮我们挂载上去的
  db.query(sql, req.user.id,(err,results)=>{
      //1.执行 SQL语句失败
      if(err) return res.cc(err)
      //2.执行 SQL 语句成功，但是查询到的数据条数不等于 1 
      if(results.length !==1) return res.cc('获取用户信息失败')
      //3.将用户信息响应给客户端
      res.send ({
          status: 0,
          message: '获取用户基本信息成功',
          data: results[0],
      })
  })
}

//更新用户基本消息的处理函数
exports.updateUserInfo = (req, res) =>{
      //定义待执行的SQL语句
      const sql = 'update ev_users2 set ? where id=?'
      //调用 dnb.query() 执行SQL语句并传参
      db.query(sql,[req.body, req.body.id],(err,results)=>{
          //执行 Sql 语句失败
          if(err) return res.cc(err)
          //执行SQL语句成功， 但影响行数不为 1 
          if(results.affectedRows !== 1) return res.cc('修改用户基本信息失败!')
          //修改用户信息成功
          return res.cc('修改用户基本信息成功!',0)
      })
    // res.send('ok')
}
//重置密码的处理函数
exports.updatePassword = (req, res) =>{
//    res.send('ok')
//定义根据 id查询用户数据的SQL语句
const sql  ='select * from ev_users2 where id=?'
//执行SQL 语句查询用户是否存在
db.query(sql,req.user.id,(err, results) =>{
    //执行 SQL 语句失败
    if(err) return res.cc(err)
    //检查指 id 的用户是否存在
    if(results.length !==1) return res.cc('用户不存在')
    //TODO: 判断用户输入的旧密码是否正确

    // res.cc('成功')
    const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
    if(!compareResult) return res.cc('原密码错误')
    // 定义更新用户密码的 SQL 语句
const sql = `update ev_users2 set password=? where id=?`

// 对新密码进行 bcrypt 加密处理
const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

// 执行 SQL 语句，根据 id 更新用户的密码
db.query(sql, [newPwd, req.user.id], (err, results) => {
  // SQL 语句执行失败
  if (err) return res.cc(err)

  // SQL 语句执行成功，但是影响行数不等于 1
  if (results.affectedRows !== 1) return res.cc('更新密码失败！')

  // 更新密码成功
  res.cc('更新密码成功！', 0)
})
})
} 

//更新用户头像的处理函数
exports.updateAvatar = (req, res) =>{
    // res.send('ok')
    //定义更新用户头像的SQL语句
    const sql = 'update ev_users2 set user_pic=? where id=?'
    //调用 db.query() 执行SQL 语句， 更新对应用户的头像
    db.query(sql, [req.body.avatar, req.user.id], (err,results)=>{
        //执行语句失败
        if(err) return res.cc(err)
        //执行SQL 语句成功，但是影响行数不等于 1 
        if(results.affectedRows !==1) return res.cc('更新头像失败')

        //更新用户头像失败
         res.cc('更新头像成功',0)
    })
}
