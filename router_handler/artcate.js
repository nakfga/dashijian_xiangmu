//    导入数据库操作模块
   const db = require('../db/index')
  
  
//   创建 路由处理函数模块，并初始化
//  获取文章分类表数据的处理函数
  exports.getArticleCates = (req, res) =>{
      // res.send('ok')
     
    // 根据分类的状态，获取所有未被删除的分类列表数据
    // is_delete 为0 表示没有 标记为删除 的数据
    const sql = 'select * from ev_artide_cate where is_delete =0 order by id asc'
      //调用db.query() 执行SQL语句
      db.query(sql, (err, results)=>{
          //执行 SQL 语句失败
          if(err) return res.cc(err)

          //执行SQL 语句成功
          res.send({
              status:0,
              message : '获取文章分类列表成功!',
              data: results,
          })
          // res.send('ok')
      })
  }

  //新增文章分类的处理函数
  exports.addArticleCates = (req,res) =>{
    // res.send('ok')
        //定义查询 分类名称 与 分类别名 是否被占用 SQL 语句
        const sqlStr = 'select * from ev_artide_cate where name=? or alias=?'
        //调用 db.query()执行查重的操作
        db.query(sqlStr,[req.body.name, req.body.alias], (err, results)=>{
        //执行 SQL 语句失败
        if(err) return res.cc(err)
        
         //分类名称 和  分类别名被都占用
          if(results.length ===2) return res.cc('分类名称与别名都被占用，请更换后重试！')
           if(results.length ===1 && results[0].name ===req.body.name && results[0].alias === req.body.alias)  return res.cc('分类名称与分类别名都被占用，请稍后重试')
           if(results.length ===1 && results[0].name ===req.body.name) return res.cc('分类名称被占用，请更行后重试')
           if(results.length ===1 && results[0].alias ===req.body.alias) return res.cc('分类别名被占用， 请更新后重试')
           //TODO: 新增文章分类    //定义新增文章分类的 SQL语句
          const sql = 'insert into ev_artide_cate set?'
          //调用 db.query执行新增文章分类的Sql 语句：
          db.query(sql, req.body,(err,results)=>{
            //SQL 语句执行失败
            if(err) return res.cc(err)
            //Sql 语句执行成功，但是影响到行数不等于 l
            if(results.affectedRows !==1) return res.cc('新增文章分类失败')

            // //新增文章分类成功
            res.cc('新增文章分类成功',0)
          }) 

        })

  }

  //删除文章分类的处理函数
  exports.deleteCateById = (req, res)=>{
    // res.send('ok')
    //定义删除文章分类的SQL 语句  只是标记删除
    const sql = 'update ev_artide_cate set is_delete=1 where id=?'
   // 调用 db.query() 执行删除文章分类的SQL 语句
   db.query(sql,req.params.id,(err,results)=>{
     //执行失败
     if(err) return res.cc(err)
     //执行语句成功， 但是影响行数不等于 1
     if(results.affectedRows !==1) return res.cc('删除文章分类失败!')

     //删除文章成功
     res.cc('删除文章分类成功！',0)
   })
  }
  

  //根据 Id 获取文章分类的处理函数
  exports.getArtCateById = (req, res) =>{
    // res.send('ok')
    //定义根据id 获取文章分类的SQL 语句
    const sql = 'select * from ev_artide_cate where id=?'
    //调用db.query()执行 SQL语句
    db.query(sql,req.params.id, (err,results)=>{
      //执行SQL语句失败
      if(err) return res.cc(err)
      //SQL 语句执行成功， 但是没有查询到任何数据
      if(results.length !==1) return res.cc('获取文章分类数据失败！')

      //把数据响应给客户端
      res.send({
        status: 0,
        message:'获取文章分类数据成功!',
        data: results[0]
      })
    })

  }
  
  //更新文章分类的处理函数
  exports.updateCateById = (req, res)=>{
    // res.send('ok')
    //定义查询 分类名称 与 分类别名 是否被占用的SQL 语句
    const sql = 'select * from ev_artide_cate where Id<>? and(name=? or alias=?)'
     //执行 db.query()执行查重的操作
     db.query(sql,[req.body.Id, req.body.name, req.body.alisa], (err, results)=>{
       //执行Sql 语句失败
       if(err) return res.cc(err)
       //分类名称 和 分类别名 都被占用
       if(results.length ===2) return res.cc('分类名称与别名被占用，请更新后重试')
       if(results.length ===1 &&reslults[0].name ===req.body.name && results[0].alias ===req.body.alisa)
       return res.cc('分类名称与别名都被占用，请更新后重试!')
        //分类名称被占用 
        if(results.length ===1 &&results[0].name ===req.body.name)
        return res.cc('分类名称被占用!')
        //分类别名被占用
        if(results.length ===1 &&results[0].alisa ===req.body.alias)
        return res.cc('分类别名被占用!')

        //TODO: 更新文章
        const sqlStr = 'update ev_artide_cate set ? where Id=?'
        //调用 db.query() 执行语句
        db.query(sqlStr,[req.body, req.body.Id], (err, results)=>{
          //执行语句失败 
          if(err) return res.cc(err)
          //执行SQL 语句成功， 但是影响行数不等于 1 
          if(results.affectedRows !==1) return res.cc('更新文章分类失败!')

          //更新文章分类成功 
          res.cc('更新文章成功!',0)
        })
     })
  }