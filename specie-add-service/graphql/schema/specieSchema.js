const { gql } = require('apollo-server-express');

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
    addSpecie(name: String!, species: String!, description: String, photo_url: String): Specie
  }
`;

module.exports = typeDefs;