// Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  
const Species = require('./model/Specie'); 

const app = express();

// Connect to MongoDB using environment variables
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

mongoose.connect(`${mongoUri}/${dbName}`)
  .then(() => {
    console.log(`Connected to MongoDB database: ${dbName}`);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Define port
const PORT = process.env.PORT_LIST || 3000;

// SOAP Service definition
const wsdl = `${__dirname}/species.wsdl`; 

const soapService = {
  SpeciesService: {
    SpeciesServicePort: {
      getAllSpecies: async (args) => {
        try {
          const species = await Species.find(); 
          return { species: species };  
        } catch (error) {
          return { error: 'Error retrieving species' };
        }
      },
    },
  },
};

// Health check route
app.get('/', (req, res) => {
  res.send('Health check: Server is running');
});

// Start SOAP Server
Server.createServer(soapService, wsdl, (server) => {
  server.listen(8080, () => {
    console.log('SOAP service running on port 8080');
  });
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});