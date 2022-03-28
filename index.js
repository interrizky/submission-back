const express = require('express');
const formdata = require('form-data');
const path = require('path');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan'); 
const multer = require('multer');
const dotenv = require('dotenv');

const port = process.env.PORT || 2020;

const app = express();

dotenv.config();

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// const {upload} = require('./helpers/file_helper');

// Reading Folders & Files in Public Folder
app.use(express.static('public'))
// app.use(express.static(path.join(__dirname, '/public')));
// app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(morgan('dev'));

const server = http.createServer(app)
server.listen(port, () => { console.log(`Server is running in port ${ port }`) })

// for parsing application/xwww- //form-urlencoded
app.use(express.urlencoded( {extended: true} ))
// for parsing application/json
app.use(express.json())
// for parsing multipart/form-data
// app.use(upload.array()); 

//Routes Connection - MongoDB
const connMongoDB = require('./routers/db_conn')
connMongoDB();

// Router
const routing = require('./routers/routes')
app.use(routing);