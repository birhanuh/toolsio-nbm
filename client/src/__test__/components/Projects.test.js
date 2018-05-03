import 'raf/polyfill'

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
// Redux
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
// Apollo
import { MockedProvider } from 'react-apollo/test-utils'
import gql from 'graphql-tag'

// Configure Adapter
configure({ adapter: new Adapter() })

// Components 
import FormPage from '../../components/Projects/FormPage'
import Page from '../../components/Projects/Page'
import Show from '../../components/Projects/Show'

// Setups
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

let store, list
let GET_PROJECTS_GQL, CREATE_PROJECT_GQL, GET_PROJECT_GQL

describe("components", function() { 
   
  describe("<FormPage />", function() {  

    beforeEach(() => {
      const storeStateMock = {}

      store = mockStore(storeStateMock)

      CREATE_PROJECT_GQL = gql`
        mutation createProject($name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $customerId: Int!) {
          createProject(name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, customerId: $customerId) {
            success
            project {
              id
              name 
              deadline
              status
              progress
              description
              customer {
                name
              }
            }
            errors {
              path
              message
            }
          }
        }
      `
    })

    it('renders connected component', function() { 
      
      const props = {
        match: {
          params: {
            id: 1
          }
        },
        data: {
          getProject: {
            id: 1,
            name: "Project 1",
            deadline: 1523439822435,
            status: "new",
            description: "Desciption 1..."
          }
        }
      }

      const wrapper = mount(<BrowserRouter>
        <Provider store={store}>
          <MockedProvider mocks={[{
            request: {
              query: CREATE_PROJECT_GQL,
              varibales: { name: "Project 1", deadline: 1523439822435, status: "new", description: "Desciption 1...", total: 0, customerId: 1 }
            },
            result: {
              "data": {
                "createProject": {
                  "success": true,
                  "project": {
                    "id": 1,
                    "name": "Project 1",
                    "deadline": 1523439822435,
                    "status": "new",
                    "description": "Desciption 1..."
                  },
                  "errors": null
                }
              }
            }
          }]} > 
            
            <FormPage {...props} />

          </MockedProvider>
        </Provider>
      </BrowserRouter>)
      console.log('FormPage ', wrapper.find(FormPage).props('data'))
      expect(wrapper.find(FormPage).length).toEqual(1)
    })

  })

  describe("<Page />", function() {  

    beforeEach(() => {
      const storeStateMock = {}

      store = mockStore(storeStateMock)

      GET_PROJECTS_GQL = gql`
        {
          getProjects {
            id
            name 
            deadline
            status
            progress
            description
            customer {
              name
            }
            user {
              firstName
            }
          }
        }
      `
    })

    it('renders connected component', async () => { 
      
      const projectsList =  {
          getProjects: [
            {
              id: 1,
              name: "Project 1",
              deadline: 1523439822435,
              status: "new",
              progress: 0,
              description: "",
              customer: {
                name: "Customera"
              },
              user: {
                user: "testa"
              }
            }
          ]
        }

      const wrapper = mount(<BrowserRouter>
        <Provider store={store}>
          <MockedProvider mocks={[{
            request: {
              query: GET_PROJECTS_GQL
            },
            result: {
              data: projectsList
            }
          }]} > 
            
            <Page />

          </MockedProvider>
        </Provider>
      </BrowserRouter>)

      await new Promise(resolve => setTimeout(resolve))
      wrapper.update()
      console.log('Page ', wrapper.find(Page).props)
      //expect(wrapper.find(Page).prop('data').getProjects).toEqual(projectsList)
      //expect(toJSON(wrapper)).toMatchSnapshot()

    })
  })

  describe("<Show />", function() {      
    const storeStateMock = {}

    store = mockStore(storeStateMock)

    beforeEach(() => {
      GET_PROJECT_GQL = gql`
        query getProject($id: Int!) {
          getProject(id: $id) {
            id
            name 
          }
        }
      `  
    })

    it('renders connected component', function() { 
      
      const wrapper = mount(<BrowserRouter>
        <Provider store={store}>
          <MockedProvider mocks={[{
            request: {
              query: GET_PROJECT_GQL,
              varibales: { params: {id: 1} }
            },
            result: {
              "data": {
                "getProject": {
                  "id": 1,
                  "name": "Project 1"
                }
              }
            }
          }]} > 
            
            <Show match={{params: {id: 1}}} />

          </MockedProvider>
        </Provider>
      </BrowserRouter>)

      //expect(wrapper.find(Show).prop('data').getProject).not.toBe(null)
    })
  })

})
