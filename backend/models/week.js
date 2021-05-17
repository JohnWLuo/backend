// module to define schema for contact model
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Defines what individual author document looks like
var week = new Schema(
  {
    weekNum: {type: String, max: 100},
    journal: {type: String, max: 100, default: ""},
    list: {type: String, max: 100, default: ""},
  }
);

//Export model - compiles a model
// instances of models are called documents

module.exports = mongoose.model('week', week);
