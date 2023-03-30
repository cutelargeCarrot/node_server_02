const db = require('../db/index')
const bcrypt = require('bcryptjs')

//查询
exports.getUserInfo = (req,res)=>{
    const sql = `SELECT id,username,nickname,email,user_pic FROM users WHERE id=?  AND state=0`
    db.query(sql,[req.user.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('获取用户信息失败')
        res.send({
            status:0,
            message:'获取用户信息成功',
            data:results[0]
        })
    })
}
//信息更改
exports.updateUserInfo = (req,res) =>{
    const sql = `UPDATE users SET ? WHERE id=?`
    db.query(sql,[req.body,req.user.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('修改用户数据失败')
        return res.cc('修改数据成功',0)
    })
}
//密码更改
exports.updatePwd = (req,res) => {
    const sql = `SELECT * FROM users WHERE id=? AND state=0`
    db.query(sql,req.user.id,(err,results)=>{
        if(err) return res.cc(err)
        if(results.length != 1 ) return res.cc('用户不存在')
        //密码校验
        const compareResult = bcrypt.compareSync(req.body.oldPwd,results[0].password)
        if (!compareResult) return res.cc('原密码错误！')

        const sql = `UPDATE users SET password=? WHERE id=?`

        // 对新密码进行 bcrypt 加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        // 更新用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) return res.cc('更新密码失败！')
        res.cc('更新密码成功！', 0)
        })
    })
}
// 更新头像
exports.updateAvatar = (req,res)=>{
    const sql = `UPDATE ev_users SET user_pic=? WHERE id=?`
    db.query(sql,[req.body.avatar,req.user.id],(err,results)=>{
      if(err) return res.cc(err)
      if(results.affectedRows !== 1)return res.cc("更新头像失败")
      return res.cc('更新头像成功',0)
    })
  }

//注销账户
exports.cancelUser = (req,res) => {
    const sql = `SELECT * FROM users WHERE id=?`
    db.query(sql,[req.user.id],(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('用户不存在')
        const comparePwd = bcrypt.compareSync(req.body.canselPwd,results[0].password)
        if( !comparePwd ) return res.cc('密码错误')
        const sql = `DELETE FROM users WHERE id=?`
        db.query(sql,req.user.id,(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('注销失败')
            res.cc('注销成功',0)
        })
    })
}
