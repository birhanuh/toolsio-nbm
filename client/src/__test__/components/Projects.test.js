import 'raf/polyfill'

import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configure, shallow, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// Configure Adapter
configure({ adapter: new Adapter() })

// Components 
import FormPage from '../../components/Projects/FormPage'
import Form from '../../components/Projects/Form'
import Page from '../../components/Projects/Page'
import Show from '../../components/Projects/Show'

// Factories
import { Project, Projects, Customer, Customers } from '../factories'

// Setups
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

let store, props, component, wrapper

describe("components", function() { 

  describe("<Form />", function() { 
    
    beforeEach(()=>{
      props = {
        customers: Customers
      }

      component = shallow(<Form {...props}/>)
    })

    it('renders correctly', () => { 
      
      expect(component.find('button').hasClass('ui primary')).toBe(true)

      // const formComponent = shallow(<Form />)
      // const tree = toJson(formComponent)
      // console.log(tree

    })
  })
   
  describe("<FormPage />", function() {  

    beforeEach(()=>{
      const storeStateMock = {
        projects: {
          Projects,
          find: jest.fn()
        },
        customers: Customers
      }

      store = mockStore(storeStateMock)

      props = {
        createProject: jest.fn(),
        fetchProject: jest.fn(),
        updateProject: jest.fn(),
        fetchCustomers: jest.fn(),
        match: {
          params: {
            id: 1
          }
        }
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><FormPage {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(FormPage).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(FormPage).prop('createProject')).toEqual(props.createProject)
      expect(wrapper.find(FormPage).prop('fetchProject')).toEqual(props.fetchProject)
      expect(wrapper.find(FormPage).prop('updateProject')).toEqual(props.updateProject)
      expect(wrapper.find(FormPage).prop('fetchCustomers')).toEqual(props.fetchCustomers)
    })

  })

  describe("<Page />", function() {  

    beforeEach(()=>{
      const storeStateMock = {
        projects: Projects
      }

      store = mockStore(storeStateMock)

      props = {
        fetchProjects: jest.fn()
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Page {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Page).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(Page).prop('fetchProjects')).toEqual(props.fetchProjects)
    })

  })

  describe("<Show />", function() {  
    
    beforeEach(()=>{
      const storeStateMock = {
        projects: {
          Projects,
          find: jest.fn()
        }
      }

      store = mockStore(storeStateMock)

      props = {
        fetchProject: jest.fn(),
        deleteProject: jest.fn(),
        addFlashMessage: jest.fn(),
        match: {
          params: {
            id: 1
          }
        }
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Show {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Show).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(Show).prop('fetchProjects')).toEqual(props.fetchProjects)
      expect(wrapper.find(Show).prop('deleteProject')).toEqual(props.deleteProject)
    })

  })

})
