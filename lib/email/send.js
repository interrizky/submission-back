const nodemailer = require("nodemailer")
const hbs = require('nodemailer-express-handlebars')
const path = require('path')

/* Load environment variables from .env file */
require("dotenv").config()

/* initialize nodemailer */
const smtp = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWD
  },
  logger: true,
  debug: true,
});

/* point to the template folder */
const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve('./lib/email/templates/'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./lib/email/templates/'),
};

/* use a template file with nodemailer */
smtp.use('compile', hbs(handlebarOptions))

/* export modules */
module.exports = smtp

