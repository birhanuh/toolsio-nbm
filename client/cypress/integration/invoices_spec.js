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
import Form from '../../src/components/Invoices/Form'
import Page from '../../src/components/Invoices/Page'
import Show from '../../src/components/Invoices/Show/Page'

// Factories
import { Invoices, Projects, Sales, Account } from '../factories'

// Setups
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

let store, props, component, wrapper

describe("components", function() { 

  describe("<Form />", function() { 
    
    beforeEach(() => {
      props = {
        projects: Projects,
        sales: Sales,
        saveInvoice: jest.fn()
      }

      component = shallow(<Form {...props}/>)
    })

    it('renders correctly', () => { 
      
      expect(component.find('form').hasClass('ui form')).toBe(true)

    })
  })
   
  describe("<Form />", function() {  

    beforeEach(() => {
      const storeStateMock = {
        invoices: Invoices,
        projects: Projects,
        sales: Sales
      }

      store = mockStore(storeStateMock)

      props = {
        createInvoice: jest.fn(),
        fetchInvoice: jest.fn(),
        updateInvoice: jest.fn(),
        fetchProjects: jest.fn(),
        fetchSales: jest.fn(),
        match: {
          params: {
            id: 1
          }
        }
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Form {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Form).length).toEqual(1)
    })

    it('check props matchs', function() { 

      expect(wrapper.find(Form).prop('createInvoice')).toEqual(props.createInvoice)
      expect(wrapper.find(Form).prop('fetchInvoice')).toEqual(props.fetchInvoice)
      expect(wrapper.find(Form).prop('updateInvoice')).toEqual(props.updateInvoice)
      expect(wrapper.find(Form).prop('fetchProjects')).toEqual(props.fetchProjects)
      expect(wrapper.find(Form).prop('fetchSales')).toEqual(props.fetchSales)
    })

  })

  describe("<Page />", function() {  

    beforeEach(() => {
      const storeStateMock = {
        invoices: Invoices
      }

      store = mockStore(storeStateMock)

      props = {
        fetchInvoices: jest.fn()
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Page {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Page).length).toEqual(1)
    })

    it('check props matchs', function() { 

      expect(wrapper.find(Page).prop('fetchInvoices')).toEqual(props.fetchInvoices)
    })

  })

  describe("<Show />", function() {  
    
    beforeEach(() => {
      const storeStateMock = {
        invoices: {
          Invoices,
          find: jest.fn()
        },
        authentication: {
          account: Account 
        },
      }

      store = mockStore(storeStateMock)

      props = {
        fetchInvoice: jest.fn(),
        deleteInvoice: jest.fn(),
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

    it('check props matchs', function() { 

      expect(wrapper.find(Show).prop('fetchInvoice')).toEqual(props.fetchInvoice)
      expect(wrapper.find(Show).prop('deleteInvoice')).toEqual(props.deleteInvoice)
    })

  })

})
