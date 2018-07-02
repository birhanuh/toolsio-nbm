// Schema
import axios from 'axios'

import { resetDb } from '../helpers/macros'

// Load factories 
import projectFactory from '../factories/project'

// Authentication
import { registerUser, loginUser } from '../helpers/authentication'
import { createCustomer } from '../helpers/parents'

// Tokens
let tokens 
let subdomainLocal

describe("Project",  () => { 

  beforeAll(async () => {
    await resetDb()
    let response = await registerUser()
    const { success, email, password, subdomain } = response
    // Assign subdomain
    subdomainLocal = subdomain

    if (success) {
      tokens = await loginUser(email, password, subdomain)
    }
  })

  afterAll(async () => { 
    await resetDb()       
  })

  it('should fail with validation errors for each required field', async () => {

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createProject($name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $customerId: Int!) {
        createProject(name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, customerId: $customerId) {
          success
          project {
            id
            name 
          }
          errors {
            path
            message
          }
        }
      }`,
      variables: {
        name: "",
        deadline: "",
        status: "",
        progress: 0,
        description: "",
        customerId: 1
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
        'subdomain': subdomainLocal
      }
    })

    const { data: { createProject: { success } } } = response.data
 
    expect(success).toBe(false)
  })

  it('createProject', async () => {   

    let projectFactoryLocal = await projectFactory()
    // Create customer 
    let customer = await createCustomer(tokens.authToken, tokens.refreshAuthToken)

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createProject($name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $customerId: Int!) {
        createProject(name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, customerId: $customerId) {
          success
          project {
            id
            name 
          }
          errors {
            path
            message
          }
        }
      }`,
      variables: {
        name: projectFactoryLocal.name,
        deadline: projectFactoryLocal.deadline,
        status: projectFactoryLocal.status,
        description: projectFactoryLocal.description,
        customerId: customer.id
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
        'subdomain': subdomainLocal
      }
    })

    const { data: { createProject: { success, project } } }  = response.data
    
    expect(success).toBe(true)
    expect(project).not.toBe(null)
  })

  it('updateProject', async () => { 
    
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation updateProject($id: Int!, $name: String, $deadline: Date, $status: String, $progress: Int, $description: String, $customerId: Int) {
        updateProject(id: $id, name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, customerId: $customerId) {
          success
          project {
            id
            name  
          }
          errors {
            path
            message
          }
        }
      }`,
      variables: {
        id: 1,
        name: "Project name updated"
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
        'subdomain': subdomainLocal
      }
    })

    const { data: { updateProject: { success, project } } } = response.data

    expect(success).toBe(true)
    expect(project.name).toEqual("Project name updated")
  })

  it('deleteProject', async () => { 
    const response = await axios.post('http://localhost:8080/graphql', {
      query: ` mutation deleteProject($id: Int!) {
        deleteProject(id: $id) {
          success
          errors {
            path
            message
          }
        } 
      }`,
      variables: {
        id: 1
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
        'subdomain': subdomainLocal
      }
    }) 

    const { data: { deleteProject: { success } } } = response.data
   
    expect(success).toBe(true)
  })

})
