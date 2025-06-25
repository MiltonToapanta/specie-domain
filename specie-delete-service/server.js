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
    deleteSpecie(id: ID!): String  # Mutación para eliminar una especie
  }
`;

// GraphQL resolvers
const resolvers = {
  Mutation: {
    // Resolver para eliminar una especie
    async deleteSpecie(_, { id }) {
      // Buscar la especie por ID y eliminarla
      const specie = await Specie.findById(id);
      if (!specie) {
        throw new Error('Specie not found');
      }

      // Eliminar la especie con findByIdAndDelete
      await Specie.findByIdAndDelete(id);

      return `Specie with ID ${id} has been deleted`;  // Respuesta de éxito
    }
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
  server.applyMiddleware({ app, path: '/species' });  // Set the GraphQL endpoint to /species

  // Healthcheck route
  app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });

  // Start the Express server
  const PORT = process.env.PORT_DELETE || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/species`);
  });
};

// Start the server
startServer();
