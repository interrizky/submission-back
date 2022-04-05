const express = require('express')
const multer = require('multer')
const path = require('path')
const routes = express.Router()

const { upload } = require('../helpers/upload_helper');

const loginController = require('../controllers/login_controller')
const userdashController = require('../controllers/userdash_controller')

/* login API */
routes.post('/register', loginController.register)
routes.post('/auth', loginController.auth)
routes.post('/verify', loginController.verify)
routes.post('/checkmail', loginController.checkmail)
routes.post('/forgotpwd', loginController.forgotpwd)
routes.post('/sendcode', loginController.sendcode)

/* user API */
const cpUpload = upload.fields([
  { name: 'paper_file', maxCount: 1 }, 
  { name: 'cv_file', maxCount: 1 }, 
  { name: 'pernyataan_file', maxCount: 1 },
  { name: 'lampiran_file', maxCount: 1 },
  { name: 'cv_file_2', maxCount: 1 }, 
  { name: 'cv_file_3', maxCount: 1 }, 
])
routes.post('/savethepaper', cpUpload, userdashController.savethepaper)

//Export to index.JS
module.exports = routes