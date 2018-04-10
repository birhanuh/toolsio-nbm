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

  let customer

  beforeAll(async () => {
    await truncate()

    const logedInUser = await registerAndLoginUser()

    authToken = logedInUser.authToken
    refreshAuthToken = logedInUser.refreshAuthToken 

    // Create customer 
    const customer = await createCustomer(authToken, refreshAuthToken)
    console.log('authToken', logedInUser)
    console.log('refreshAuthToken', refreshAuthToken)
    console.log('customer', customer)
  })

  afterAll(async () => {  
    //await truncate()   
  })

  it('should fail with validation errors for each required field', (done) => {
    done()
  })

  it('saves Project', (done) => {

  
    done()
  })

  it('finds Project', (done) => { 
    done()
  })

  it('updates Project', (done) => { 

    // Update name
    done()
  })

  it('deletes Project', (done) => { 
    done()
  })

})
