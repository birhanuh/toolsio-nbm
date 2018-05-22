export default `

  type Task {
    id: Int!
    name: String!
    hours: String!
    paymentType: String!
    unitPrice: Float!
    total: Float!
    projectId: Int!
  }

  type CreateUpdateTaskResponse {
    success: Boolean!
    task: Task
    errors: [Error!]
  }

  type DeleteTaskResponse {
    success: Boolean!
    errors: [Error!]
  }

  type Query {
    getTask(id: Int!): Task!
    
    getTasks: [Task!]!
  }

  type Mutation {
    createTask(name: String!, hours: String!, paymentType: String!, unitPrice: Float!, 
      total: Float!, projectId: Int!): CreateUpdateTaskResponse!

    updateTask(id: Int!, name: String!, hours: String!, paymentType: String!, unitPrice: Float!, 
      total: Float!, projectId: Int!): CreateUpdateTaskResponse!

    deleteTask(id: Int!): DeleteTaskResponse!
  }

`
