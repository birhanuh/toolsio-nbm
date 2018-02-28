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
import FormPage from '../../components/Sales/FormPage'
import Form from '../../components/Sales/Form'
import Page from '../../components/Sales/Page'
import Show from '../../components/Sales/Show'

// Factories
import { Sale, Sales, Customer, Customers } from '../factories'

// Setups
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

let store, props, component, wrapper

describe("components", function() { 

  describe("<Form />", function() { 
    
    beforeEach(() => {
      props = {
        customers: Customers,
        saveSale: jest.fn(),
      }

      component = shallow(<Form {...props}/>)
    })

    it('renders correctly', () => { 
      
      expect(component.find('button').hasClass('ui primary')).toBe(true)

    })
  })
   
  describe("<FormPage />", function() {  

    beforeEach(() => {
      const storeStateMock = {
        sales: {
          Sales,
          find: jest.fn()
        },
        customers: Customers
      }

      store = mockStore(storeStateMock)

      props = {
        createSale: jest.fn(),
        fetchSale: jest.fn(),
        updateSale: jest.fn(),
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

    it('check props matchs', function() { 

      expect(wrapper.find(FormPage).prop('createSale')).toEqual(props.createSale)
      expect(wrapper.find(FormPage).prop('fetchSale')).toEqual(props.fetchSale)
      expect(wrapper.find(FormPage).prop('updateSale')).toEqual(props.updateSale)
      expect(wrapper.find(FormPage).prop('fetchCustomers')).toEqual(props.fetchCustomers)
    })

  })

  describe("<Page />", function() {  

    beforeEach(() => {
      const storeStateMock = {
        sales: Sales
      }

      store = mockStore(storeStateMock)

      props = {
        fetchSales: jest.fn()
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Page {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Page).length).toEqual(1)
    })

    it('check props matchs', function() { 

      expect(wrapper.find(Page).prop('fetchSales')).toEqual(props.fetchSales)
    })

  })

  describe("<Show />", function() {  
    
    beforeEach(() => {
      const storeStateMock = {
        sales: {
          Sales,
          find: jest.fn()
        }
      }

      store = mockStore(storeStateMock)

      props = {
        fetchSale: jest.fn(),
        deleteSale: jest.fn(),
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

      expect(wrapper.find(Show).prop('fetchSales')).toEqual(props.fetchSales)
      expect(wrapper.find(Show).prop('deleteSale')).toEqual(props.deleteSale)
    })

  })

})
