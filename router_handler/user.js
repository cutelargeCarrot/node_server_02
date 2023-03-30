const db = require('../db/index')
const bcrypt = require('bcryptjs')  // 加密
const jwt = require('jsonwebtoken')
const config = require('../config')
const { expiresIn } = require('../config')
// 注册
exports.reguser = (req,res) => {
    const userInfo = req.body
    const sql = `SELECT * FROM users WHERE username=?`
    db.query(sql,[userInfo.username],(err,results)=>{
        if(err) return res.cc(err)
        if(results.length>0) return res.cc('用户名被占用')
        //
        userInfo.password = bcrypt.hashSync(userInfo.password,10)
        const sql = `INSERT INTO users SET ?`
        db.query(sql,{username:userInfo.username,password:userInfo.password},(err,results)=>{
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('注册失败，请稍后重试')
            res.send({state:0,message:'注册成功'})
        })
    })
}

// 登录
exports.login = (req,res) => {
    const userInfo = req.body
    sql = `SELECT * FROM users WHERE username=?  AND state=0`
    db.query(sql,[userInfo.username],(err,results)=>{
        if(err) return res.cc(err)
        if(results.length !== 1) return res.cc('登陆失败')
        const comparePwd = bcrypt.compareSync(userInfo.password,results[0].password)
        if(!comparePwd) return res.cc('用户名或密码错误')
        // 登陆成功 处理Token
        const user = { ...results[0],password:'',user_pic:''}
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})

        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
            // data: req.auth
        })
    })
}