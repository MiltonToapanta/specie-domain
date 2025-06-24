const mongoose = require('mongoose');

const specieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  species: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  photo_url: {
    type: String,
  },
});

const Specie = mongoose.model('Specie', specieSchema);

module.exports = Specie;
