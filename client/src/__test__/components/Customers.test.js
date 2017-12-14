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
import FormPage from '../../components/Customers/FormPage'
import Form from '../../components/Customers/Form'
import Page from '../../components/Customers/Page'
import Show from '../../components/Customers/Show'

// Factories
import { Customer, Customers } from '../factories'

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
        customers: {
          Customer,
          find: jest.fn()
        }
      }

      store = mockStore(storeStateMock)

      props = {
        createCustomer: jest.fn(),
        fetchCustomer: jest.fn(),
        updateCustomer: jest.fn(),
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

      expect(wrapper.find(FormPage).prop('createCustomer')).toEqual(props.createCustomer)
      expect(wrapper.find(FormPage).prop('fetchCustomer')).toEqual(props.fetchCustomer)
      expect(wrapper.find(FormPage).prop('updateCustomer')).toEqual(props.updateCustomer)
    })

  })

  describe("<Page />", function() {  

    beforeEach(()=>{
      const storeStateMock = {
        customers: Customers
      }

      store = mockStore(storeStateMock)

      props = {
        fetchCustomers: jest.fn(),
        deleteCustomer: jest.fn()
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Page {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Page).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(Page).prop('fetchCustomers')).toEqual(props.fetchCustomers)
      expect(wrapper.find(Page).prop('deleteCustomer')).toEqual(props.deleteCustomer)
    })

  })

  describe("<Show />", function() {  
    
    beforeEach(()=>{
      const storeStateMock = {
        customers: {
          Customers,
          find: jest.fn()
        }
      }

      store = mockStore(storeStateMock)

      props = {
        fetchCustomer: jest.fn(),
        deleteCustomer: jest.fn(),
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

      expect(wrapper.find(Show).prop('fetchCustomers')).toEqual(props.fetchCustomers)
      expect(wrapper.find(Show).prop('deleteCustomer')).toEqual(props.deleteCustomer)
    })

  })

})
