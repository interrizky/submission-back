const express = require('express');
const path = require('path');
const cors = require('cors');
const http = require('http');
// const https = require('https');
const morgan = require('morgan'); 
const dotenv = require('dotenv')

/* load dotenv */
dotenv.config();

/* set up */
const port = process.env.PORT || 8080;
const app = express();

/* use CORS for all */
app.use(cors());

/* for app running connection with port and Mongo database */
const server = http.createServer(app)
// const server = https.createServer(app)
server.listen(port, () => { console.log(`Server is running in port ${ port }`) })

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use("/images", express.static(path.join(__dirname, "public/images")));

/* Reading Folders & Files in Public Folder */
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, '/public')));
// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

/* for parsing application/xwww-//form-urlencoded */
app.use(express.urlencoded( {extended: true} ))
/* for parsing application/json */
app.use(express.json())
/* for parsing multipart/form-data */
// app.use(upload.array()); 

/* Routes Connection - MongoDB */
const connMongoDB = require('./routers/db_conn')
connMongoDB();

/* Router */
const routing = require('./routers/routes')
app.use(routing);

/* multer error handling */
app.use(() => (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(504).send(err.code);
  }
})