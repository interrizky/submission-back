const fse = require('fs-extra')
const JWT = require('jsonwebtoken')
const date = require('date-and-time')

/* load model */
const userModel = require('../models/user_model')
const paperModel = require('../models/paper_model')

/* getmypassword di menu change password */
exports.getMypassword = async(req, res) => {
  if(!req.body){
    res.send({ status: 'failed', message: 'Error Processing Data' })
  } else {  
    const filter = { 'email': req.body.data_email, 'phone': req.body.data_phone, 'user_status': req.body.data_active }
    const update = { 'password': req.body.data_passwd }
    const datax = await userModel.findOneAndUpdate(filter, update).then(data => { return data })
    if( datax != null ) {
      res.send({ status: 'success', message: 'Password Updated Successfully', result: datax })
    } else {
      res.send({ status: 'failed', message: 'Password Updated Failed' })
    }    
  }
}

/* format file size */
const fileSizeFormatter = (bytes, decimal) => {
  if(bytes === 0){
    return '0 Bytes';
  }

  const dm = decimal || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'YB', 'ZB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));

  return parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + ' ' + sizes[index];
}

/* format kode paper */
const generateCodePaper = async() => {
  let number = await paperModel.estimatedDocumentCount({}).exec()

  if(number > 0) {
    number = number+1
  } else {
    number = 1
  }

  let newNumber = ""
  if( number >= 1 && number <= 9 ) {
    newNumber = "000"+number
  } else if(number >= 10 && number <= 99) {
    newNumber = "00"+number
  } else if(number >= 100 && number <= 999) {
    newNumber = "0"+number
  } else {
    newNumber = number
  }

  return newNumber
}

/* save paper one */
exports.savethepaper = async(req, res) => {
  try {
    if( req.files && req.body ) {
      /* override date object */
      const now = new Date()

      // console.log(req.files)
      // console.log(req.files['paper_file'][0].originalname)
      // console.log(req.body)      
      // console.log(req.body['judul'])

      /* generate huruf */
      let huruf = ""
      if( req.body['jenis_paper_text'] === 'General Paper' ) {
        huruf = (req.body['kategori'] === 'Mahasiswa') ?  "GPM-" : "GPU-"
      } else if( req.body['jenis_paper_text'] === 'Regional Economic Modeling Paper'  ) {
        huruf = "REM-"
      } else {
        huruf = "SJC-"
      }

      // console.log(req.body['jenis_paper_text'])
      // console.log(req.body['kategori'])

      /* call generate code paper */
      let number = await generateCodePaper().then(result => result)
      console.log(number)

      /* generate paper code */
      let registration_code = huruf+number
      console.log(registration_code)

      /* cek apakah ada file dalam folder tersebut, kalo ada file tsb dipindahin ke direktori yang diinginkan */
      if( req.files['paper_file'] ) {
        fse.move(req.files['paper_file'][0].path, './uploads/' + registration_code + '/' + req.files['paper_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
        })
      }
      if( req.files['cv_file'] ) {
        fse.move(req.files['cv_file'][0].path, './uploads/' + registration_code + '/' + req.files['cv_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
        })         
      }
      if( req.files['pernyataan_file'] ) {
        fse.move(req.files['pernyataan_file'][0].path, './uploads/' + registration_code + '/' + req.files['pernyataan_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
        })         
      }
      if( req.files['lampiran_file'] ) {
        fse.move(req.files['lampiran_file'][0].path, './uploads/' + registration_code + '/' + req.files['lampiran_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
        })         
      }   

      /* initiate variable to save */
      let dataOptions = new paperModel({
        paper_code : registration_code,
        participation_code : '-',
        title : req.body['judul'],
        paper_type : req.body['jenis_paper_text'],
        sub_theme : req.body['sub_tema_text'],  
        category : req.body['kategori'],
        participation_type : req.body['keikutsertaan'],
        upload_date : date.format(now, 'DD/MM/YYYY HH:mm:ss'),
        submission_date : '-',
        name_1 : '-',
        phone_1 : '-',
        organization_1 : '-',
        cv_fileName_1 : req.files['cv_file'][0].filename,
        cv_filePath_1 : 'uploads/' + registration_code + '/' + req.files['cv_file'][0].originalname,
        cv_fileType_1 : req.files['cv_file'][0].mimetype,
        cv_fileSize_1 : fileSizeFormatter(req.files['cv_file'][0].originalname, 2),
        paper_fileName_1 : req.files['paper_file'][0].filename,
        paper_filePath_1 : 'uploads/' + registration_code + '/' + req.files['paper_file'][0].originalname,
        paper_fileType_1 : req.files['paper_file'][0].mimetype,
        paper_fileSize_1 : fileSizeFormatter(req.files['paper_file'][0].originalname, 2),
        pernyataan_fileName_1 : req.files['pernyataan_file'][0].filename,
        pernyataan_filePath_1 : 'uploads/' + registration_code + '/' + req.files['pernyataan_file'][0].originalname,
        pernyataan_fileType_1 : req.files['pernyataan_file'][0].mimetype,
        pernyataan_fileSize_1 : fileSizeFormatter(req.files['pernyataan_file'][0].originalname, 2),
        lampiran_fileName_1 : !req.files['lampiran_file'] ? req.files['lampiran_file'][0].filename : '-',
        lampiran_filePath_1 : !req.files['lampiran_file'] ? 'uploads/' + registration_code + '/' + req.files['lampiran_file'][0].originalname : '-',
        lampiran_fileType_1 : !req.files['lampiran_file'] ? req.files['lampiran_file'][0].mimetype : '-',
        lampiran_fileSize_1 : !req.files['lampiran_file'] ? fileSizeFormatter(req.files['lampiran_file'][0].originalname, 2) : '-'
      })

      console.log(dataOptions)

      const save = dataOptions.save()

      if( save ) {
        /* send status */
        res.send({ status: "success", message: "Save & Upload Paper Succeed" })
      } else {
        res.send({ status: "failed", message: "Failed to Save" })
      }
    } else {
      res.send({ status: "failed", message: "Failed Req Body & Req Files" })
    } 
  } catch (error) {
    res.send({ status: "error", message: "Invalid Action" })    
  }
}

/* get data table */
exports.fetchTable = async(req, res) => {
  console.log(req.body)
  if( !req.body || req.body.data_active != 'active' ) {
    res.send({ status: 'error', message: 'Fetching Table Failed' })
  } else {
    const datax = await paperModel.find({ 'email' : req.body.data_email, 'user_status' : req.body.data_active })
    if( datax != null ) {
      res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax })
    } else {
      res.send({ status: 'failed', message: 'Fetching Table Failed' })
    }
  }
}