  // Schema
import axios from 'axios'

// Load factories 
import userFactory from '../factories/user'
import accountFactory from '../factories/account'
import customerFactory from '../factories/customer'

export async function registerLoginUser() {

  let userFactoryLocal = await userFactory()
  let accountFactoryLocal = await accountFactory()

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

  const { data: { registerUser: { success, account } } } = response.data
  console.log('registerUser', account)

  if (success) {
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

    const { data: { loginUser } } = response.data      
    
    return loginUser
  } else {
    return null
  }
}

export async function createCustomer(authToken, refreshAuthToken) {

  let customerFactoryLocal = await customerFactory()

  const response = await axios.post('http://localhost:8080/graphql', {
    query: `mutation createCustomer($name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
      createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
        postalCode: $postalCode, region: $region, country: $country) {
        success
        customer {
          id
        }
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
      'x-auth-token': authToken,
      'x-refresh-auth-token': refreshAuthToken,
    }
  }) 

  const { data: { createCustomer: { customer } } } = response.data
  console.log('createCustomer: ', response.data)
  return customer
}
