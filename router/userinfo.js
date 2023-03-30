const express = require('express')
const router = express.Router()
// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { update_userinfo_schema , update_password_schema , cansel_password_schema , update_avatar_schema } = require('../schema/user')
// 导入用户信息的处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 获取用户的基本信息
router.get('/userinfo', userinfo_handler.getUserInfo)
// 更新用户基本信息
router.post('/updateinfo',expressJoi(update_userinfo_schema),userinfo_handler.updateUserInfo)
// // 更改密码
router.post('/updatepwd', expressJoi(update_password_schema),userinfo_handler.updatePwd)
// // 更新用户头像
router.post('/update/avatar',expressJoi(update_avatar_schema),userinfo_handler.updateAvatar)
// // 注销账户
router.post('/cancel',expressJoi(cansel_password_schema), userinfo_handler.cancelUser)

module.exports = router