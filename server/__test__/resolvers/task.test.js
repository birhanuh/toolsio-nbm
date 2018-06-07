// Schema
import axios from 'axios'

import { resetDb } from '../helpers/macros'

// Load factories 
import taskFactory from '../factories/task'

// Tokens
let tokens 

// Authentication
import { registerUser, loginUser } from '../helpers/authentication'
import { createCustomer, createProject } from '../helpers/parents'

describe("Task",  () => { 

  beforeAll(async () => {
    await resetDb()
    let response = await registerUser()
    const { success, email, password } = response

    if (success) {
      tokens = await loginUser(email, password)
    }
  })

  afterAll(async () => { 
    await resetDb()       
  })

  it('should fail with validation errors for each required field', async () => {

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createTask($name: String!, $hours: String!, $paymentType: String!, $unitPrice: Float!, $total: Float!, $projectId: Int!) {
        createTask(name: $name, hours: $hours, paymentType: $paymentType, unitPrice: $unitPrice, total: $total, projectId: $projectId) {
          success
          errors {
            path
            message
          }
        }
      }`,
      variables: {
        name: "",
        hours: "",
        paymentType: "",
        unitPrice: 0,
        total: 0,
        projectId: 1
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
      }
    })

    const { data: { createTask: { success } } } = response.data
 
    expect(success).toBe(false)
  })

  it('createTask', async () => {   

    let taskFactoryLocal = await taskFactory()
    // Create customer 
    let customer = await createCustomer(tokens.authToken, tokens.refreshAuthToken)
    // Create project 
    let project = await createProject(tokens.authToken, tokens.refreshAuthToken, customer.id)

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createTask($name: String!, $hours: String!, $paymentType: String!, $unitPrice: Float!, $total: Float!, $projectId: Int!) {
        createTask(name: $name, hours: $hours, paymentType: $paymentType, unitPrice: $unitPrice, total: $total, projectId: $projectId) {
          success
          task {
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
        name: taskFactoryLocal.name,
        hours: taskFactoryLocal.hours,
        paymentType: taskFactoryLocal.paymentType,
        unitPrice: taskFactoryLocal.unitPrice,
        total: taskFactoryLocal.total,
        projectId: project.id
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
      }
    })

    const { data: { createTask: { success, task } } }  = response.data
    
    expect(success).toBe(true)
    expect(task).not.toBe(null)
  })

  it('updateTask', async () => { 
    
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation updateTask($id: Int!, $name: String, $hours: String, $paymentType: String, $unitPrice: Float, $total: Float, $projectId: Int) {
        updateTask(id: $id, name: $name, hours: $hours, paymentType: $paymentType, unitPrice: $unitPrice, total: $total, projectId: $projectId) {
          success
          task {
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
        name: "Task name updated"
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
      }
    })

    const { data: { updateTask: { success, task } } } = response.data

    expect(success).toBe(true)
    expect(task.name).toEqual("Task name updated")
  })

  it('deleteTask', async () => { 
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation deleteTask($id: Int!) {
        deleteTask(id: $id) {
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
      }
    }) 

    const { data: { deleteTask: { success } } } = response.data
   
    expect(success).toBe(true)
  })

})

