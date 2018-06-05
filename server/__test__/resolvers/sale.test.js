// Schema
import axios from 'axios'

import { truncate } from '../helpers/macros'

// Load factories 
import saleFactory from '../factories/sale'

// Authentication
import { registerAndLoginUser, createCustomer } from '../helpers/authentication'

describe("Sale",  () => { 

  let authToken
  let refreshAuthToken

  let saleCreated

  beforeAll(async () => {
    //await truncate()

    const logedInUser = await registerAndLoginUser()

    authToken = logedInUser.authToken
    refreshAuthToken = logedInUser.refreshAuthToken 
  })

  afterAll(async () => {  
    //await truncate()   
  })

  it('should fail with validation errors for each required field', async () => {

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createSale($name: String!, $deadline: Date!, $status: String!, $description: String, $total: Int, $customerId: Int!) {
        createSale(name: $name, deadline: $deadline, status: $status, description: $description, total: $total, customerId: $customerId) {
          success
          sale {
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

    const { data: { createSale: { success, errors } } } = response.data
    console.log('getSales errors', errors)  
    expect(errors.length).not.toEqual(0)
  })

  it('createSale', async (done) => {
    
    // Create customer 
    let customer = await createCustomer(authToken, refreshAuthToken)

    let saleFactoryLocal = await saleFactory()

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createSale($name: String!, $deadline: Date!, $status: String!, $description: String, $total: Int, $customerId: Int!) {
        createSale(name: $name, deadline: $deadline, status: $status, description: $description, total: $total, customerId: $customerId) {
          success
          sale {
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
        name: saleFactoryLocal.name,
        deadline: saleFactoryLocal.deadline,
        status: saleFactoryLocal.status,
        description: saleFactoryLocal.description,
        customerId: customer.id
      }
    })

    const { data: { createSale: { success, sale } } }  = response.data
    
    // Assign created sale
    saleCreated = sale
    console.log('saleCreated', saleCreated)
    expect(success).toBe(true)
    expect(sale).not.toBe(null)

    done()
  })

  it('updateSale', async (done) => { 
    
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation updateSale($id: Int!, $name: String!, $deadline: Date!, $status: String!, $description: String, $total: Int, $customerId: Int!) {
        updateSale(id: $id, name: $name, deadline: $deadline, status: $status, description: $description, total: $total, customerId: $customerId) {
          success
          sale {
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
        id: saleCreated.id,
        name: "Sale name updated",
        deadline: saleCreated.deadline,
        status: saleCreated.status,
        description: saleCreated.description,
        customerId: saleCreated.customerId
      }
    }) 

    const { data: { updateSale: { success, sale } } } = response.data
    console.log('updateSale', response.data)
    //expect(success).toBe(true)
    //expect(sale.name).toEqual("Sale name updated")

    done()
  })

  xit('deleteSale', async (done) => { 
    const response = await axios.post('http://localhost:8080/graphql', {
      query: ` mutation deleteSale($id: Int!) {
        deleteSale(id: $id) {
          success
          errors {
            path
            message
          }
        } 
      }`,
      variables: {
        id: saleCreated.id
      }
    }) 

    const { data: { deleteSale: { success, errors } } } = response.data
   
    expect(success).toBe(true)
   
    done()
  })

})
