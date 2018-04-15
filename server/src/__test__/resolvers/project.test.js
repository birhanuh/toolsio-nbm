// Schema
import axios from 'axios'

import { truncate } from '../helpers/macros'

// Load factories 
import projectFactory from '../factories/project'

// Authentication
import { registerAndLoginUser, createCustomer } from '../helpers/authentication'

describe("Project",  () => { 

  let authToken
  let refreshAuthToken

  let projectCreated

  beforeAll(async () => {
    await truncate()

    const logedInUser = await registerAndLoginUser()

    authToken = logedInUser.authToken
    refreshAuthToken = logedInUser.refreshAuthToken 
  })

  afterAll(async () => {  
    await truncate()   
  })

  it('should fail with validation errors for each required field', async () => {

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createProject($name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $total: Int, $customerId: Int!) {
        createProject(name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, total: $total, customerId: $customerId) {
          success
          project {
            id
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
        description: "",
        customerId: 0
      }
    })

    const { data: { createProject: { success, errors } } } = response.data
    console.log('getProjects errors', errors)  
    expect(errors.length).not.toEqual(0)
  })

  it('createProject', async (done) => {
    
    // Create customer 
    let customer = await createCustomer(authToken, refreshAuthToken)

    let projectFactoryLocal = await projectFactory()

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createProject($name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $total: Int, $customerId: Int!) {
        createProject(name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, total: $total, customerId: $customerId) {
          success
          project {
            id
            name
            deadline
            status
            description
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
    })

    const { data: { createProject: { success, project } } }  = response.data
    
    // Assign created project
    projectCreated = project
    console.log('projectCreated', projectCreated)
    expect(success).toBe(true)
    expect(project).not.toBe(null)

    done()
  })

  it('updateProject', async (done) => { 
    
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation updateProject($id: Int!, $name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $total: Int, $customerId: Int!) {
        updateProject(id: $id, name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, total: $total, customerId: $customerId) {
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
        id: projectCreated.id,
        name: "Project name updated",
        deadline: projectCreated.deadline,
        status: projectCreated.status,
        description: projectCreated.description,
        customerId: projectCreated.customerId
      }
    }) 

    const { data: { updateProject: { success, project } } } = response.data
    console.log('updateProject', project)
    expect(success).toBe(true)
    expect(project.name).toEqual("Project name updated")

    done()
  })

  it('deleteProject', async (done) => { 
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
        id: projectCreated.id
      }
    }) 

    const { data: { deleteProject: { success, errors } } } = response.data
   
    expect(success).toBe(true)
   
    done()
  })

})
