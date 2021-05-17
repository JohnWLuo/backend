// module to define schema for contact model
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Defines what individual author document looks like
var contact = new Schema(
  {
    _id: {type: String, max: 100},
    fname: {type: String, required: true, max: 100},
    lname: {type: String, required: true, max: 100},
    birthday: {type: String, max: 100, default: ""},
    information:[{
      type: Schema.Types.ObjectId,
      ref: 'Tweet'
    }]
  }
);

//Export model - compiles a model
// instances of models are called documents

module.exports = mongoose.model('contact', contact);
