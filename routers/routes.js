const express = require('express')
const routes = express.Router()

const loginController = require('../controllers/login_controller')

routes.post('/register', loginController.register )

//Export to index.JS
module.exports = routes