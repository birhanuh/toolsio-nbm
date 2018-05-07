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
    customerId: Int!
    customer: Customer!
    user: User!
    total: Float!
  }

  type GetProjectsResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    progress: Int
    customer: Customer!
    user: User!
  }

  type GetProjectsWithoutInvoiceResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    progress: Int
    customer: Customer!
    total: Float
  }

  type GetProjectsWithInvoiceResponse {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    progress: Int
    customer: Customer!
    total: Float
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

    getProjectsWithoutInvoice: [GetProjectsWithoutInvoiceResponse!]!

    getProjectsWithInvoice: [GetProjectsWithoutInvoiceResponse!]!
  }

  type Mutation {
    createProject(name: String!, deadline: Date!, status: String!, progress: Int, description: String, customerId: Int!): CreateUpdateProjectResponse!
    
    updateProject(id: Int!, name: String, deadline: Date, status: String, progress: Int, description: String, 
      ,customerId: Int): CreateUpdateProjectResponse!
    
    deleteProject(id: Int!): DeleteProjectResponse!
  }

`
