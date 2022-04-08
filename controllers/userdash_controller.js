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
exports.savePaperOne = async(req, res) => {
  try {
    if( req.files && req.body ) {
      /* override date object */
      const now = new Date()

      /* generate huruf */
      let huruf = ""
      if( req.body['jenis_paper_text'] === 'General Paper' ) {
        huruf = (req.body['kategori'] === 'Mahasiswa') ?  "GPM-" : "GPU-"
      } else if( req.body['jenis_paper_text'] === 'Regional Economic Modeling Paper'  ) {
        huruf = "REM-"
      } else {
        huruf = "SJC-"
      }

      /* call generate code paper */
      let number = await generateCodePaper().then(result => result)

      /* generate paper code */
      let registration_code = huruf+number

      /* generate string untuk lampiran */
      let _lampiran_fileName_1 = ""
      let _lampiran_filePath_1 = ""
      let _lampiran_fileType_1 = ""
      let _lampiran_fileSize_1 = ""

      if(req.body['jenis_paper_text'] === 'Regional Economic Modeling Paper') {
        _lampiran_fileName_1 = req.files['lampiran_file'][0].filename
        _lampiran_filePath_1 = 'uploads/' + registration_code + '/' + req.files['lampiran_file'][0].originalname
        _lampiran_fileType_1 = req.files['lampiran_file'][0].mimetype 
        _lampiran_fileSize_1 = fileSizeFormatter(req.files['lampiran_file'][0].size, 2)
      } else {
        _lampiran_fileName_1 = '-'
        _lampiran_filePath_1 = '-'
        _lampiran_fileType_1 = '-'
        _lampiran_fileSize_1 = '-'        
      }

      /* initiate variable to save */
      const arrayOptions = new paperModel({
        paper_code: registration_code,
        userid_code: req.query['userid_code'],
        title: req.body['judul'],
        paper_type: req.body['jenis_paper_text'],
        sub_theme: req.body['sub_tema_text'],  
        category: req.body['kategori'],
        participation_type: req.body['keikutsertaan'],
        upload_date: date.format(now, 'DD/MM/YYYY HH:mm:ss'),
        submission_date : "-",
        submit_status: "-",
        paper_status: "-",        
        name_1: req.query['name'],
        phone_1: req.query['phone'],
        organization_1: req.query['organization'],        
        cv_filePath_1: 'uploads/' + registration_code + '/' + req.files['cv_file'][0].originalname,
        cv_fileName_1: req.files['cv_file'][0].filename,
        cv_filePath_1: 'uploads/' + registration_code + '/' + req.files['cv_file'][0].originalname,
        cv_fileType_1: req.files['cv_file'][0].mimetype,
        cv_fileSize_1: fileSizeFormatter(req.files['cv_file'][0].size, 2),
        paper_fileName_1: req.files['paper_file'][0].filename,
        paper_filePath_1: 'uploads/' + registration_code + '/' + req.files['paper_file'][0].originalname,
        paper_fileType_1: req.files['paper_file'][0].mimetype,
        paper_fileSize_1: fileSizeFormatter(req.files['paper_file'][0].size, 2),
        pernyataan_fileName_1: req.files['pernyataan_file'][0].filename,
        pernyataan_filePath_1: 'uploads/' + registration_code + '/' + req.files['pernyataan_file'][0].originalname,
        pernyataan_fileType_1: req.files['pernyataan_file'][0].mimetype,
        pernyataan_fileSize_1: fileSizeFormatter(req.files['pernyataan_file'][0].size, 2),
        lampiran_fileName_1: _lampiran_fileName_1,
        lampiran_filePath_1: _lampiran_filePath_1,
        lampiran_fileType_1: _lampiran_fileType_1,
        lampiran_fileSize_1: _lampiran_fileSize_1,                     
      })

      const posting = arrayOptions.save()

      if( posting ) {
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
        
        /* send status */
        res.send({ status: "success", message: "Save & Upload Paper Succeed" })   
      } else {
        /* send status */
        res.send({ status: "failed", message: "Failed to Save & Upload Paper" })   
      }
    } else {
      res.send({ status: "failed", message: "Failed Req Body & Req Files" })
    } 
  } catch (error) {
    res.send({ status: "error", message: "Invalid Action" })    
  }
}

/* update paperone */
exports.updatePaperOne = async(req, res) => {
  /* temp status perubahan data */
  let paper_status = ''
  let cv_status = ''
  let pernyataan_status = ''
  let lampiran_status = ''
  let doc_status = ''

  /* untuk findOneAndUpdate */
  const opts = { new: true }
  
  /* update judul */
  const filter = { paper_code: req.body['paper_code'], paper_type: req.body['paper_type'] }
  const update = { title: req.body['temp_title'] }
  doc_status = await paperModel.findOneAndUpdate(filter, update, opts)
  
  /* bila ada inputan perubahan file paper */
  let _paper_fileName_1 = ''
  let _paper_filePath_1 = ''
  let _paper_fileType_1 = ''
  let _paper_fileSize_1 = ''
  if( req.files['paper_file'] ) {
    _paper_fileName_1 = req.files['paper_file'][0].filename
    _paper_filePath_1 = 'uploads/' + req.body['userid_code'] + '/' + req.files['paper_file'][0].originalname
    _paper_fileType_1 = req.files['paper_file'][0].mimetype
    _paper_fileSize_1 = fileSizeFormatter(req.files['paper_file'][0].size, 2)

    const filter = { paper_code: req.body['paper_code'], paper_type: req.body['paper_type'] }
    const update = {
      paper_fileName_1: _paper_fileName_1,
      paper_filePath_1: _paper_filePath_1,
      paper_fileType_1: _paper_fileType_1,
      paper_fileSize_1: _paper_fileSize_1,      
    }    
    paper_status = await paperModel.findOneAndUpdate(filter, update, opts)

    if( req.files['paper_file'] ) {
      fse.move(req.files['paper_file'][0].path, './uploads/' + req.body['userid_code'] + '/' + req.files['paper_file'][0].originalname, { overwrite: true }, err => {
        if (err) return console.error(err)
      })
    }
  }

  /* bila ada inputan perubahan file cv */
  let _cv_fileName_1 = ''
  let _cv_filePath_1 = ''
  let _cv_fileType_1 = ''
  let _cv_fileSize_1 = ''
  if( req.files['cv_file'] ) {
    _cv_fileName_1 = req.files['cv_file'][0].filename
    _cv_filePath_1 = 'uploads/' + req.body['userid_code'] + '/' + req.files['cv_file'][0].originalname
    _cv_fileType_1 = req.files['cv_file'][0].mimetype
    _cv_fileSize_1 = fileSizeFormatter(req.files['cv_file'][0].size, 2)

    const filter = { paper_code: req.body['paper_code'], paper_type: req.body['paper_type'] }
    const update = {
      cv_fileName_1: _cv_fileName_1,
      cv_filePath_1: _cv_filePath_1,
      cv_fileType_1: _cv_fileType_1,
      cv_fileSize_1: _cv_fileSize_1,      
    }    
    cv_status = await paperModel.findOneAndUpdate(filter, update, opts)

    if( cv_status !== null ) {
      if( req.files['cv_file'] ) {
        fse.move(req.files['cv_file'][0].path, './uploads/' + req.body['userid_code'] + '/' + req.files['cv_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
        })         
      }
    }      
  }

  /* bila ada inputan perubahan file pernyataan */
  let _pernyataan_fileName_1 = ''
  let _pernyataan_filePath_1 = ''
  let _pernyataan_fileType_1 = ''
  let _pernyataan_fileSize_1 = ''
  if( req.files['pernyataan_file'] ) {
    _pernyataan_fileName_1 = req.files['pernyataan_file'][0].filename
    _pernyataan_filePath_1 = 'uploads/' + req.body['userid_code'] + '/' + req.files['pernyataan_file'][0].originalname
    _pernyataan_fileType_1 = req.files['pernyataan_file'][0].mimetype
    _pernyataan_fileSize_1 = fileSizeFormatter(req.files['pernyataan_file'][0].size, 2)

    const filter = { paper_code: req.body['paper_code'], paper_type: req.body['paper_type'] }
    const update = {
      pernyataan_fileName_1: _pernyataan_fileName_1,
      pernyataan_filePath_1: _pernyataan_filePath_1,
      pernyataan_fileType_1: _pernyataan_fileType_1,
      pernyataan_fileSize_1: _pernyataan_fileSize_1,      
    }    
    pernyataan_status = await paperModel.findOneAndUpdate(filter, update, opts)

    if( pernyataan_status !== null ) {
      if( req.files['pernyataan_file'] ) {
        fse.move(req.files['pernyataan_file'][0].path, './uploads/' + req.body['userid_code'] + '/' + req.files['pernyataan_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
        })         
      }
    }      
  }

  /* bila ada inputan perubahan untuk lampiran */
  let _lampiran_fileName_1 = ""
  let _lampiran_filePath_1 = ""
  let _lampiran_fileType_1 = ""
  let _lampiran_fileSize_1 = ""
  if( req.files['lampiran_file'] ) {
    _lampiran_fileName_1 = req.files['lampiran_file'][0].filename
    _lampiran_filePath_1 = 'uploads/' + req.body['userid_code'] + '/' + req.files['lampiran_file'][0].originalname
    _lampiran_fileType_1 = req.files['lampiran_file'][0].mimetype 
    _lampiran_fileSize_1 = fileSizeFormatter(req.files['lampiran_file'][0].size, 2)

    const filter = { paper_code: req.body['paper_code'], paper_type: req.body['paper_type'] }
    const update = {
      lampiran_fileName_1: _lampiran_fileName_1,
      lampiran_filePath_1: _lampiran_filePath_1,
      lampiran_fileType_1: _lampiran_fileType_1,
      lampiran_fileSize_1: _lampiran_fileSize_1,      
    }    
    lampiran_status = await paperModel.findOneAndUpdate(filter, update, opts)

    if( lampiran_status !== null ) {
      if( req.files['lampiran_file'] ) {
        fse.move(req.files['lampiran_file'][0].path, './uploads/' + req.body['userid_code'] + '/' + req.files['lampiran_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
        })         
      }
    }
  }
  

  if( doc_status || paper_status || cv_status || pernyataan_status || lampiran_status ) {
    res.send({ status: 'success', message: 'Updating Success' })              
  } else {
    res.send({ status: 'failed', message: 'Failed To Update Data' })      
  }
}

/* get data table */
exports.fetchTable = async(req, res) => {
  if( !req.body || req.body.data_userid == 'null' || req.body.data_userid == '' ) {
    res.send({ status: 'error', message: 'Fetching Table Failed' })
  } else {
    const datax = await paperModel.find({ 'userid_code' : req.body.data_userid })
    if( datax != null ) {
      res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax })
    } else {
      res.send({ status: 'failed', message: 'Fetching Table Failed' })
    }
  }
}

/* get paper data to edit */
exports.fetchPaperOne = async(req, res) => {
  if( !req.body ) {
    res.send({ status: 'error', message: 'Cant Have Paper Code'})
  } else {
    const datax = await paperModel.findOne({ paper_code: req.body.data_userid_code, participation_type: req.body.data_participation_type }).exec({})
    datax !== null ? res.send({ status: 'success', message: 'Success Fetch Data To Edit', result: datax }) : res.send({ status: 'failed', message: 'Cant Fetch Data' })
  }
}