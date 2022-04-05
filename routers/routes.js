const express = require('express')
const multer = require('multer')
const path = require('path')
const routes = express.Router()

const { upload } = require('../helpers/upload_helper');

const loginController = require('../controllers/login_controller')
const userdashController = require('../controllers/userdash_controller')

/* multer for upload files */
// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/uploads");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   },
// });
// let upload = multer({ storage: storage });
// let uploadMultiple = upload.fields([{ name: 'file-1', maxCount: 10 }, { name: 'file-2', maxCount: 10 }, { name: 'file-3', maxCount: 10 }])

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