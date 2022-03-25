const express = require('express')
const JWT = require('jsonwebtoken')

const userModel = require('../models/user_model')

const { ConnectionClosedEvent } = require('mongodb')
const date = require('date-and-time');

exports.register = (request, response) => {
  try {
    const now = new Date();

    const dataOptions = new userModel({
      name: request.body.data_nama,
      email: request.body.data_email,
      organization: request.body.data_organisasi,
      password: request.body.data_password,
      role: "peserta",
      status: "aktif",
      date_registered: date.format(now, 'DD/MM/YYYY HH:mm:ss')
    })
    console.log(dataOptions)
    
    // save to database
    // const posting = await dataOptions.save()

    // send email registration
    

  } catch (err) {
    console.log(err.message)
  }
}