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
  name: { type: String, required: true }, 
  organization: { type: String, required: true },  
  phone: { type: String, required: true },     
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String },  //peserta or admin
  user_status: { type: String }, //active or inactive
  registration_code: { type: String },
  registration_date: { type: String },
}, schemaOptions)


/* ejavec_users adalah nama schema / tabel di MangoDB-nya */
const user = Mongoose.model('ejavec_users', userSchema);
module.exports = user;