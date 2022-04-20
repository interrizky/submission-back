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
        const datax = await paperModel.find({ $or:[ {'paper_type': "General Paper"}, {'paper_type': "Regional Economic Modeling Paper"} ] })
        // const number = await paperModel.find({ $or:[ {'paper_type': "General Paper"}, {'paper_type': "Regional Economic Modeling Paper"} ] }).estimatedDocumentCount().exec()
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
        const filter = { paper_type: "Java Sharia Business Model" }   
        const datax = await paperModel.find(filter)
        // const number = await paperModel.find(filter).estimatedDocumentCount()
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