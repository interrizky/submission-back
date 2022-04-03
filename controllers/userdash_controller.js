const express = require('express')
const JWT = require('jsonwebtoken')
const { ConnectionClosedEvent } = require('mongodb')
const date = require('date-and-time')

/* load model */
const userModel = require('../models/user_model')

exports.savethepaper = function (req, res) {
  console.log(req.headers)
}