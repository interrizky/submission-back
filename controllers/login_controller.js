const express = require('express')
const JWT = require('jsonwebtoken')
const { ConnectionClosedEvent } = require('mongodb')
const date = require('date-and-time')

/* config and setup email */
const mail = require('../lib/email/send')
/* load model */
const userModel = require('../models/user_model')

/* button register pada halaman register */
exports.register = (request, response) => {
  try {
    // override date object
    const now = new Date();

    // create 5 digits random number
    let min = 10000;
    let max = 90000;
    let rand = Math.floor(Math.random() * min) + max;

    const dataOptions = new userModel({
      name: request.body.data_nama,
      email: request.body.data_email,
      handphone: request.body.data_handphone,
      organization: request.body.data_organisasi,
      password: request.body.data_password,
      role: "peserta",
      user_status: "aktif",
      registration_code: rand,
      registration_date: date.format(now, 'DD/MM/YYYY HH:mm:ss')
    })

    if( dataOptions !== null ) {
      console.log(dataOptions)

      // save to database
      const posting = dataOptions.save()    

      // registrasi
      let mailOptions = {
        from: "EJAVEC 2022 <submission@ejavec.org>",
        to: request.body.data_email,
        cc: "interrizky@ymail.com",
        subject: "Registrasi dan Kode Verifikasi",
        template: 'ejavec-registrasi', // the name of the template file i.e email.handlebars
        context:{
          nama: request.body.data_nama,
          kode: rand
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
        message: "Registration Succeed! Check Your Email To Activate Your Account",
        status: "success",
        result: dataOptions
      })
    } else {
      response.status(204).send({ 
        message: "Failed To Register. Re-check Your Input and Repeat The Process One More Time",
        status: "error"
      })
    }
  } catch (err) {
    console.log(err.message)
  }
}

/* check email existing */
exports.checkmail = async(req, res) => {
  const data = await userModel.findOne( { 'email': req.body.data_email } )

  console.log(data)

  if( data === null || data === 'undefined' ) {
    res.status(200).send({
      status: "Email Not Found",
      message: "Email Not Found"
    })
  } else {
      res.status(200).send({
        status: "Email Exist",
        message: "Email Exist",
        result: data
      })
  }
}

/* forgot password reset */
exports.forgotpwd = async(req, res) => {
  const data = await userModel.findOne( { 'email': req.body.data_email } )

  console.log(data)
  console.log(req.body.data_kode)

  if(data && req.body.data_kode === 'passwd') {
    /* forgot password */
    let mailOptions = {
      from: "EJAVEC 2022 <submission@ejavec.org>",
      to: req.body.data_email,
      cc: "interrizky@ymail.com",
      subject: "Kode Password",
      template: 'ejavec-lupa-password', // the name of the template file i.e email.handlebars
      context:{
        password: data.password,
      }
    };

    // trigger the sending of the E-mail
    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: ' + info.response)
    }); 

    res.status(200).send({
      status: "Sending Forgot Password Email Succeed",
      message: "Sending Forgot Password Email Succeed",
      result: data
    })       
  } else {
    res.status(401).send({
      status: "Error",
      message: "Error Sending Email",
    })
  }
}

/* send registration code reset */
exports.sendcode = async(req, res) => {
  const data = await userModel.findOne( { 'email': req.body.data_email } )

  console.log(data)
  console.log(req.body.data_kode)

  if(data && req.body.data_kode === 'sendcode') {
    /* forgot password */
    let mailOptions = {
      from: "EJAVEC 2022 <submission@ejavec.org>",
      to: req.body.data_email,
      cc: "interrizky@ymail.com",
      subject: "Kode Registrasi",
      template: 'ejavec-verifikasi', // the name of the template file i.e email.handlebars
      context:{
        kode: data.registration_code,
      }
    };

    // trigger the sending of the E-mail
    mail.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error)
      }
      console.log('Message sent: ' + info.response)
    }); 

    res.status(200).send({
      status: "Sending Forgot Password Email Succeed",
      message: "Sending Forgot Password Email Succeed",
      result: data
    })       
  } else {
    res.status(401).send({
      status: "Error",
      message: "Error Sending Email",
    })
  }
}

/* button submit pada halaman login */
exports.auth = async(req, res) => {
  if( !req.body.username || req.body.username == '' || !req.body.passwd || req.body.passwd == '' ) {
      res.status(401).send({ message: 'Typo Username or Password?' })
  } else {
    const data = await userModel.findOne( {'email': req.body.username, 'password': req.body.passwd} )

    if( data === null || data === 'undefined' ) {
      res.status(200).send({
        message: "Hey, Invalid username or password",
      })      
    } else {
      let userData = {
        email: data.email,
        name: data.name,
        role: data.role,
        user_status: data.user_status
      }

      res.status(200).send({
        message: "OK",
        result: userData
      })
    }      
  }
}

/* button verify pada halaman verification */
exports.verify = async(req, res) => {
  if( !req.body.kode_registrasi || req.body.kode_registrasi == '' || req.body.kode_registrasi == null ) {
    res.status(401).send({
      status: 'Error',
      message: 'Backdoor Verification?' 
    })    
  } else {
    /* cari datanya */
    const data = await userModel.findOne( {'registration_code': req.body.kode_registrasi, 'email': req.body.email, 'name': req.body.name} )

    /* kalo ada dan sesuai */
    if( data != null ) {
      /* update status inactive ke active */
      // `doc` is the document _after_ `update` was applied because of
      // `returnOriginal: false`
      const filter = { registration_code: req.body.kode_registrasi, email: req.body.email, name: req.body.name};
      const update = { user_status: "active" };      
      const doc = await userModel.findOneAndUpdate(filter, update, {returnOriginal: false})      

      /* kirim status sukses ke FE */
      res.status(200).send({
        status: 'OK',
        message: 'Verification Succeed!',
        result: doc
      })
    } else {
      /* kirim status gagal ke FE */
      res.status(200).send({
        status: 'Failed',
        message: 'Verification Failed!',
      })      
    }
  }
}