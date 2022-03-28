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
  user_status: { type: String }, //active or notyet
  registration_code: { type: String },
  registration_date: { type: String },
}, schemaOptions)


// ejavec_users adalah nama schema / tabel di MangoDB-nya
const user = Mongoose.model('ejavec_users', userSchema);
module.exports = user;