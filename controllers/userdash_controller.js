const express = require('express')
const fse = require('fs-extra')
const JWT = require('jsonwebtoken')
const { ConnectionClosedEvent } = require('mongodb')
const date = require('date-and-time')

/* load model */
const userModel = require('../models/user_model')
const paperModel = require('../models/paper_model')

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

const generateCodePaper = async() => {
  let number = await paperModel.estimatedDocumentCount({}).exec()

  if(number == 0) {
    number = 1
  } else {
    number + 1    
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

exports.savethepaper = async(req, res) => {
  try {
    if( req.files && req.body ) {
      /* override date object */
      const now = new Date()

      console.log(req.files)
      // console.log(req.files['paper_file'][0].originalname)
      console.log(req.body)      
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

      console.log(req.body['jenis_paper_text'])
      console.log(req.body['kategori'])

      /* call generate code paper */
      let number = await generateCodePaper().then(result => result)
      console.log(number)

      /* generate paper code */
      let registration_code = huruf+number
      console.log(registration_code)

      /* initiate variable to save */
      let dataOptions = new paperModel()

      if( dataOptions!==null ) {
        console.log(dataOptions)
        const save = await dataOptions.save();
      }

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
      res.send({ status: "200", message: "Save & Upload Paper Succeed" })
    } else {
      res.send({ status: "404", message: "File Not Found or Invalid Input" })
    } 
  } catch (error) {
    res.send({ status: "404", message: error })    
  }
}