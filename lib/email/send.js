// import nodemailer from "nodemailer";
// import fs from "fs";
// import ejs from "ejs";
// import { htmlToText } from "html-to-text";
// import juice from "juice";

const nodemailer = require("nodemailer");
const fs = require("fs");
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

// initialize nodemailer
const smtp = nodemailer.createTransport({
  host: 'SMTP.office365.com',
  port: '587',
  secure:false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  logger: true,
  debug: true,
});

// point to the template folder
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./lib/email/templates/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./lib/email/templates/'),
};

// use a template file with nodemailer
smtp.use('compile', hbs(handlebarOptions))

//export modules
module.exports = smtp

