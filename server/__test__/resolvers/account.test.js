// Schema
import axios from 'axios'

import { resetDb } from '../helpers/macros'
import { registerUser, loginUser } from '../helpers/authentication'

// Tokens
let tokens 

// Load factories 
import customerFactory from '../factories/customer'

describe("Customer", () => { 

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
      query: `mutation createCustomer($name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
        createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
          postalCode: $postalCode, region: $region, country: $country) {
          success
          errors {
            path
            message
          }
        }
      }`,
      variables: {
        name: '',
        vatNumber: 0,
        email: '',
        phoneNumber: '',
        isContactIncludedInInvoice: false,
        street: '',
        postalCode: '',
        region: '',
        country: ''
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
      }
    }) 

    const { data: { createCustomer: { success } } } = response.data
    
    expect(success).toBe(false)
  })

  it('saves Customer', async () => {
    let customerFactoryLocal = await customerFactory()

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation createCustomer($name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
        createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
          postalCode: $postalCode, region: $region, country: $country) {
          success
          errors {
            path
            message
          }
        }
      }`,
      variables: {
        name: customerFactoryLocal.name,
        vatNumber: customerFactoryLocal.vatNumber,
        email: customerFactoryLocal.email,
        phoneNumber: customerFactoryLocal.phoneNumber,
        isContactIncludedInInvoice: customerFactoryLocal.isContactIncludedInInvoice,
        street: customerFactoryLocal.street,
        postalCode: customerFactoryLocal.postalCode,
        region: customerFactoryLocal.region,
        country: customerFactoryLocal.country
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
      }
    }) 

    const { data: { createCustomer: { success } } } = response.data
        
    expect(success).toBe(true)

   
  })

  it('finds Customer', async () => { 
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `query getCustomer($id: Int!) {
        getCustomer(id: $id) {
          id
          name
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

    const { data: { getCustomer } } = response.data

    expect(getCustomer).not.toBe(null)

  })

  it('updates Customer', async () => { 
    // Update name
    const response = await axios.post('http://localhost:8080/graphql', {
      query: `mutation updateCustomer($id: Int!, $name: String, $vatNumber: Int, $email: String, $phoneNumber: String, $isContactIncludedInInvoice: Boolean, $street: String, $postalCode: String, $region: String, $country: String) {
        updateCustomer(id: $id, name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, postalCode: $postalCode, region: $region, country: $country) {
          success
          customer {
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
        name: "name updated",
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
      }
    }) 

    const { data: { updateCustomer } } = response.data
    
    expect(updateCustomer).toMatchObject({
        "success": true,
        "customer": {
          "id": 1,
          "name": "name updated"
        }
    })
   
  })

  it('deletes Customer', async () => { 
    const response = await axios.post('http://localhost:8080/graphql', {
     query: ` mutation deleteCustomer($id: Int!) {
        deleteCustomer(id: $id) {
          success
          errors {
            path
            message
          }
        }
      }`,
      variables: {
        id: 1,
      }
    }, 
    {
      headers: {
        'x-auth-token': tokens.authToken,
        'x-refresh-auth-token': tokens.refreshAuthToken,
      }
    }) 

    const { data: { deleteCustomer: { success } } } = response.data
    
    expect(success).toBe(true)

  })

})

