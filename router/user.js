const express = require('express')
const router = express.Router()

const expressJoi = require('@escook/express-joi')
const { reg_login_schema } = require('../schema/user')

const userHandler = require('../router_handler/user')
router.post('/reguser',expressJoi(reg_login_schema),userHandler.reguser)

router.post('/login',expressJoi(reg_login_schema),userHandler.login)

module.exports = router
