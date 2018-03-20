export default `
  
  scalar Date

  type Project {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    progress: Int
    tasks: [Task!]
    total: Int
    customer: Customer!
  }

  type GetProjectsResponse {
    name: String!
    deadline: Date!
    status: String!
    description: String
    progress: Int
    customer: Customer!
  }

  type CreateProjectResponse {
    success: Boolean!
    project: Project 
    errors: [Error!]
  }

  type Query {
    getProject(id: Int!): Project!
    getProjects: [GetProjectsResponse!]!
  }

  type Mutation {
    createProject(name: String!, deadline: Date!, status: String!, progress: Int, description: String, total: Int, customerId: Int!): CreateProjectResponse!
  }

`