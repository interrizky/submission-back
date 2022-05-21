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

          const datax = await paperModel.find(filter).sort({createdAt: -1})
          const number = datax.length > 0 ? datax.length : 0

          if( datax != null ) {
            res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax, number: number })
          } else {
            res.send({ status: 'failed', message: 'Fetching Table Failed' })
          }
        } else {
          const filter = { submit_status: 'submit', paper_type: {$in: ['General Paper', 'Regional Economic Modeling Paper']} }

          const datax = await paperModel.find(filter).sort({createdAt : -1})
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

          const datax = await paperModel.find(filter).sort({createdAt: -1})
          const number = datax.length > 0 ? datax.length : 0

          if( datax != null ) {
            res.send({ status: 'success', message: 'Fetching Table Succeed', result: datax, number: number })
          } else {
            res.send({ status: 'failed', message: 'Fetching Table Failed' })
          }
        } else {
          const filter = { submit_status: 'submit', paper_type: {$in: ['Java Sharia Business Model']} }

          const datax = await paperModel.find(filter).sort({createdAt : -1})
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
        const datax = await userModel.find().sort({createdAt: -1}).limit(10);
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
          /* mailOptions */
          let mailOptions = {
            from: "EJAVEC FORUM 2022 <info@ejavec.org>",
            to: req.body.data_email,
            cc: "info@ejavec.org",
            bcc: "interrizky@ymail.com",
            subject: "Hasil Pengumuman Paper Submission",
            template: 'ejavec-notif-lolos',
            context: {
              nama: req.body.data_name,
              judul: req.body.data_title,
              subTema: req.body.data_subtheme,
              noReg: req.body.data_papercode
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
          /* mailOptions */
          let mailOptions = {
            from: "EJAVEC FORUM 2022 <info@ejavec.org>",
            to: req.body.data_email,
            cc: "info@ejavec.org",
            bcc: "interrizky@ymail.com",
            subject: "Hasil Pengumuman Paper Submission",
            template: 'ejavec-notif-tidaklolos',
            context: {
              nama: req.body.data_name,
              judul: req.body.data_title,
              subTema: req.body.data_subtheme,
              noReg: req.body.data_papercode
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

/* fetch paper jenis General Paper di-filter dari Tema */
exports.fetchGeneralPaperByTheme = async(req, res) => {
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
        const tema1Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Strategi dan inovasi pengembangan UMKM untuk masuk dalam Global Value Chain dalam upaya mendorong akselerasi ekspor di Jawa Timur.' })
        const tema2Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Peran digitalisasi dalam mendukung akselerasi pemulihan ekonomi Jawa Timur. Diharapkan paper dapat diaplikasikan dan direplikasi, misalnya dengan menghitung dampak digitalisasi (misalnya: dengan adanya digitalisasi, berapa potensi korupsi/ fraud yang hilang, benchmarking dampak digitalasi yang dapat dihitung secara kuantitatif/ kualitatif).' })
        const tema3Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Optimalisasi peran Jawa Timur sebagai hub perdagangan kawasan timur Indonesia dan produsen utama perdagangan antar daerah dalam upaya mendorong percepatan pemulihan ekonomi Jawa Timur.' })
        const tema4Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Strategi dan inovasi akselerasi daya saing ekspor luar negeri Jawa Timur menuju Lead Export Industri Manufaktur.' })
        const tema5Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Optimalisasi kinerja sektor pariwisata (hospitality) Jawa Timur di tengah pandemi COVID-19 dan strategi mendorong pemulihannya.' })
        const tema6Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Peningkatan daya saing investasi Jawa Timur di tengah kompetisi global dan potensi divestasi.' })
        const tema7Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Strategi mendorong peningkatan pangsa ekonomi syariah di Jawa Timur melalui sinergi para pelaku ekonomi syariah Jawa Timur dan optimalisasi kawasan industri halal.'})
        const tema8Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Evaluasi kinerja Industri Pengolahan Jawa Timur dan strategi akselerasi pemulihannya dengan mempertimbangkan konsep green economy.'})        

        const tema1Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Strategi dan inovasi pengembangan UMKM untuk masuk dalam Global Value Chain dalam upaya mendorong akselerasi ekspor di Jawa Timur.' })
        const tema2Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Peran digitalisasi dalam mendukung akselerasi pemulihan ekonomi Jawa Timur. Diharapkan paper dapat diaplikasikan dan direplikasi, misalnya dengan menghitung dampak digitalisasi (misalnya: dengan adanya digitalisasi, berapa potensi korupsi/ fraud yang hilang, benchmarking dampak digitalasi yang dapat dihitung secara kuantitatif/ kualitatif).' })
        const tema3Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Optimalisasi peran Jawa Timur sebagai hub perdagangan kawasan timur Indonesia dan produsen utama perdagangan antar daerah dalam upaya mendorong percepatan pemulihan ekonomi Jawa Timur.' })
        const tema4Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Strategi dan inovasi akselerasi daya saing ekspor luar negeri Jawa Timur menuju Lead Export Industri Manufaktur.' })
        const tema5Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Optimalisasi kinerja sektor pariwisata (hospitality) Jawa Timur di tengah pandemi COVID-19 dan strategi mendorong pemulihannya.' })
        const tema6Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Peningkatan daya saing investasi Jawa Timur di tengah kompetisi global dan potensi divestasi.' })
        const tema7Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Strategi mendorong peningkatan pangsa ekonomi syariah di Jawa Timur melalui sinergi para pelaku ekonomi syariah Jawa Timur dan optimalisasi kawasan industri halal.'})
        const tema8Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Evaluasi kinerja Industri Pengolahan Jawa Timur dan strategi akselerasi pemulihannya dengan mempertimbangkan konsep green economy.'})                

        const angkaTema1Mhs = tema1Mhs.length > 0 ? tema1Mhs.length : 0
        const angkaTema2Mhs = tema2Mhs.length > 0 ? tema2Mhs.length : 0     
        const angkaTema3Mhs = tema3Mhs.length > 0 ? tema3Mhs.length : 0
        const angkaTema4Mhs = tema4Mhs.length > 0 ? tema4Mhs.length : 0
        const angkaTema5Mhs = tema5Mhs.length > 0 ? tema5Mhs.length : 0
        const angkaTema6Mhs = tema6Mhs.length > 0 ? tema6Mhs.length : 0
        const angkaTema7Mhs = tema7Mhs.length > 0 ? tema7Mhs.length : 0
        const angkaTema8Mhs = tema8Mhs.length > 0 ? tema8Mhs.length : 0

        const angkaTema1Non = tema1Non.length > 0 ? tema1Non.length : 0
        const angkaTema2Non = tema2Non.length > 0 ? tema2Non.length : 0     
        const angkaTema3Non = tema3Non.length > 0 ? tema3Non.length : 0
        const angkaTema4Non = tema4Non.length > 0 ? tema4Non.length : 0
        const angkaTema5Non = tema5Non.length > 0 ? tema5Non.length : 0
        const angkaTema6Non = tema6Non.length > 0 ? tema6Non.length : 0
        const angkaTema7Non = tema7Non.length > 0 ? tema7Non.length : 0
        const angkaTema8Non = tema8Non.length > 0 ? tema8Non.length : 0        

        if( tema1Mhs && tema2Mhs && tema3Mhs && tema4Mhs && tema5Mhs && tema6Mhs && tema7Mhs && tema8Mhs && 
          tema1Non && tema2Non && tema3Non && tema4Non && tema5Non && tema6Non && tema7Non && tema8Non ) {
          res.send({ 
            status: 'success', 
            message: 'Fetching Succeed',
            angkaMhs: [angkaTema1Mhs, angkaTema2Mhs, angkaTema3Mhs, angkaTema4Mhs, angkaTema5Mhs, angkaTema6Mhs, angkaTema7Mhs, angkaTema8Mhs],
            angkaNon: [angkaTema1Non, angkaTema2Non, angkaTema3Non, angkaTema4Non, angkaTema5Non, angkaTema6Non, angkaTema7Non, angkaTema8Non]            
          })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }
  }    
}

/* fetch paper jenis REM di-filter dari Tema */
exports.fetchREMByTheme = async(req, res) => {
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
        const tema1 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Model proyeksi/forecasting pertumbuhan ekonomi Jawa Timur dan turunannya (Sisi Permintaan)' })
        const tema2 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Model proyeksi/forecasting pertumbuhan ekonomi Jawa Timur dan turunannya (Sisi Penawaran)' })
        const tema3 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Simulasi berbagai dampak isu strategis terhadap ketahanan perekonomian Jawa Timur' })
        const tema4 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Simulasi berbagai opsi kebijakan, baik kebijakan moneter, makroprudensial, mikroprudensial, fiskal, maupun kebijakan pemerintah pusat dan daerah, serta kebijakan negara lain terhadap perekonomian Jawa Timur.' })
        const tema5 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Fundamental pertumbuhan ekonomi Jawa Timur ke depan' })

        const angkaTema1 = tema1.length > 0 ? tema1.length : 0
        const angkaTema2 = tema2.length > 0 ? tema2.length : 0     
        const angkaTema3 = tema3.length > 0 ? tema3.length : 0
        const angkaTema4 = tema4.length > 0 ? tema4.length : 0
        const angkaTema5 = tema5.length > 0 ? tema5.length : 0

        if( tema1 != null && tema2 != null && tema3 != null && tema4 != null && tema5 != null ) {
          res.send({ 
            status: 'success', 
            message: 'Fetching Succeed', 
            angkaTema1: angkaTema1,
            angkaTema2: angkaTema2,
            angkaTema3: angkaTema3,
            angkaTema4: angkaTema4,
            angkaTema5: angkaTema5          
          })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }
  }    
}

/* fetch paper jenis Sharia di-filter dari Tema */
exports.fetchShariaByTheme = async(req, res) => {
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
        const tema1 = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit", sub_theme: 'Food' })
        const tema2 = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit", sub_theme: 'Fashion'})
        const tema3 = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit", sub_theme: 'Finance (meliputi juga instrumen keuangan syariah)'})
        const tema4 = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit", sub_theme: 'Integrated Farming'})
        const tema5 = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit", sub_theme: 'Renewable Energy'})
        const tema6 = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit", sub_theme: 'Fundutainment (industri kreatif meliputi aplikasi, games, film, musik, arsitektur, desain dan seni pertunjukan)'})
        const tema7 = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit", sub_theme: 'Funtrepreneur (jasa/properti/socialpreneur/travel dll)'})

        const angkaTema1 = tema1.length > 0 ? tema1.length : 0
        const angkaTema2 = tema2.length > 0 ? tema2.length : 0     
        const angkaTema3 = tema3.length > 0 ? tema3.length : 0
        const angkaTema4 = tema4.length > 0 ? tema4.length : 0
        const angkaTema5 = tema5.length > 0 ? tema5.length : 0
        const angkaTema6 = tema6.length > 0 ? tema6.length : 0
        const angkaTema7 = tema7.length > 0 ? tema7.length : 0

        if( tema1 != null && tema2 != null && tema3 != null && tema4 != null && tema5 != null && tema6 != null && tema7 != null ) {
          res.send({ 
            status: 'success', 
            message: 'Fetching Succeed', 
            angkaTema1: angkaTema1,
            angkaTema2: angkaTema2,
            angkaTema3: angkaTema3,
            angkaTema4: angkaTema4,
            angkaTema5: angkaTema5,
            angkaTema6: angkaTema6,
            angkaTema7: angkaTema7,
          })
        } else {
          res.send({ status: 'failed', message: 'Fetching Failed' })
        }
      }
    }
  }    
}