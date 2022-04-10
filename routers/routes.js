const express = require('express')
// const multer = require('multer')
// const path = require('path')
const cors = require('cors')
const routes = express.Router()

const { upload } = require('../helpers/upload_helper');

const loginController = require('../controllers/login_controller')
const userdashController = require('../controllers/userdash_controller')

/* login API */
routes.post('/register', cors(), loginController.register)
routes.post('/auth', cors(), loginController.auth)
routes.post('/verify', cors(), loginController.verify)
routes.post('/checkmail', cors(), loginController.checkmail)
routes.post('/forgotpwd', cors(), loginController.forgotpwd)
routes.post('/sendcode', cors(), loginController.sendcode)

/* user API */
const cpUpload = upload.fields([
  { name: 'paper_file', maxCount: 1 }, 
  { name: 'cv_file', maxCount: 1 }, 
  { name: 'pernyataan_file', maxCount: 1 },
  { name: 'lampiran_file', maxCount: 1 },
  { name: 'cv_2_file', maxCount: 1 }, 
  { name: 'cv_3_file', maxCount: 1 }, 
])
routes.post('/getMypassword', cors(), userdashController.getMypassword)
routes.post('/fetchTable', cors(), userdashController.fetchTable)
routes.post('/fetchPaper', cors(), userdashController.fetchPaper)
routes.post('/savePaperOne', cors(), cpUpload, userdashController.savePaperOne)
routes.post('/updatePaperOne', cors(), cpUpload, userdashController.updatePaperOne)
routes.post('/savePaperGroup', cors(), cpUpload, userdashController.savePaperGroup)
routes.post('/updatePaperGroup', cors(), cpUpload, userdashController.updatePaperGroup)
routes.post('/submitPaper', cors(), userdashController.submitPaper)

//Export to index.JS
module.exports = routes