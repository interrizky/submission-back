const mongoose = require('mongoose');
const dotenv = require('dotenv')

/* Load environment variables from .env file */
dotenv.config();

//connect to the mongodb database .URI which is in the env file
async function connectDB() {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.DB_NAME,
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      ssl: true,
      replicaSet: "atlas-goja61-shard-0",
      authSource: process.env.DB_USER,
      retryWrites: true,
      w: "majority"
    };
    const conn = await mongoose.connect(process.env.DB_URI, options);
    // const conn = await mongoose.connect('mongodb://learn-shard-00-00.eedrt.mongodb.net:27017,learn-shard-00-01.eedrt.mongodb.net:27017,learn-shard-00-02.eedrt.mongodb.net:27017', options)
    console.log('MongoDB Connected on Host : ' + conn.connection.host);
  } catch (error) {
    console.log('Error! ' + error);
    process.exit(1);
  }
}

module.exports = connectDB