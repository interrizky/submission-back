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
        const datax = await userModel.find({ role: "peserta", user_status: "active" }).sort({ userid_code: "asc" })
        const activeNumber = datax.length > 0 ? datax.length : 0

        let activeData = []

        for( let i=0; i<datax.length; i++ ) {
          activeData[i] = {
            NO : i+1, 
            USERID_CODE : datax[i].userid_code,
            NAME : datax[i].name,
            ORGANIZATION : datax[i].organization,
            PHONE : datax[i].phone,
            EMAIL : datax[i].email,
            REGISTRATION_DATE : datax[i].registration_date            
          }
        }

        const dataxx = await userModel.find({ role: "peserta", user_status: "inactive" })
        const nonActiveNumber = dataxx.length > 0 ? dataxx.length : 0

        let inactiveData = []

        for( let i=0; i<dataxx.length; i++ ) {
          inactiveData[i] = {
            NO : i+1, 
            USERID_CODE : dataxx[i].userid_code,
            NAME : dataxx[i].name,
            ORGANIZATION : dataxx[i].organization,
            PHONE : dataxx[i].phone,
            EMAIL : dataxx[i].email,
            REGISTRATION_DATE : dataxx[i].registration_date            
          }
        }

        if( datax != null && dataxx != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', resultActive: activeData, resultInactive: inactiveData, activeNumber: activeNumber, nonActiveNumber: nonActiveNumber })
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
        let listGP = []
        let listREM = []
        let listSharia = []
        
        const datax = await paperModel.find({ paper_type: "General Paper" }).sort({ title: "asc" })
        const angkaGP = datax.length > 0 ? datax.length : 0

        for( let i=0; i<datax.length; i++ ) {
          listGP[i] = {
            NO : i+1, 
            PAPER_CODE : datax[i].paper_code,
            USERID_CODE : datax[i].userid_code,
            JUDUL : datax[i].title,
            JENIS_PAPER : datax[i].paper_type,
            TEMA : datax[i].sub_theme,
            KATEGORI : datax[i].category,
            JENIS_PARTISIPASI : datax[i].participation_type,
            TANGGAL_UPLOAD : datax[i].upload_date,
            TANGGAL_SUBMIT : datax[i].submission_date,
            STATUS_SUBMISSION : datax[i].submit_status,
            STATUS_PAPER : datax[i].paper_status,
            NAMA_PESERTA_1 : datax[i].name_1,
            TLP_PESERTA_1 : datax[i].phone_1,
            INSTANSI_PESERTA_1 : datax[i].organization_1,
            EMAIL : datax[i].email_1,
            NAMA_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].name_2, 
            TLP_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].phone_2,
            INSTANSI_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].organization_2,
            NAMA_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].name_3, 
            TLP_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].phone_3,
            INSTANSI_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].organization_3
          }    
        }          

        const dataxx = await paperModel.find({  paper_type: "Regional Economic Modeling Paper" }).sort({ title: "asc" })
        const angkaREM = dataxx.length > 0 ? dataxx.length : 0

        for( let i=0; i<dataxx.length; i++ ) {
          listREM[i] = {
            NO : i+1, 
            PAPER_CODE : dataxx[i].paper_code,
            USERID_CODE : dataxx[i].userid_code,
            JUDUL : dataxx[i].title,
            JENIS_PAPER : dataxx[i].paper_type,
            TEMA : dataxx[i].sub_theme,
            KATEGORI : dataxx[i].category,
            JENIS_PARTISIPASI : dataxx[i].participation_type,
            TANGGAL_UPLOAD : dataxx[i].upload_date,
            TANGGAL_SUBMIT : dataxx[i].submission_date,
            STATUS_SUBMISSION : dataxx[i].submit_status,
            STATUS_PAPER : dataxx[i].paper_status,
            NAMA_PESERTA_1 : dataxx[i].name_1,
            TLP_PESERTA_1 : dataxx[i].phone_1,
            INSTANSI_PESERTA_1 : dataxx[i].organization_1,
            EMAIL : dataxx[i].email_1,
            NAMA_PESERTA_2 : ( dataxx[i].participation_type == 'Individu' ) ? '-' : dataxx[i].name_2, 
            TLP_PESERTA_2 : ( dataxx[i].participation_type == 'Individu' ) ? '-' : dataxx[i].phone_2,
            INSTANSI_PESERTA_2 : ( dataxx[i].participation_type == 'Individu' ) ? '-' : dataxx[i].organization_2,
            NAMA_PESERTA_3 : ( dataxx[i].participation_type == 'Individu' ) ? '-' : dataxx[i].name_3, 
            TLP_PESERTA_3 : ( dataxx[i].participation_type == 'Individu' ) ? '-' : dataxx[i].phone_3,
            INSTANSI_PESERTA_3 : ( dataxx[i].participation_type == 'Individu' ) ? '-' : dataxx[i].organization_3
          }
        }         

        const dataxxx = await paperModel.find({  paper_type: "Java Sharia Business Model" }).sort({ title: "asc" })
        const angkaSharia = dataxxx.length > 0 ? dataxxx.length : 0

        for( let i=0; i<dataxxx.length; i++ ) {
          listSharia[i] = {
            NO : i+1, 
            PAPER_CODE : dataxxx[i].paper_code,
            USERID_CODE : dataxxx[i].userid_code,
            JUDUL : dataxxx[i].title,
            JENIS_PAPER : dataxxx[i].paper_type,
            TEMA : dataxxx[i].sub_theme,
            KATEGORI : dataxxx[i].category,
            JENIS_PARTISIPASI : dataxxx[i].participation_type,
            TANGGAL_UPLOAD : dataxxx[i].upload_date,
            TANGGAL_SUBMIT : dataxxx[i].submission_date,
            STATUS_SUBMISSION : dataxxx[i].submit_status,
            STATUS_PAPER : dataxxx[i].paper_status,
            NAMA_PESERTA_1 : dataxxx[i].name_1,
            INSTANSI_PESERTA_1 : dataxxx[i].organization_1,
            EMAIL : dataxxx[i].email_1,            
            TLP_PESERTA_1 : dataxxx[i].phone_1,
            NAMA_PESERTA_2 : ( dataxxx[i].participation_type == 'Individu' ) ? '-' : dataxxx[i].name_2, 
            TLP_PESERTA_2 : ( dataxxx[i].participation_type == 'Individu' ) ? '-' : dataxxx[i].phone_2,
            INSTANSI_PESERTA_2 : ( dataxxx[i].participation_type == 'Individu' ) ? '-' : dataxxx[i].organization_2,
            NAMA_PESERTA_3 : '-',
            TLP_PESERTA_3 : '-',
            INSTANSI_PESERTA_3 : '-'
          }
        }  

        if( datax != null && dataxx != null && dataxxx != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', listGP: listGP, listREM: listREM, listSharia: listSharia, angkaGP: angkaGP, angkaREM: angkaREM, angkaSharia: angkaSharia })
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
        const datax = await userModel.find({ user_status: 'active', role: 'peserta' }).sort({createdAt: -1}).limit(10);
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
        listSubmitGP = []
        listNotSubmitGP = []

        const datax = await paperModel.find({  paper_type: "General Paper", submit_status: "submit" }).sort({ title: 'asc' })
        const angkaGPSubmit = datax.length > 0 ? datax.length : 0

        for( let i=0; i<datax.length; i++ ) {
          listSubmitGP[i] = {
            NO : i+1, 
            PAPER_CODE : datax[i].paper_code,
            USERID_CODE : datax[i].userid_code,
            JUDUL : datax[i].title,
            JENIS_PAPER : datax[i].paper_type,
            TEMA : datax[i].sub_theme,
            KATEGORI : datax[i].category,
            JENIS_PARTISIPASI : datax[i].participation_type,
            TANGGAL_UPLOAD : datax[i].upload_date,
            TANGGAL_SUBMIT : datax[i].submission_date,
            STATUS_SUBMISSION : datax[i].submit_status,
            STATUS_PAPER : datax[i].paper_status,
            NAMA_PESERTA_1 : datax[i].name_1,
            TLP_PESERTA_1 : datax[i].phone_1,
            INSTANSI_PESERTA_1 : datax[i].organization_1,
            EMAIL : datax[i].email_1,
            NAMA_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].name_2, 
            TLP_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].phone_2,
            INSTANSI_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].organization_2,
            NAMA_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].name_3, 
            TLP_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].phone_3,
            INSTANSI_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].organization_3
          }
        }          

        const doc = await paperModel.find({  paper_type: "General Paper", submit_status: "-" }).sort({ title: 'asc' })
        const angkaGPNon = doc.length > 0 ? doc.length : 0
        
        for( let i=0; i<doc.length; i++ ) {
          listNotSubmitGP[i] = {
            NO : i+1, 
            PAPER_CODE : doc[i].paper_code,
            USERID_CODE : doc[i].userid_code,
            JUDUL : doc[i].title,
            JENIS_PAPER : doc[i].paper_type,
            TEMA : doc[i].sub_theme,
            KATEGORI : doc[i].category,
            JENIS_PARTISIPASI : doc[i].participation_type,
            TANGGAL_UPLOAD : doc[i].upload_date,
            TANGGAL_SUBMIT : doc[i].submission_date,
            STATUS_SUBMISSION : doc[i].submit_status,
            STATUS_PAPER : doc[i].paper_status,
            NAMA_PESERTA_1 : doc[i].name_1,
            TLP_PESERTA_1 : doc[i].phone_1,
            INSTANSI_PESERTA_1 : doc[i].organization_1,
            EMAIL : doc[i].email_1,
            NAMA_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].name_2, 
            TLP_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].phone_2,
            INSTANSI_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].organization_2,
            NAMA_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].name_3, 
            TLP_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].phone_3,
            INSTANSI_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].organization_3
          }
        }          

        if( datax != null && doc != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', listSubmitGP: listSubmitGP, listNotSubmitGP: listNotSubmitGP, angkaGPSubmit: angkaGPSubmit, angkaGPNon: angkaGPNon, })
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
        let listSubmitREM = []
        let listNotSubmitREM = []

        const datax = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit" }).sort({ title: 'asc' })
        const angkaREMSubmit = datax.length > 0 ? datax.length : 0

        for( let i=0; i<datax.length; i++ ) {
          listSubmitREM[i] = {
            NO : i+1, 
            PAPER_CODE : datax[i].paper_code,
            USERID_CODE : datax[i].userid_code,
            JUDUL : datax[i].title,
            JENIS_PAPER : datax[i].paper_type,
            TEMA : datax[i].sub_theme,
            KATEGORI : datax[i].category,
            JENIS_PARTISIPASI : datax[i].participation_type,
            TANGGAL_UPLOAD : datax[i].upload_date,
            TANGGAL_SUBMIT : datax[i].submission_date,
            STATUS_SUBMISSION : datax[i].submit_status,
            STATUS_PAPER : datax[i].paper_status,
            NAMA_PESERTA_1 : datax[i].name_1,
            TLP_PESERTA_1 : datax[i].phone_1,
            INSTANSI_PESERTA_1 : datax[i].organization_1,
            EMAIL : datax[i].email_1,
            NAMA_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].name_2, 
            TLP_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].phone_2,
            INSTANSI_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].organization_2,
            NAMA_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].name_3, 
            TLP_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].phone_3,
            INSTANSI_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].organization_3
          }
        }           

        const doc = await paperModel.find({  paper_type: "Regional Economic Modeling Paper", submit_status: "-" }).sort({ title: 'asc' })
        const angkaREMNon = doc.length > 0 ? doc.length : 0 
        
        for( let i=0; i<doc.length; i++ ) {
          listNotSubmitREM[i] = {
            NO : i+1, 
            PAPER_CODE : doc[i].paper_code,
            USERID_CODE : doc[i].userid_code,
            JUDUL : doc[i].title,
            JENIS_PAPER : doc[i].paper_type,
            TEMA : doc[i].sub_theme,
            KATEGORI : doc[i].category,
            JENIS_PARTISIPASI : doc[i].participation_type,
            TANGGAL_UPLOAD : doc[i].upload_date,
            TANGGAL_SUBMIT : doc[i].submission_date,
            STATUS_SUBMISSION : doc[i].submit_status,
            STATUS_PAPER : doc[i].paper_status,
            NAMA_PESERTA_1 : doc[i].name_1,
            TLP_PESERTA_1 : doc[i].phone_1,
            INSTANSI_PESERTA_1 : doc[i].organization_1,
            EMAIL : doc[i].email_1,
            NAMA_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].name_2, 
            TLP_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].phone_2,
            INSTANSI_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].organization_2,
            NAMA_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].name_3, 
            TLP_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].phone_3,
            INSTANSI_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].organization_3
          }
        }          

        if( datax != null && doc != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', listSubmitREM: listSubmitREM, listNotSubmitREM: listNotSubmitREM, angkaREMSubmit: angkaREMSubmit, angkaREMNon: angkaREMNon })
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
        let listSubmitSharia = []
        let listNotSubmitSharia = []
        
        const datax = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "submit" })
        const angkaShariaSubmit = datax.length > 0 ? datax.length : 0

        for( let i=0; i<datax.length; i++ ) {
          listSubmitSharia[i] = {
            NO : i+1, 
            PAPER_CODE : datax[i].paper_code,
            USERID_CODE : datax[i].userid_code,
            JUDUL : datax[i].title,
            JENIS_PAPER : datax[i].paper_type,
            TEMA : datax[i].sub_theme,
            KATEGORI : datax[i].category,
            JENIS_PARTISIPASI : datax[i].participation_type,
            TANGGAL_UPLOAD : datax[i].upload_date,
            TANGGAL_SUBMIT : datax[i].submission_date,
            STATUS_SUBMISSION : datax[i].submit_status,
            STATUS_PAPER : datax[i].paper_status,
            NAMA_PESERTA_1 : datax[i].name_1,
            TLP_PESERTA_1 : datax[i].phone_1,
            INSTANSI_PESERTA_1 : datax[i].organization_1,
            EMAIL : ( datax[i].email_1 !== null || datax[i].email_1 !== undefined || datax[i].email_1 !== 'undefined' ) ? datax[i].email_1 : '-',
            NAMA_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].name_2, 
            TLP_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].phone_2,
            INSTANSI_PESERTA_2 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].organization_2,
            NAMA_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].name_3, 
            TLP_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].phone_3,
            INSTANSI_PESERTA_3 : ( datax[i].participation_type == 'Individu' ) ? '-' : datax[i].organization_3
          }
        }        

        const doc = await paperModel.find({  paper_type: "Java Sharia Business Model", submit_status: "-" })
        const angkaShariaNon = doc.length > 0 ? doc.length : 0   
        
        for( let i=0; i<doc.length; i++ ) {
          listNotSubmitSharia[i] = {
            NO : i+1, 
            PAPER_CODE : doc[i].paper_code,
            USERID_CODE : doc[i].userid_code,
            JUDUL : doc[i].title,
            JENIS_PAPER : doc[i].paper_type,
            TEMA : doc[i].sub_theme,
            KATEGORI : doc[i].category,
            JENIS_PARTISIPASI : doc[i].participation_type,
            TANGGAL_UPLOAD : doc[i].upload_date,
            TANGGAL_SUBMIT : doc[i].submission_date,
            STATUS_SUBMISSION : doc[i].submit_status,
            STATUS_PAPER : doc[i].paper_status,
            NAMA_PESERTA_1 : doc[i].name_1,
            TLP_PESERTA_1 : doc[i].phone_1,
            INSTANSI_PESERTA_1 : doc[i].organization_1,
            EMAIL : ( datax[i].email_1 !== null || datax[i].email_1 !== undefined || datax[i].email_1 !== 'undefined' ) ? datax[i].email_1 : '-',
            NAMA_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].name_2, 
            TLP_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].phone_2,
            INSTANSI_PESERTA_2 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].organization_2,
            NAMA_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].name_3, 
            TLP_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].phone_3,
            INSTANSI_PESERTA_3 : ( doc[i].participation_type == 'Individu' ) ? '-' : doc[i].organization_3
          }
        }        

        if( datax != null && doc != null ) {
          res.send({ status: 'success', message: 'Fetching Succeed', listSubmitSharia: listSubmitSharia, listNotSubmitSharia: listNotSubmitSharia, angkaShariaSubmit: angkaShariaSubmit, angkaShariaNon: angkaShariaNon, })
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
            from: "EJAVEC Forum 2023 <submission@ejavec.org>",
            to: req.body.data_email,
            // cc: "submission@ejavec.org",
            bcc: ["interrizky@ymail.com", "submission@ejavec.org", "admin@ejavec.org"],
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
            from: "EJAVEC Forum 2023 <submission@ejavec.org>",
            to: req.body.data_email,
            // cc: "submission@ejavec.org",
            bcc: ["interrizky@ymail.com", "submission@ejavec.org", "admin@ejavec.org"],
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
        const tema1Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Strategi Penguatan Nilai Tambah Sektor Pertanian Dan Manufaktur Untuk Memperkuat Ketahanan Ekonomi Jawa Timur.' })
        const tema2Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Strategi Mendorong Implementasi Green Economy Untuk Mendukung Ketahanan Ekonomi Jawa Timur Yang Berkelanjutan Dan Inklusif.' })
        const tema3Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Strategi Dan Inovasi Akselerasi Daya Saing Ekspor Luar Negeri Jawa Timur Di Tengah Peningkatan Ketidakpastian Global.' })
        const tema4Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Mendorong Inovasi Pembangunan Ekonomi Syariah di Jawa Timur Yang Inklusif dan Berkelanjutan.' })
        const tema5Mhs = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Mahasiswa', sub_theme: 'Strategi Mendorong Digitalisasi Ekonomi Untuk Mendukung Efisiensi Ekonomi Jawa Timur.' })

        const tema1Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Strategi Penguatan Nilai Tambah Sektor Pertanian Dan Manufaktur Untuk Memperkuat Ketahanan Ekonomi Jawa Timur.' })
        const tema2Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Strategi Mendorong Implementasi Green Economy Untuk Mendukung Ketahanan Ekonomi Jawa Timur Yang Berkelanjutan Dan Inklusif.' })
        const tema3Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Strategi Dan Inovasi Akselerasi Daya Saing Ekspor Luar Negeri Jawa Timur Di Tengah Peningkatan Ketidakpastian Global.' })
        const tema4Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Mendorong Inovasi Pembangunan Ekonomi Syariah di Jawa Timur Yang Inklusif dan Berkelanjutan.' })
        const tema5Non = await paperModel.find({ paper_type: "General Paper", submit_status: "submit", category: 'Umum', sub_theme: 'Strategi Mendorong Digitalisasi Ekonomi Untuk Mendukung Efisiensi Ekonomi Jawa Timur.' })

        const angkaTema1Mhs = tema1Mhs.length > 0 ? tema1Mhs.length : 0
        const angkaTema2Mhs = tema2Mhs.length > 0 ? tema2Mhs.length : 0     
        const angkaTema3Mhs = tema3Mhs.length > 0 ? tema3Mhs.length : 0
        const angkaTema4Mhs = tema4Mhs.length > 0 ? tema4Mhs.length : 0
        const angkaTema5Mhs = tema5Mhs.length > 0 ? tema5Mhs.length : 0

        const angkaTema1Non = tema1Non.length > 0 ? tema1Non.length : 0
        const angkaTema2Non = tema2Non.length > 0 ? tema2Non.length : 0     
        const angkaTema3Non = tema3Non.length > 0 ? tema3Non.length : 0
        const angkaTema4Non = tema4Non.length > 0 ? tema4Non.length : 0
        const angkaTema5Non = tema5Non.length > 0 ? tema5Non.length : 0        

        if( tema1Mhs && tema2Mhs && tema3Mhs && tema4Mhs && tema5Mhs && 
          tema1Non && tema2Non && tema3Non && tema4Non && tema5Non ) {
          res.send({ 
            status: 'success', 
            message: 'Fetching Succeed',
            angkaMhs: [angkaTema1Mhs, angkaTema2Mhs, angkaTema3Mhs, angkaTema4Mhs, angkaTema5Mhs],
            angkaNon: [angkaTema1Non, angkaTema2Non, angkaTema3Non, angkaTema4Non, angkaTema5Non]            
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
        const tema1 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Model Proyeksi/Forecasting/Determinan Pertumbuhan Ekonomi Jawa Timur Dan Turunannya (Sisi Permintaan).' })
        const tema2 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Model Proyeksi/Forecasting/Determinan Pertumbuhan Ekonomi Jawa Timur Dan Turunannya (Sisi Penawaran).' })
        const tema3 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Simulasi Berbagai Dampak Isu Strategis Terhadap Ketahanan Perekonomian Jawa Timur.' })
        const tema4 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Simulasi Berbagai Opsi Kebijakan, Baik Kebijakan Moneter, Makroprudensial, Mikroprudensial, Fiskal, Maupun Kebijakan Pemerintah Pusat Dan Daerah, Serta Kebijakan Negara Lain Terhadap Perekonomian Jawa Timur.' })
        const tema5 = await paperModel.find({ paper_type: "Regional Economic Modeling Paper", submit_status: "submit", sub_theme: 'Fundamental Pertumbuhan Ekonomi Jawa Timur Saat Ini dan Ke Depan.' })

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