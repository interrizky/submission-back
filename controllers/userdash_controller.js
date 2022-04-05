const express = require('express')
const fs = require('fs')
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
  let number = await paperModel.countDocuments({}).exec()

  if(number === 0) {
    number = 1
  } else {
    number + 1    
  }

  let newNumber = ""
  if( number >= 0 && number <= 9 ) {
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

      // console.log(req.files)
      // console.log(req.files['paper_file'][0].originalname)
      // console.log(req.body)      
      // console.log(req.body['judul'][0])

      /* call generate code paper */
      let number = await generateCodePaper().then(result => result)
      // console.log(number)

      /* generate huruf */
      let huruf = ""
      if( req.body['jenis_paper_text'][0] === 'General Paper' && req.body['kategori'][0] === 'Mahasiswa'  ) {
        huruf = "GPM-"
      } else if( req.body['jenis_paper_text'][0] === 'General Paper' && req.body['kategori'][0] === 'Umum'  ) {
        huruf = "GPU-"
      } else if( req.body['jenis_paper_text'][0] === 'Regional Economic Modeling Paper'  ) {
        huruf = "REM-"
      } else {
        huruf = "SJC-"
      }

      // console.log(req.body['jenis_paper_text'][0])
      // console.log(req.body['kategori'][0])

      /* generate paper code */
      let registration_code = huruf+number
      console.log(registration_code)

      /* initiate variable to save */
      let dataOptions = new paperModel({
        paper_code : registration_code,
        participation_code : "-",
        title : req.body['judul'],
        paper_type : req.body['jenis_paper_text'][0],
        sub_theme : req.body['sub_tema_text'],  
        category : req.body['kategori'][0],
        participation_type : req.body['keikutsertaan'],
        upload_date : date.format(now, 'DD/MM/YYYY HH:mm:ss'),
        submission_date : "-",
        cv_fileName_1 : req.files['cv_file'][0].filename,
        cv_filePath_1 : 'uploads/' + registration_code + '/' + req.files['cv_file'][0].filename,
        cv_fileType_1 : req.files['cv_file'][0].mimetype,
        cv_fileSize_1 : fileSizeFormatter(req.files['cv_file'][0].filename, 0),
        paper_fileName_1 : req.files['paper_file'][0].filename,
        paper_filePath_1 : 'uploads/' + registration_code + '/' + req.files['paper_file'][0].filename,
        paper_fileType_1 : req.files['paper_file'][0].mimetype,
        paper_fileSize_1 : fileSizeFormatter(req.files['paper_file'][0].filename, 0),
        pernyataan_fileName_1 : req.files['pernyataan_file'][0].filename,
        pernyataan_filePath_1 : 'uploads/' + registration_code + '/' + req.files['pernyataan_file'][0].filename,
        pernyataan_fileType_1 : req.files['pernyataan_file'][0].mimetype,
        pernyataan_fileSize_1 : fileSizeFormatter(req.files['pernyataan_file'][0].filename, 0),
        lampiran_fileName_1 : req.files['lampiran_file'][0].filename,
        lampiran_filePath_1 : 'uploads/' + registration_code + '/' + req.files['lampiran_file'][0].filename,
        lampiran_fileType_1 : req.files['lampiran_file'][0].mimetype,
        lampiran_fileSize_1 : fileSizeFormatter(req.files['lampiran_file'][0].filename, 0),
      })

      if( req.body['keikutsertaan'][0] === 'Group' ) {
        dataOptions.append({
          name_2 : req.body['name_2'][0],
          phone_2 : req.body['phone_2'][0],
          organization_2 : req.body['organization_2'][0],
          cv_fileName_2 : req.files['cv_file_2'][0].filename,
          cv_filePath_2 : 'uploads/' + registration_code + '/' + req.files['cv_file_2'][0].filename,
          cv_fileType_2 : req.files['cv_file_2'][0].mimetype,
          cv_fileSize_2 : fileSizeFormatter(req.files['cv_file_2'][0].filename, 0)
        })

        if( req.body['name_3'][0] !== '' ||  req.body['name_3'][0] !== null ) {
          dataOptions.append({
            name_3 : req.body['name_3'][0],
            phone_3 : req.body['phone_3'][0],
            organization_3 : req.body['organization_3'][0],
            cv_fileName_3 : req.files['cv_file_3'][0].filename,
            cv_filePath_3 : 'uploads/' + registration_code + '/' + req.files['cv_file_3'][0].filename,
            cv_fileType_3 : req.files['cv_file_3'][0].mimetype,
            cv_fileSize_3 : fileSizeFormatter(req.files['cv_file_3'][0].filename, 0)
          })
        }
      }

      // for( let pair of dataOptions.entries() ) {
      //   console.log(pair[0] + ' ,' + pair[1])
      // }

      /* save to mongodb */
      const save = await dataOptions.save();

      console.log(registration_code)

      /* cek apakah ada file dalam folder tersebut, kalo ada file tsb dipindahin ke direktori yang diinginkan */
      if( req.files['paper_file'] ) {
        fse.move(req.files['paper_file'][0].path, './uploads/' + registration_code + '/' + req.files['paper_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
          console.log('success paper_file!')
        })
      }
      if( req.files['cv_file'] ) {
        fse.move(req.files['cv_file'][0].path, './uploads/' + registration_code + '/' + req.files['cv_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
          console.log('success cv_file!')
        })         
      }
      if( req.files['pernyataan_file'] ) {
        fse.move(req.files['pernyataan_file'][0].path, './uploads/' + registration_code + '/' + req.files['pernyataan_file'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
          console.log('success pernyataan_file!')
        })         
      }
      if( req.files['lampiran'] ) {
        fse.move(req.files['lampiran'][0].path, './uploads/' + registration_code + '/' + req.files['lampiran'][0].originalname, { overwrite: true }, err => {
          if (err) return console.error(err)
          console.log('success lampiran!')
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