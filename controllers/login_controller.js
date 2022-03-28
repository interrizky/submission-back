const express = require('express')
const JWT = require('jsonwebtoken')
const { ConnectionClosedEvent } = require('mongodb')
const date = require('date-and-time')

// config and setup email
const mail = require('../lib/email/send')
// load model
const userModel = require('../models/user_model')

exports.register = (request, response) => {
  try {
    const now = new Date();

    const dataOptions = new userModel({
      name: request.body.data_nama,
      email: request.body.data_email,
      handphone: request.body.data_handphone,
      organization: request.body.data_organisasi,
      password: request.body.data_password,
      role: "peserta",
      status: "aktif",
      date_registered: date.format(now, 'DD/MM/YYYY HH:mm:ss')
    })

    if(dataOptions !== null) {
      console.log(dataOptions)
      
      // save to database
      // const posting = await dataOptions.save()    

      // registrasi
      let mailOptions = {
        from: "EJAVEC 2022 <submission@ejavec.org>",
        to: request.body.data_email,
        cc: "interrizky@ymail.com",
        subject: "Registrasi dan Kode Verifikasi",
        template: 'ejavec-registrasi', // the name of the template file i.e email.handlebars
        context:{
          nama: request.body.data_nama, // replace {{name}} with Adebola
          kode: request.body.data_password+date.format(now, 'DD/MM/YYYY HH:mm:ss') // replace {{company}} with My Company
        }
      };

      // trigger the sending of the E-mail
      mail.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });           

      //send response
      response.status(200).send({ 
        message: "Registration Succeed",
        result: dataOptions
       })
    } else {
      response.status(204).send({ 
        message: "Failed To Register" 
      })
    }
    
  } catch (err) {
    console.log(err.message)
  }
}