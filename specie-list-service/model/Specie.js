const mongoose = require('mongoose');
const speciesSchema = new mongoose.Schema({
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

// Create the model based on the schema
const Species = mongoose.model('Species', speciesSchema);

module.exports = Species;
