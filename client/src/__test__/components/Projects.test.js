import 'raf/polyfill'

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import { MockedProvider } from 'react-apollo/test-utils'
import { addTypenameToDocument } from 'apollo-client'
import gql from 'graphql-tag'

// Configure Adapter
configure({ adapter: new Adapter() })

// Components 
import Form from '../../components/Projects/Form'
import Page from '../../components/Projects/Page'
import Show from '../../components/Projects/Show'

let list
let APPS_GQL

describe("components", function() { 
   
  describe("<Form />", function() {  

    beforeEach(() => {

      APPS_GQL = gql`
        mutation createProject($name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $total: Int, $customerId: Int!) {
          createProject(name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, total: $total, customerId: $customerId) {
            success
            project {
              id
              name 
              deadline
              status
              progress
              description
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
        <MockedProvider mocks={[{
          request: {
            query: APPS_GQL,
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
      </BrowserRouter>)

      expect(wrapper.find(FormPage).length).toEqual(1)
    })

  })

  describe("<Page />", function() {  

    beforeEach(() => {

      APPS_GQL = gql`
        {
          getProjects {
            id
            name 
          }
        }
      `
    })

    it('renders connected component', function() { 
      
      const list =  [
        {
          "id": 1,
          "name": "Project 1"
        }
      ]

      const wrapper = mount(<BrowserRouter>
        <MockedProvider mocks={[{
          request: {
            query: APPS_GQL
          },
          result: {
            "data": {
              "getProjects": [
                {
                  "id": 1,
                  "name": "Project 1"
                }
              ]
            }
          }
        }]} > 
          
          <Page />

        </MockedProvider>
      </BrowserRouter>)

      expect(wrapper.find(Page).prop('data').getProjects).toEqual(list)
      //expect(toJSON(wrapper)).toMatchSnapshot()

    })

  })

  describe("<Show />", function() {  
    
    beforeEach(() => {
      APPS_GQL = gql`
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
        <MockedProvider mocks={[{
          request: {
            query: APPS_GQL,
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
      </BrowserRouter>)

      expect(wrapper.find(Show).prop('data').getProject).not.toBe(null)
    })


  })

})
