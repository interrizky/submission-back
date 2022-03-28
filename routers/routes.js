const express = require('express')
const routes = express.Router()

const loginController = require('../controllers/login_controller')

routes.post('/register', loginController.register)
routes.post('/auth', loginController.auth)
routes.post('/verify', loginController.verify)
routes.post('/checkmail', loginController.checkmail)
routes.post('/forgotpwd', loginController.forgotpwd)
routes.post('/sendcode', loginController.sendcode)

//Export to index.JS
module.exports = routes