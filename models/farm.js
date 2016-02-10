var mongoose = require('mongoose');
var Animal = require('./animal');

var farmSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: false},
  farmer: String,
  contact: {
    website: String,
    address: String,
    country: String
  },
  animals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }]
});

var Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;