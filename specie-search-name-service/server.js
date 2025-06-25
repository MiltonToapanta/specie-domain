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
    searchName(name: String!): [Specie]  # Nueva mutación para buscar especies por nombre
  }
`;

// GraphQL resolvers
const resolvers = {
  Mutation: {
    // Resolver para buscar especies por nombre
    async searchName(_, { name }) {
      // Buscar todas las especies cuyo nombre coincida parcialmente con el nombre proporcionado
      const species = await Specie.find({ name: new RegExp(name, 'i') });  // Búsqueda insensible a mayúsculas

      if (species.length === 0) {
        throw new Error('No species found with that name');
      }

      return species;  // Devolver las especies encontradas
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
  server.applyMiddleware({ app, path: '/species' });  // Set the GraphQL endpoint to /species

  // Healthcheck route
  app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });

  // Start the Express server
  const PORT = process.env.PORT_SEARCH_NAME || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/species`);
  });
};

// Start the server
startServer();
