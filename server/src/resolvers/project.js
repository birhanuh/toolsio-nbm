export default {
  Query: {
    getProject: (parent, {id}, {models}) => models.Project.findOne({ where: {id} }),
    getAllProjects: (parent, args, {models}) => models.Project.findAll()
  },

  Mutation: {
    createProject: async (parent, args, { models }) => {
      try {
        await models.Project.create(args)
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    }  
  }      
}

import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

const resolverMap = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: 'Date custom scalar type',
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value.getTime(); // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    },
  }),
};