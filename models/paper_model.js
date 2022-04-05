/* Create Schema */
const Mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var schemaOptions = {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
};

var paperSchema = new Mongoose.Schema({
  paper_code : { type: String },
  participation_code : { type: String },
  title : { type: String },
  paper_type : { type: String },
  sub_theme : { type: String },  
  category : { type: String },
  participation_type : { type: String },
  upload_date : { type: String },
  submission_date : { type: String },
  name_1 : { type: String },
  phone_1 : { type: String },
  organization_1 : { type: String },
  cv_fileName_1 : { type: String },
  cv_filePath_1 : { type: String },
  cv_fileType_1 : { type: String },
  cv_fileSize_1 : { type: String },  
  paper_fileName_1 : { type: String },
  paper_filePath_1 : { type: String },
  paper_fileType_1 : { type: String },
  paper_fileSize_1 : { type: String },    
  pernyataan_fileName_1 : { type: String },
  pernyataan_filePath_1 : { type: String },
  pernyataan_fileType_1 : { type: String },
  pernyataan_fileSize_1 : { type: String },    
  lampiran_fileName_1 : { type: String },
  lampiran_filePath_1 : { type: String },
  lampiran_fileType_1 : { type: String },
  lampiran_fileSize_1 : { type: String },      
  name_2 : { type: String },
  phone_2 : { type: String },
  organization_2 : { type: String },
  cv_fileName_2 : { type: String },
  cv_filePath_2 : { type: String },
  cv_fileType_2 : { type: String },
  cv_fileSize_2 : { type: String },
  name_3 : { type: String },
  phone_3 : { type: String },
  organization_3 : { type: String },
  cv_fileName_3 : { type: String },
  cv_filePath_3 : { type: String },
  cv_fileType_3 : { type: String },
  cv_fileSize_3 : { type: String },  
}, schemaOptions);

/* implement pagination-v2 */
paperSchema.plugin(mongoosePaginate);

/* ejavec_papers adalah nama schema / tabel di MangoDB-nya */
const paper = Mongoose.model('ejavec_papers', paperSchema);
module.exports = paper;