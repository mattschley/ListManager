var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = new Schema({
  username: String,
  listname: String
});

module.exports = mongoose.model('List', ListSchema);