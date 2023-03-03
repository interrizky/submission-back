const jwt = require('jsonwebtoken')
const date = require('date-and-time')
const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')
const path = require('path')

/* config and setup email */
const mail = require('../lib/email/send')

/* load model */
const userModel = require('../models/user_model')

/* format kode user */
const generateCodeUser = async() => {
  let number = await userModel.estimatedDocumentCount({}).exec()

  if(number > 0) {
    number = number+1
  } else {
    number = 1
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

/* button register pada halaman register */
exports.register = async(request, response) => {
  try {
    /* override date object */
    const now = new Date();

    /* create 5 digits random number */
    let min = 10000;
    let max = 90000;
    let rand = Math.floor(Math.random() * min) + max;

    /* call generate code user */
    let number = await generateCodeUser().then(result => result)
    let newNumber = 'UID-'+number

    /* hash password */
    passwordHash = bcrypt.hashSync(request.body.data_password, 10)

    const dataOptions = new userModel({
      userid_code: newNumber,
      name: request.body.data_nama,
      email: request.body.data_email,
      phone: request.body.data_handphone,
      organization: request.body.data_organisasi,
      password: passwordHash,
      role: "peserta",
      user_status: "inactive",
      registration_code: rand,
      registration_date: date.format(now, 'DD/MM/YYYY HH:mm:ss')
    })

    if( dataOptions !== null ) {
      /* save to database */
      const posting = dataOptions.save()
      
      if( posting ) {
        /* registrasi template */
        let mailOptions = {
          from: "EJAVEC Forum 2023 <submission@ejavec.org>",
          to: request.body.data_email,
          // cc: "submission@ejavec.org",
          bcc: ["interrizky@ymail.com", "submission@ejavec.org", "admin@ejavec.org"],
          subject: "Registrasi dan Kode Verifikasi",
          template: 'ejavec-registrasi', // the name of the template file i.e email.handlebars
          context:{
            nama: request.body.data_nama,
            kode: rand
          },
          attachments: [{
            filename: 'ejavec-forum-email-logo.png',
            path: path.join(__dirname, "../public/images/ejavec-forum-email-logo.png"),
            cid: 'ejavec-forum-email-logo'
          }],
        };

        /* trigger the sending of the E-mail */
        mail.sendMail(mailOptions, function(error, info){
          if(error){
            return console.log(error);
          }
          console.log('Message sent: ' + info.response);
        });           

        /* send response */
        response.status(200).send({ 
          message: "Registration Succeed! Check Your Email To Activate Your Account",
          status: "success",
          result: dataOptions
        })
      }
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

  /* newString for password */
  const newString = randomstring.generate({
    length: 8,
    charset: 'alphanumeric'
  })
  
  /* hash new password */
  passwordHash = bcrypt.hashSync(newString, 10);

  const filter = { 'email': req.body.data_email }
  const update = { 'password': passwordHash }
  const tada = await userModel.findOneAndUpdate(filter, update, {returnOriginal: false})

  if(data && tada && req.body.data_kode === 'passwd') {
    /* forgot password */
    let mailOptions = {
      from: "EJAVEC FORUM 2023 <submission@ejavec.org>",
      to: req.body.data_email,
      // cc: "submission@ejavec.org",
      bcc: ["interrizky@ymail.com", "submission@ejavec.org", "admin@ejavec.org"],
      subject: "Kode Password",
      template: 'ejavec-lupa-password', // the name of the template file i.e email.handlebars
      context:{
        password: newString,
      },
      attachments: [{
        filename: 'ejavec-forum-email-logo.png',
        path: path.join(__dirname, "../public/images/ejavec-forum-email-logo.png"),
        cid: 'ejavec-forum-email-logo'
      }],
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

  if(data && req.body.data_kode === 'sendcode') {
    let mailOptions = {
      from: "EJAVEC Forum 2023 <submission@ejavec.org>",
      to: req.body.data_email,
      // cc: "submission@ejavec.org",
      bcc: ["interrizky@ymail.com", "submission@ejavec.org", "admin@ejavec.org"],
      subject: "Kode Verifikasi",
      template: 'ejavec-verifikasi', // the name of the template file i.e email.handlebars
      context:{
        kode: data.registration_code,
      },
      attachments: [{
        filename: 'ejavec-forum-email-logo.png',
        path: path.join(__dirname, "../public/images/ejavec-forum-email-logo.png"),
        cid: 'ejavec-forum-email-logo'
      }],    
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
      res.status(200).send({ message: 'Typo Username or Password?' })
  } else {
    const data = await userModel.findOne( {'email': req.body.username} )

    if ( !data || !bcrypt.compareSync(req.body.passwd, data.password) || data === null || data === 'undefined' ) {
      res.status(200).send({ message: "Hey, Invalid username or password"})
    } else {
      let token = jwt.sign({
        email: data.email,
        role: data.role
      }, 'ejavecPrivKey' )

      let userData = {
        userid_code: data.userid_code,
        email: data.email,
        name: data.name,
        role: data.role,
        phone: data.phone,
        organization: data.organization,
        user_status: data.user_status,
        token: token,
        token_type: 'Bearer'        
      }
      res.status(200).send({message: "OK", result: userData})
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
