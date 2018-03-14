export default `
  
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
