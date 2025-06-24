// graphql/schema/specieSchema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Specie {
    id: ID!
    name: String!
    species: String!
    description: String
    photo_url: String
  }

  type Query {
    getSpecies: [Specie]
    getSpecie(id: ID!): Specie
  }

  type Mutation {
    addSpecie(name: String!, species: String!, description: String, photo_url: String): Specie
  }
`;

module.exports = typeDefs;
