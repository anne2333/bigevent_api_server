// 导入数据库操作模块
const db = require('../db/index')


//获取文章分类列表
exports.getArtcates = (req, res) => {
  const sql = `select * from ev_article_cate where is_delete=0 order by id asc`
  db.query(sql, (err, result) => {
    //执行sql失败
    if (err) return res.cc(err)
    res.send({
      status: 0,
      message: '获取文章分类列表成功',
      // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
      data: result
    })
  })
}
//新增文章分类列表
exports.addArticleCates = (req, res) => {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = `select * from ev_article_cate where  (name=? or alias=?) and is_delete=0 `
  db.query(sql, [req.body.name, req.body.alias], (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)
    if (result.length !== 0) return res.cc('分类名称或别名被占用，请更换后重试')
    const sql = `insert into ev_article_cate set ?`
    db.query(sql, req.body, (err, result) => {
      // SQL 语句执行失败
      if (err) return res.cc(err)

      // SQL 语句执行成功，但是影响行数不等于 1
      if (result.affectedRows !== 1) return res.cc('新增文章分类失败')

      // 新增文章分类成功
      res.cc('新增文章分类成功', 0)
    })
  })
}
//根据ID删除文章分类
exports.deleteCateById = (req, res) => {
  const sql = `update ev_article_cate set is_delete=1 where id=?`
  db.query(sql, req.params.id, (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // SQL 语句执行成功，但是影响行数不等于 1
    if (result.affectedRows !== 1) return res.cc('删除文章分类失败！')

    // 删除文章分类成功
    res.cc('删除文章分类成功！', 0)
  })
}
//根据id获取文章分类
exports.getArtCateById = (req, res) => {
  const sql = `select * from ev_article_cate where id=?`
  db.query(sql, req.params.id, (err, result) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // SQL 语句执行成功，但是没有查询到任何数据
    if (result.length !== 1) return res.cc('获取文章分类数据失败')

    // 把数据响应给客户端
    res.send({
      status: 0,
      message: '获取文章分类数据成功',
      data: result[0]
    })
  })
}

// 根据id更新文章分类的处理函数
exports.updateCateById = (req, res) => {
  // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
  const sql = `select * from ev_article_cate where Id<>? and is_delete=0 and (name=? or alias=?)`
  // 执行查重操作
  db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
    // 执行 SQL 语句失败
    if (err) return res.cc(err)

    // 分类名称 和 分类别名 都被占用
    if (results.length !== 0) return res.cc('分类名称或别名被占用，请更换后重试')
    // TODO：更新文章分类
    const sql = `update ev_article_cate set ? where Id=?`
    db.query(sql, [req.body, req.body.Id], (err, results) => {
      // 执行 SQL 语句失败
      if (err) return res.cc(err)

      // SQL 语句执行成功，但是影响行数不等于 1
      if (results.affectedRows !== 1) return res.cc('更新文章分类失败！')

      // 更新文章分类成功
      res.cc('更新文章分类成功！', 0)
    })
  })
}