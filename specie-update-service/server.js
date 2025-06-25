const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { gql } = require('apollo-server-express');
require('dotenv').config();

const Specie = require('./model/Specie');

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;

mongoose.connect(`${mongoUri}/${dbName}`)
  .then(() => {
    console.log(`Connected to MongoDB at database: ${dbName}`);
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// GraphQL schema
const typeDefs = gql`
  # Root Query
  type Query {
    _: Boolean # Apollo Server expects a root query. This is just a placeholder.
  }

  type Specie {
    id: ID!
    name: String!
    species: String!
    description: String
    photo_url: String
  }

  type Mutation {
    updateSpecie(id: ID!, name: String, species: String, description: String, photo_url: String): Specie
  }
`;

// GraphQL resolvers
const resolvers = {
  Mutation: {
    async updateSpecie(_, { id, name, species, description, photo_url }) {
      // Buscar la especie por ID
      const specie = await Specie.findById(id);

      if (!specie) {
        throw new Error('Specie not found');
      }

      // Actualizar los campos que se pasan en la mutación
      if (name) specie.name = name;
      if (species) specie.species = species;
      if (description) specie.description = description;
      if (photo_url) specie.photo_url = photo_url;

      // Guardar la especie actualizada
      await specie.save();
      return specie;  // Devolver la especie actualizada
    },
  },
};

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Express app setup
const app = express();

// Asynchronous function to start the Apollo Server
const startServer = async () => {
  await server.start();  // Start the Apollo Server
  // Change the GraphQL endpoint to /species
  server.applyMiddleware({ app, path: '/species' });  // Apply Apollo middleware to Express

  // Healthcheck route
  app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });

  // Start the Express server
  const PORT = process.env.PORT_UPDATE || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/species`);
  });
};

// Start the server
startServer();
