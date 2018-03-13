export default `
  
  type Project {
    id: Int!
    name: String!
    deadline: Date!
    status: String!
    description: String
    tasks: [Task!]
    total: Int
    invoice: Invoice!
  }

`
