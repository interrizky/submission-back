const path = require('path')
const jwt = require('jsonwebtoken')

/* config and setup email */
const mail = require('../lib/email/send')

/* load model */
const userModel = require('../models/user_model')
const paperModel = require('../models/paper_model')

/* get all full paper data into table */
exports.fetchPaperTable = async(req, res) => {
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
        if( req.body.data_fetch == 'search' ) {
          let filter = ''
          let keyword = req.body.data_keyword

          if( req.body.data_filter == 'kodepaper') {
            filter = { paper_code: new RegExp(keyword, 'i'), submit_status: 'submit', paper_type: {$in: ['General Paper', 'Regional Economic Modeling Paper']} }
          } else if ( req.body.data_filter == 'nama') {
            filter = { name_1: new RegExp(keyword, 'i'), submit_status: 'submit', paper_type: {$in: ['General Paper', 'Regional Economic Modeling Paper']} }
          } else {
            filter = { title: new RegExp(keyword, 'i'), submit_status: 'submit', paper_type: {$in: ['General Paper', 'Regional Economic Modeling Paper']} }
          }

          const datax = await paperModel.find(filter).sort({submission_date: -1})
          const number = datax.length > 0 ? datax.length : 0

          if( datax != null ) {
            res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax, number: number })
          } else {
            res.send({ status: 'failed', message: 'Fetching Table Failed' })
          }
        } else {
          const filter = { submit_status: 'submit', paper_type: {$in: ['General Paper', 'Regional Economic Modeling Paper']} }

          const datax = await paperModel.find(filter).sort({submission_date : -1})
          const number = datax.length > 0 ? datax.length : 0

          if( datax != null ) {
            res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax, number: number })
          } else {
            res.send({ status: 'failed', message: 'Fetching Table Failed' })
          }
        }
      }
    }
  }  
}

/* get all sharia data into table */
exports.fetchShariaTable = async(req, res) => {
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
        if( req.body.data_fetch == 'search' ) {
          let filter = ''
          let keyword = req.body.data_keyword

          if( req.body.data_filter == 'kodepaper') {
            filter = { paper_code: new RegExp(keyword, 'i'), submit_status: 'submit', paper_type: {$in: ['Java Sharia Business Model']} }
          } else if ( req.body.data_filter == 'nama') {
            filter = { name_1: new RegExp(keyword, 'i'), submit_status: 'submit', paper_type: {$in: ['Java Sharia Business Model']} }
          } else {
            filter = { title: new RegExp(keyword, 'i'), submit_status: 'submit', paper_type: {$in: ['Java Sharia Business Model']} }
          }

          const datax = await paperModel.find(filter).sort({submission_date: -1})
          const number = datax.length > 0 ? datax.length : 0

          if( datax != null ) {
            res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax, number: number })
          } else {
            res.send({ status: 'failed', message: 'Fetching Table Failed' })
          }
        } else {
          const filter = { submit_status: 'submit', paper_type: {$in: ['Java Sharia Business Model']} }

          const datax = await paperModel.find(filter).sort({submission_date : -1})
          const number = datax.length > 0 ? datax.length : 0
          
          if( datax != null ) {
            res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax, number: number })
          } else {
            res.send({ status: 'failed', message: 'Fetching Table Failed' })
          }
        }
      }
    }
  }  
}

/* get peserta status into pie */
exports.fetchUserStatus = async(req, res) => {
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
        const datax = await userModel.find({ role: "peserta", user_status: "active" })
        const activeNumber = datax.length > 0 ? datax.length : 0

        const dataxx = await userModel.find({ role: "peserta", user_status: "inactive" })
        const nonActiveNumber = dataxx.length > 0 ? dataxx.length : 0

        if( datax != null && dataxx != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', activeNumber: activeNumber, nonActiveNumber: nonActiveNumber })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }
  }  
}

/* get all paper by type */
exports.fetchAllPaperByType = async(req, res) => {
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
        const datax = await paperModel.find({  paper_type: "General Paper" })
        const angkaGP = datax.length > 0 ? datax.length : 0

        const dataxx = await paperModel.find({  paper_type: "Regional Economic Modeling Paper" })
        const angkaREM = dataxx.length > 0 ? dataxx.length : 0

        const dataxxx = await paperModel.find({  paper_type: "Java Sharia Business Model" })
        const angkaSharia = dataxxx.length > 0 ? dataxxx.length : 0        

        if( datax != null && dataxx != null && dataxxx != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', angkaGP: angkaGP, angkaREM: angkaREM, angkaSharia: angkaSharia })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }
  }  
}

/* get 10 Latest Registered User */
exports.fetchTenUserLatest = async(req, res) => {
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
        const datax = await userModel.find().sort({registration_date: -1}).limit(10);
        if( datax != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', result: datax })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }  
  }
}

/* get General Paper status */
exports.fetchGeneralPaperStatus = async(req, res) => {
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
        const datax = await paperModel.find({  paper_type: "General Paper", submit_status: "submit" })
        const angkaGPSubmit = datax.length > 0 ? datax.length : 0

        const doc = await paperModel.find({  paper_type: "General Paper", submit_status: "-" })
        const angkaGPNon = doc.length > 0 ? doc.length : 0        

        if( datax != null && doc != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', angkaGPSubmit: angkaGPSubmit, angkaGPNon: angkaGPNon, })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }
  }  
}

/* get REM status */
exports.fetchREMStatus = async(req, res) => {
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
        const datax = await paperModel.find({  paper_type: "Regional Economic Modeling Paper", submit_status: "submit" })
        const angkaREMSubmit = datax.length > 0 ? datax.length : 0

        const doc = await paperModel.find({  paper_type: "Regional Economic Modeling Paper", submit_status: "-" })
        const angkaREMNon = doc.length > 0 ? doc.length : 0        

        if( datax != null && doc != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', angkaREMSubmit: angkaREMSubmit, angkaREMNon: angkaREMNon, })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }
  }  
}

/* get Sharia */
exports.fetchShariaStatus = async(req, res) => {
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
        const datax = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit" })
        const angkaShariaSubmit = datax.length > 0 ? datax.length : 0

        const doc = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "-" })
        const angkaShariaNon = doc.length > 0 ? doc.length : 0        

        if( datax != null && doc != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', angkaShariaSubmit: angkaShariaSubmit, angkaShariaNon: angkaShariaNon, })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }
  }    
}

/* update paper_status and send notif success */
exports.successNotification = async(req, res) => {
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
        /* update data */
        const filter = { 'paper_code': req.body.data_papercode }
        const update = { 'paper_status': 'lolos' }
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
            subject: "Hasil Pengumuman Paper Submission",
            template: 'ejavec-notif-lolos',
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

/* update paper_status and send notif failed */
exports.failedNotification = async(req, res) => {
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
        /* update data */
        const filter = { 'paper_code': req.body.data_papercode }
        const update = { 'paper_status': 'gagal' }
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
            subject: "Hasil Pengumuman Paper Submission",
            template: 'ejavec-notif-tidaklolos',
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