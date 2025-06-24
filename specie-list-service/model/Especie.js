const mongoose = require('mongoose');

const especieSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  especie: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
  },
  photo_url: {
    type: String,
  },
});

// Crear el modelo a partir del esquema
const Especie = mongoose.model('Especie', especieSchema);

module.exports = Especie;
