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
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    progress: Int
    total: Int
    customer: Customer!
  }

  type CreateUpdateProjectResponse {
    success: Boolean!
    project: Project! 
    errors: [Error!]
  }

  type DeleteProjectResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getProject(id: Int!): Project
    getProjects: [GetProjectsResponse!]!
  }

  type Mutation {
    createProject(name: String!, deadline: Date!, status: String!, progress: Int, description: String, 
      total: Int, customerId: Int!): CreateUpdateProjectResponse!
    
    updateProject(id: Int!, name: String!, deadline: Date!, status: String!, progress: Int, description: String, 
      total: Int, customerId: Int!): CreateUpdateProjectResponse!
    
    deleteProject(id: Int!): DeleteProjectResponse!
  }

`
