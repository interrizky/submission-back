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