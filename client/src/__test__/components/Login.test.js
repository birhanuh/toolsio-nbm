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
import Form from '../../components/Login/Form'
import Page from '../../components/Login/Page'

// Factories
import { Account } from '../factories'

// Setups
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

let store, props, component, wrapper

describe("components", function() { 
   
  describe("<Form />", function() {  

    beforeEach(()=>{
      const storeStateMock = {}

      store = mockStore(storeStateMock)

      props = {
        loginRequest: jest.fn(),
        addFlashMessage: jest.fn()
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Form {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Form).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(Form).prop('loginRequest')).toEqual(props.loginRequest)
      expect(wrapper.find(Form).prop('addFlashMessage')).toEqual(props.addFlashMessage)
    })

  })

  describe("<Page />", function() {  

    beforeEach(()=>{
      const storeStateMock = {
        authentication: {
          account: Account 
        },
        flashMessages: []
      }

      store = mockStore(storeStateMock)

      wrapper = mount(<BrowserRouter><Provider store={store}><Page /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Page).length).toEqual(1)
    })

  })


})
