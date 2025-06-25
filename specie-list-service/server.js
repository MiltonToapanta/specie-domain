// server.js
const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { gql } = require('apollo-server-express');
require('dotenv').config();

const typeDefs = require('./graphql/schema/specieSchema');
const resolvers = require('./graphql/resolvers/specieResolver');

const app = express();

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

// GraphQL server setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Asynchronous function to start the Apollo Server
const startServer = async () => {
  await server.start();  // Start the Apollo Server
  server.applyMiddleware({ app, path: '/species' });  // Set the custom GraphQL endpoint to '/species'

  // Healthcheck route
  app.get('/', (req, res) => {
    res.send('Species list microservice is up and running!');
  });

  // Start the Express server
  const PORT = process.env.PORT_LIST || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/species`);
  });
};

// Start the server
startServer();
