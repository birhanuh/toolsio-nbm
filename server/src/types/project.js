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

export default `
  
  scalar Date

  type Project {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    tasks: [Task!]
    total: Int
    invoice: Invoice
  }

  type Query {
    getProject(id: Int!): Project!
    getAllProjects: [Project!]!
  }

  type Mutation {
    createProject(name: String!, deadline: Date!, status: String!, description: String, total: Int): Project!
  }

`
