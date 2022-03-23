const express = require('express')
const JWT = require('jsonwebtoken')

const userModel = require('../models/user_model')

const { ConnectionClosedEvent } = require('mongodb')

exports.register = (request, response) => {
  console.log(request.body)
}