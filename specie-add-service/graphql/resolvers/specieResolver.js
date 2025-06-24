const Specie = require('../../model/Specie');

const resolvers = {
  Query: {
    async getSpecies() {
      return await Specie.find();
    },
    async getSpecie(_, { id }) {
      return await Specie.findById(id);
    },
  },
  Mutation: {
    async addSpecie(_, { name, species, description, photo_url }) {
      const newSpecie = new Specie({ name, species, description, photo_url });
      await newSpecie.save();
      return newSpecie;
    },
  },
};

module.exports = resolvers;
