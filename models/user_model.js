const Mongoose = require('mongoose');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

var userSchema = new Mongoose.Schema({
  name: { type: String },  
  email: { type: String },
  organization: { type: String },  
  password: { type: String },
  role: { type: String },  //peserta or admin
  status: { type: String }, //active or notyet
  // date_registered: { type: Date }
  date_registered: { type: String }
}, schemaOptions)


// ejavec_users adalah nama schema / tabel di MangoDB-nya
const user = Mongoose.model('ejavec_users', userSchema);
module.exports = user;