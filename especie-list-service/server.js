// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  
const Especie = require('./model/Especie'); 

const app = express();

const mongoUri = process.env.MONGO_URI 
const dbName = process.env.DB_NAME 

mongoose.connect(`${mongoUri}/${dbName}`)
  .then(() => {
    console.log(`Conectado a MongoDB en la base de datos: ${dbName}`);
  })
  .catch((error) => {
    console.error('Error al conectar a MongoDB:', error.message);
  });

const PORT = process.env.PORT || 3000;  

app.get('/especie', async (req, res) => {
  try {
    const especies = await Especie.find(); 
    res.json(especies); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los especies' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
