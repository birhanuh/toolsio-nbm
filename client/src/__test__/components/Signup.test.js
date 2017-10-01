import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

// Components 
import Form from '../../components/Signup/Form'
import Page from '../../components/Signup/Page'

// Factories
import { Account } from '../factories'

// Setups
const mockStore = configureMockStore([ thunk ])
let store, props, component, wrapper

describe("components", function() { 
   
  describe("<Form />", function() {  

    beforeEach(()=>{
      const storeStateMock = {}

      store = mockStore(storeStateMock)

      props = {
        signupRequest: jest.fn(),
        addFlashMessage: jest.fn(),
        isAccountExists: jest.fn(),
        isUserExists: jest.fn(),
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Form {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Form).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(Form).prop('signupRequest')).toEqual(props.signupRequest)
      expect(wrapper.find(Form).prop('addFlashMessage')).toEqual(props.addFlashMessage)
      expect(wrapper.find(Form).prop('isAccountExists')).toEqual(props.isAccountExists)
      expect(wrapper.find(Form).prop('isUserExists')).toEqual(props.isUserExists)
    })

  })

  describe("<Page />", function() {  

    beforeEach(()=>{
      const storeStateMock = {
        auth: {
          account: Account 
        },
        flashMessages: []
      }

      store = mockStore(storeStateMock)

      props = {
        signupRequest: jest.fn(),
        addFlashMessage: jest.fn(),
        isAccountExists: jest.fn(),
        isUserExists: jest.fn(),
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Page {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Page).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(Page).prop('signupRequest')).toEqual(props.signupRequest)
      expect(wrapper.find(Page).prop('addFlashMessage')).toEqual(props.addFlashMessage)
      expect(wrapper.find(Page).prop('isAccountExists')).toEqual(props.isAccountExists)
      expect(wrapper.find(Page).prop('isUserExists')).toEqual(props.isUserExists)
    })

  })


})
