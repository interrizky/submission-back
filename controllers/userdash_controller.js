const fse = require('fs-extra')
const path = require('path')
const jwt = require('jsonwebtoken')
const date = require('date-and-time')
const bcrypt = require('bcryptjs')

/* config and setup email */
const mail = require('../lib/email/send')

/* load model */
const userModel = require('../models/user_model')
const paperModel = require('../models/paper_model')

/* getmypassword di menu change password */
exports.getMypassword = async(req, res) => {
  let tokenAuth = req.headers.authorization

  if(!req.body && !tokenAuth){
    res.send({ status: 'failed', message: 'Error Processing' })
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      res.send({ status: 'failed', message: 'Error Bearer Authentication' })
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'ejavecPrivKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        res.send({ status: 'failed', message: 'Error Processing Token' })
      } else { 
        const filter = { 'email': req.body.data_email, 'phone': req.body.data_phone, 'user_status': req.body.data_active }
        /* hash password */
        passwordHash = bcrypt.hashSync(req.body.data_passwd, 10)        
        const update = { 'password': passwordHash }
        const datax = await userModel.findOneAndUpdate(filter, update, {returnOriginal: false}).then(data => { return data })
        if( datax != null ) {
          res.send({ status: 'success', message: 'Password Updated Successfully', result: datax })
        } else {
          res.send({ status: 'failed', message: 'Password Updated Failed' })
        } 
      }
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
const generateCodePaper = async(paper_type_param) => {
  const filter = { 'paper_type': paper_type_param };
  const datax = await paperModel.find(filter)
  const number = datax.length > 0 ? datax.length+1 : 0

  // let datax = await paperModel.find(filter).estimatedDocumentCount({}).exec()  
  // if(number > 0) {
  //   number = number+1
  // } else {
  //   number = 1
  // }  

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
    let tokenAuth = req.headers.authorization

    if(!req.body && !tokenAuth && !req.files){
      res.send({ status: 'failed', message: 'Error Processing' })
    } else {
      // Split the token type
      let newTokenAuth = tokenAuth.split(' ');
      // Check Token if it is Bearer
      if( newTokenAuth[0] != 'Bearer') {
        res.send({ status: 'failed', message: 'Error Bearer Authentication' })
      } else {
        // Checking Token
        const token = jwt.verify(newTokenAuth[1], 'ejavecPrivKey', (error, result) => {
          if (error) return false; if (result) return result
        })
        // Decide if token = true or false
        if( !token ) {
          res.send({ status: 'failed', message: 'Error Processing Token' })
        } else {
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
          let number = await generateCodePaper(req.body['jenis_paper_text']).then(result => result)

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
            email_1: req.query['email'],            
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
        }
      }
    }
  } catch (error) {
    res.send({ status: "error", message: "Invalid Action" })    
  }
}

/* update paperone */
exports.updatePaperOne = async(req, res) => {
  let tokenAuth = req.headers.authorization

  if(!tokenAuth){
    res.send({ status: 'failed', message: 'Error Processing' })
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      res.send({ status: 'failed', message: 'Error Bearer Authentication' })
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'ejavecPrivKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        res.send({ status: 'failed', message: 'Error Processing Token' })
      } else {
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
    }
  }
}

/* get data table */
exports.fetchTable = async(req, res) => {
  let tokenAuth = req.headers.authorization

  if(!req.body && !tokenAuth){
    res.send({ status: 'failed', message: 'Error Processing' })
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      res.send({ status: 'failed', message: 'Error Bearer Authentication' })
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'ejavecPrivKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        res.send({ status: 'failed', message: 'Error Processing Token' })
      } else {   
        const datax = await paperModel.find({ 'userid_code' : req.body.data_userid })
        if( datax != null ) {
          res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax })
        } else {
          res.send({ status: 'failed', message: 'Fetching Table Failed' })
        }
      }
    }
  }
}

/* get paper data to edit */
exports.fetchPaper = async(req, res) => {
  let tokenAuth = req.headers.authorization

  if(!req.body && !tokenAuth){
    res.send({ status: 'failed', message: 'Error Processing' })
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      res.send({ status: 'failed', message: 'Error Bearer Authentication' })
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'ejavecPrivKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        res.send({ status: 'failed', message: 'Error Processing Token' })
      } else {  
        const datax = await paperModel.findOne({ paper_code: req.body.data_userid_code, participation_type: req.body.data_participation_type }).exec({})
        datax !== null ? res.send({ status: 'success', message: 'Success Fetch Data To Edit', result: datax }) : res.send({ status: 'failed', message: 'Cant Fetch Data' })        
      }
    }
  } 
}

/* save paper group */
exports.savePaperGroup = async(req, res) => {
  try {
    let tokenAuth = req.headers.authorization

    if(!req.body && !tokenAuth && !req.files && !req.query){
      res.send({ status: 'failed', message: 'Error Processing' })
    } else {
      // Split the token type
      let newTokenAuth = tokenAuth.split(' ');
      // Check Token if it is Bearer
      if( newTokenAuth[0] != 'Bearer') {
        res.send({ status: 'failed', message: 'Error Bearer Authentication' })
      } else {
        // Checking Token
        const token = jwt.verify(newTokenAuth[1], 'ejavecPrivKey', (error, result) => {
          if (error) return false; if (result) return result
        })
        // Decide if token = true or false
        if( !token ) {
          res.send({ status: 'failed', message: 'Error Processing Token' })
        } else {
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
          let number = await generateCodePaper(req.body['jenis_paper_text']).then(result => result)

          /* generate paper code */
          let registration_code = huruf+number

          /* untuk cek isian peserta ketiga kalo ada yang iseng input separo */
          let _nama_3 = ""
          let _instansi_3 = ""
          let _phone_3 = ""
          let _cv_fileName_3 = ""
          let _cv_filePath_3 = ""
          let _cv_fileType_3 = ""
          let _cv_fileSize_3 = ""      

          if( req.body.nama_3 == '' || req.body.instansi_3 == '' || req.body.phone_3 == '' || !req.files['cv_3_file'] ) {
            _nama_3 = '-'
            _instansi_3 = '-'
            _phone_3 = '-'
            _cv_fileName_3 = '-'
            _cv_filePath_3 = '-'
            _cv_fileType_3 = '-'
            _cv_fileSize_3 = '-'              
          } else {
            _nama_3 = req.body['nama_3']
            _instansi_3 = req.body['instansi_3']
            _phone_3 = req.body['phone_3']
            _cv_fileName_3 = req.files['cv_3_file'][0].filename
            _cv_filePath_3 = 'uploads/' + registration_code + '/' + req.files['cv_3_file'][0].originalname
            _cv_fileType_3 = req.files['cv_3_file'][0].mimetype 
            _cv_fileSize_3 = fileSizeFormatter(req.files['cv_3_file'][0].size, 2)                    
          }          

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
            email_1: req.query['email'],
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
            name_2: req.body['nama_2'],
            phone_2: req.body['phone_2'],
            organization_2: req.body['instansi_2'],
            cv_filePath_2: 'uploads/' + registration_code + '/' + req.files['cv_2_file'][0].originalname,
            cv_fileName_2: req.files['cv_2_file'][0].filename,
            cv_filePath_2: 'uploads/' + registration_code + '/' + req.files['cv_2_file'][0].originalname,
            cv_fileType_2: req.files['cv_2_file'][0].mimetype,
            cv_fileSize_2: fileSizeFormatter(req.files['cv_file'][0].size, 2),
            name_3: _nama_3,
            phone_3: _phone_3,
            organization_3: _instansi_3,
            cv_fileName_3 : _cv_fileName_3,
            cv_filePath_3 : _cv_filePath_3,
            cv_fileType_3 : _cv_fileType_3,
            cv_fileSize_3 : _cv_fileSize_3,                                                    
          })

          console.log(arrayOptions)

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

            if( req.files['cv_2_file'] ) {
              fse.move(req.files['cv_2_file'][0].path, './uploads/' + registration_code + '/' + req.files['cv_2_file'][0].originalname, { overwrite: true }, err => {
                if (err) return console.error(err)
              })         
            }
            
            if( req.files['cv_3_file'] ) {
              fse.move(req.files['cv_3_file'][0].path, './uploads/' + registration_code + '/' + req.files['cv_3_file'][0].originalname, { overwrite: true }, err => {
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
        }
      }
    }     
  } catch (error) {
    res.send({ status: "error", message: "Invalid Action" })    
  }
}

/* edit paper group */
exports.updatePaperGroup = async(req, res) => {
  let tokenAuth = req.headers.authorization

  if(!tokenAuth){
    res.send({ status: 'failed', message: 'Error Processing' })
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      res.send({ status: 'failed', message: 'Error Bearer Authentication' })
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'ejavecPrivKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        res.send({ status: 'failed', message: 'Error Processing Token' })
      } else { 
        /* temp status perubahan data */
        let paper_status = ''
        let cv_status = ''
        let pernyataan_status = ''
        let lampiran_status = ''
        let doc_status = ''
        let name_2_status = ''
        let name_3_status = ''
        let org_2_status = ''
        let org_3_status = ''  
        let phone_2_status = ''
        let phone_3_status = ''
        let cv_2_status = ''      
        let cv_3_status = ''        

        /* untuk findOneAndUpdate */
        const opts = { new: true }
        
        /* update judul */
        const filter = { paper_code: req.body['paper_code'], paper_type: req.body['paper_type'] }
        const update = { title: req.body['temp_title'] }
        doc_status = await paperModel.findOneAndUpdate(filter, update, opts)

        /* update name_2 */
        const update_name_2 = { name_2: req.body['temp_name_2'] }
        name_2_status = await paperModel.findOneAndUpdate(filter, update_name_2, opts)

        /* update name_3 */
        if( req.body['temp_name_3'] ) {
          const update_name_3 = { name_3: req.body['temp_name_3'] }
          name_3_status = await paperModel.findOneAndUpdate(filter, update_name_3, opts)      
        }

        /* update organization_2 */
        const update_organization_2 = { organization_2: req.body['temp_organization_2'] }
        org_2_status = await paperModel.findOneAndUpdate(filter, update_organization_2, opts)

        /* update organization_3 */
        if( req.body['temp_organization_3'] ) {
          const update_organization_3 = { organization_3: req.body['temp_organization_3'] }
          org_3_status = await paperModel.findOneAndUpdate(filter, update_organization_3, opts)      
        }  

        /* update phone_2 */
        const update_phone_2 = { phone_2: req.body['temp_phone_2'] }
        phone_2_status = await paperModel.findOneAndUpdate(filter, update_phone_2, opts)

        /* update phone_3 */
        if( req.body['temp_phone_3'] ) {
          const update_phone_3 = { phone_3: req.body['temp_phone_3'] }
          phone_3_status = await paperModel.findOneAndUpdate(filter, update_phone_3, opts)      
        }    
        
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

        /* bila ada inputan perubahan file cv - peserta kedua */
        let _cv_fileName_2 = ''
        let _cv_filePath_2 = ''
        let _cv_fileType_2 = ''
        let _cv_fileSize_2 = ''
        if( req.files['cv_2_file'] ) {
          _cv_fileName_2 = req.files['cv_2_file'][0].filename
          _cv_filePath_2 = 'uploads/' + req.body['userid_code'] + '/' + req.files['cv_2_file'][0].originalname
          _cv_fileType_2 = req.files['cv_2_file'][0].mimetype
          _cv_fileSize_2 = fileSizeFormatter(req.files['cv_2_file'][0].size, 2)

          const update = {
            cv_fileName_2: _cv_fileName_2,
            cv_filePath_2: _cv_filePath_2,
            cv_fileType_2: _cv_fileType_2,
            cv_fileSize_2: _cv_fileSize_2,      
          }    
          cv_2_status = await paperModel.findOneAndUpdate(filter, update, opts)

          if( cv_status !== null ) {
            if( req.files['cv_2_file'] ) {
              fse.move(req.files['cv_2_file'][0].path, './uploads/' + req.body['userid_code'] + '/' + req.files['cv_2_file'][0].originalname, { overwrite: true }, err => {
                if (err) return console.error(err)
              })         
            }
          }      
        }
        
        /* bila ada inputan perubahan file cv - peserta ketiga */
        let _cv_fileName_3 = ''
        let _cv_filePath_3 = ''
        let _cv_fileType_3 = ''
        let _cv_fileSize_3 = ''
        if( req.files['cv_3_file'] ) {
          _cv_fileName_3 = req.files['cv_3_file'][0].filename
          _cv_filePath_3 = 'uploads/' + req.body['userid_code'] + '/' + req.files['cv_3_file'][0].originalname
          _cv_fileType_3 = req.files['cv_3_file'][0].mimetype
          _cv_fileSize_3 = fileSizeFormatter(req.files['cv_3_file'][0].size, 2)

          const update = {
            cv_fileName_3: _cv_fileName_3,
            cv_filePath_3: _cv_filePath_3,
            cv_fileType_3: _cv_fileType_3,
            cv_fileSize_3: _cv_fileSize_3,      
          }    
          cv_3_status = await paperModel.findOneAndUpdate(filter, update, opts)

          if( cv_status !== null ) {
            if( req.files['cv_3_file'] ) {
              fse.move(req.files['cv_3_file'][0].path, './uploads/' + req.body['userid_code'] + '/' + req.files['cv_3_file'][0].originalname, { overwrite: true }, err => {
                if (err) return console.error(err)
              })         
            }
          }      
        }  

        if( doc_status || paper_status || cv_status || pernyataan_status || lampiran_status ||   name_2_status || name_3_status || org_2_status || org_3_status || phone_2_status || phone_3_status || cv_2_status || cv_3_status ) {
          res.send({ status: 'success', message: 'Updating Success' })              
        } else {
          res.send({ status: 'failed', message: 'Failed To Update Data' })      
        }
      }
    }
  }    
}

/* submit paper */
exports.submitPaper = async(req, res) => {
  let tokenAuth = req.headers.authorization

  if(!req.body && !tokenAuth){
    res.send({ status: 'failed', message: 'Error Processing' })
  } else {
    // Split the token type
    let newTokenAuth = tokenAuth.split(' ');
    // Check Token if it is Bearer
    if( newTokenAuth[0] != 'Bearer') {
      res.send({ status: 'failed', message: 'Error Bearer Authentication' })
    } else {
      // Checking Token
      const token = jwt.verify(newTokenAuth[1], 'ejavecPrivKey', (error, result) => {
        if (error) return false; if (result) return result
      })
      // Decide if token = true or false
      if( !token ) {
        res.send({ status: 'failed', message: 'Error Processing Token' })
      } else {
        const now_date = new Date()
        const deadline_date = new Date(2022, 4, 2, 0, 0, 1)
        const sharia_date = new Date(2022, 7, 9, 0, 0, 1)
      
        if( req.body.data_papertype !== 'Java Sharia Business Model' && (date.format(now_date, 'DD/MM/YYYY HH:mm:ss') < date.format(deadline_date, 'DD/MM/YYYY HH:mm:ss')) ) {
          res.status(404).send({ status: 'failed', message: 'Deadline Date Is Over' })
        } else if( req.body.data_papertype === 'Java Sharia Business Model' && (date.format(now_date, 'DD/MM/YYYY HH:mm:ss') < date.format(sharia_date, 'DD/MM/YYYY HH:mm:ss')) ) {
          res.status(404).send({ status: 'failed', message: 'Deadline Date Is Over' })
        } else {   
          /* update data */
          const filter = { 'paper_code': req.body.data_papercode }
          const update = { 'submission_date': date.format(now_date, 'DD/MM/YYYY HH:mm:ss'), 'submit_status': 'submit' }
          const opts = { returnOriginal: false }   

          const doc = await paperModel.findOneAndUpdate(filter, update, opts).exec()

          if( doc ) {
            const temp_name_1 = doc.name_1
            const temp_title = doc.title
            const temp_sub_theme = doc.sub_theme
            const temp_paper_code = doc.paper_code

            /* mailOptions */
            let mailOptions = {
              from: "EJAVEC FORUM 2022 <info@ejavec.org>",
              to: req.body.data_email,
              cc: "info@ejavec.org",
              bcc: "interrizky@ymail.com",
              subject: "Paper Submission",
              template: 'ejavec-notif-submit',
              context: {
                nama: temp_name_1,
                judul: temp_title,
                subTema: temp_sub_theme,
                noReg: temp_paper_code
              },
              attachments: [{
                filename: 'ejavec-forum-email-logo.png',
                path: path.join(__dirname, "../public/images/ejavec-forum-email-logo.png"),
                cid: 'ejavec-forum-email-logo'
              }],
            };        

            /* trigger the sending of the E-mail */
            mail.sendMail(mailOptions, function (error, info) {
              if (error) {
                return console.log(error)
              }
              console.log('Message sent: ' + info.response)
            }) 
            res.send({
              status: "success",
              message: "Success Updating Submission Paper Status and Email Paper Status",
              result: doc
            })       
          } else {
            res.send({
              status: "error",
              message: "Error Updating Submission Paper Status and Email Paper Status",
            })   
          }
        }
      }
    }
  }
}