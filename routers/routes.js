const express = require('express')
// const multer = require('multer')
// const path = require('path')
const cors = require('cors')
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
  { name: 'cv_2_file', maxCount: 1 }, 
  { name: 'cv_3_file', maxCount: 1 }, 
])
routes.post('/getMypassword', userdashController.getMypassword)
routes.post('/fetchTable', userdashController.fetchTable)
routes.post('/fetchPaper', userdashController.fetchPaper)
routes.post('/savePaperOne', cpUpload, userdashController.savePaperOne)
routes.post('/updatePaperOne', cpUpload, userdashController.updatePaperOne)
routes.post('/savePaperGroup', cpUpload, userdashController.savePaperGroup)
routes.post('/updatePaperGroup', cpUpload, userdashController.updatePaperGroup)
routes.post('/submitPaper', userdashController.submitPaper)

//Export to index.JS
module.exports = routes