// Schema
import axios from 'axios'

//import { truncate } from '../helpers/macros'
import { registerUser, loginUser } from '../helpers/authentication'

let tokens 

describe("User", () => { 

  beforeAll(async () => {
    //await truncate()
    let response = await registerUser()
    const { success, email, password } = response

    if (success) {
      tokens = await loginUser(email, password)
    }
  })

  afterAll(async () => {  
    //await truncate()   
  })

  test('getUsers', async () => {

    const response = await axios.post('http://localhost:8080/graphql', {
      query: `query {
        getUsers {
          id
          firstName
          lastName
          email
        }
      }`
    },{
      headers: {
        'x-auth-token': tokens.authToken,
        'x-auth-refresh-token': tokens.refreshAuthToken
      }
    }) 
   
    const { data: { getUsers } } = response.data
  
    expect(getUsers).not.toHaveLength(0)
  })

 

})
