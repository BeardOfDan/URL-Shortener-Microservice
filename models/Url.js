const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlSchema = new Schema({
  'fullUrl': String,
  'shortUrl': String
});

module.exports = mongoose.model('url', urlSchema);
