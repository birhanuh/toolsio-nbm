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
import { addTypenameToDocument } from 'apollo-client'
import gql from 'graphql-tag'

import renderer from 'react-test-renderer'

import { GET_PROJECTS_QUERY, GET_PROJECT_QUERY, CREATE_PROJECT_MUTATION, UPDATE_PROJECT_MUTATION } from '../../src/graphql/projects'

// Configure Adapter
configure({ adapter: new Adapter() })

// Components 
import Form from '../../src/components/Projects/Form'
import Page from '../../src/components/Projects/Page'
import Show from '../../src/components/Projects/Show'

// Setups
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

let store, list
let GET_PROJECTS_GQL, CREATE_PROJECT_GQL, GET_PROJECT_GQL

describe("components", () => { 
   
  describe("<Form />", () => {  

    beforeEach(() => {
      const storeStateMock = {}

      store = mockStore(storeStateMock)
    })

    it('renders connected component', () => { 
      
      // const props = {
      //   match: {
      //     params: {
      //       id: 1
      //     }
      //   },
      //   data: {
      //     getProject: {
      //       id: 1,
      //       name: "Project 1",
      //       deadline: 1523439822435,
      //       status: "new",
      //       description: "Desciption 1..."
      //     }
      //   }
      // }

      const wrapper = mount(<BrowserRouter>
        <Provider store={store}>
          <MockedProvider mocks={[{
            request: {
              query: CREATE_PROJECT_MUTATION,
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
            
            <Form {...props} />

          </MockedProvider>
        </Provider>
      </BrowserRouter>)
      console.log('Form ', wrapper.find(Form))
      expect(wrapper.find(Form).length).toEqual(1)
    })

  })

  describe("<Page />", () => {  

    beforeEach(() => {
      const storeStateMock = {}

      store = mockStore(storeStateMock)
    })

    it('renders connected component', () => { 
      
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
              query: GET_PROJECTS_QUERY
            },
            result: {
              data: projectsList
            }
          }]} > 
            
            <Page />

          </MockedProvider>
        </Provider>
      </BrowserRouter>)
      
      console.log('Page ', wrapper.find(Page).props())
      //expect(wrapper.find(Page).prop('data').getProjects).toEqual(projectsList)
      //expect(toJSON(wrapper)).toMatchSnapshot()

    })
  })

  describe("<Show />", () => {      

    beforeEach(() => {
      const storeStateMock = {}  

      store = mockStore(storeStateMock)
    })

    it('renders connected component', () => { 
      
      const project =  {
        "getProject": {
          "id": 1,
          "name": "Project 1"
        }
      }

      const wrapper = mount(<BrowserRouter>
        <Provider store={store}>
          <MockedProvider mocks={[{
            request: {
              query: GET_PROJECT_GQL,
              varibales: { params: {id: 1} }
            },
            result: {
              data: project
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
