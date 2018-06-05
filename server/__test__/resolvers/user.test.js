// Schema
import axios from 'axios'

//import { truncate } from '../helpers/macros'
import { registerLoginUser } from '../helpers/authentication'

let user 

describe("User", () => { 

  beforeAll(async () => {
    //await truncate()
    user = await registerLoginUser()
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
        'x-auth-token': user.authToken,
        'x-auth-refresh-token': user.refreshAuthToken
      }
    }) 
   
    const { data: { getUsers } } = response.data
  
    expect(getUsers).not.toHaveLength(0)
  })

 

})
