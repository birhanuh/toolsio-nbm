// Schema
import axios from 'axios'

import { truncate } from '../helpers/macros'

// Load factories 
import userFactory from '../factories/user'
import accountFactory from '../factories/account'

describe("User", () => { 

  beforeAll(async () => {
    //await truncate()
  })

  afterAll(async () => {  
    //await truncate()   
  })

  describe("Authenticate User", () => { 

    let userFactoryLocal
    let accountFactoryLocal

    beforeAll( async () => {      
      await truncate()   

      userFactoryLocal = await userFactory()
      accountFactoryLocal = await accountFactory()
    })
   
    test('createUser', async () => {

      const response = await axios.post('http://localhost:8080/graphql', {
        query: `mutation registerUser($firstName: String, $lastName: String, $email: String!, $password: String!, $subdomain: String!, $industry: String!) {
          registerUser(firstName: $firstName, lastName: $lastName, email: $email, password: $password, subdomain: $subdomain, industry: $industry) {
            success
            account {
              subdomain
            }
            errors {
              path
              message
            }
          }        
        }`,
        variables: {
          firstName: userFactoryLocal.firstName,
          lastName: userFactoryLocal.lastName,
          email: userFactoryLocal.email,
          password: userFactoryLocal.password,
          subdomain: accountFactoryLocal.subdomain,
          industry: accountFactoryLocal.industry
        }
      }) 
      const { data } = response
      const { data: { registerUser: { account } } } = response.data
   
      expect(data).toMatchObject({
        data: {
          registerUser: {
            success: true,
            account: {
              subdomain: account.subdomain
            },
            errors: null
          }
        }
      })
    })

    test('loginUser', async () => {

      const response = await axios.post('http://localhost:8080/graphql', {
        query: `mutation($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            success
            authToken 
            refreshAuthToken
            errors {
              path
              message
            }
          }
        }`,
        variables: {
          email: userFactoryLocal.email,
          password: userFactoryLocal.password
        }
      }) 

      const { data: { loginUser: {success, authToken } } } = response.data
 
      expect(success).toBe(true)
      expect(authToken).not.toBeNull() 

    })
  })

})
