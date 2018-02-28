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
import Invitation from '../../components/Signup/Invitation'

// Factories
import { Account } from '../factories'

// Setups
const middlewares = [thunk] // add your middlewares like `redux-thunk`
const mockStore = configureMockStore(middlewares)

let store, props, component, wrapper

describe("components", function() { 
   
  describe("<Invitation />", function() {  

    beforeEach(() => {
      const storeStateMock = {
        authentication: {
          account: Account 
        }
      }

      store = mockStore(storeStateMock)

      props = {
        signupRequest: jest.fn(),
        addFlashMessage: jest.fn(),
        isUserExist: jest.fn()
      }

      wrapper = mount(<BrowserRouter><Provider store={store}><Invitation {...props} /></Provider></BrowserRouter>)
    })

    it('renders connected component', function() { 
      
      expect(wrapper.find(Invitation).length).toEqual(1)
    })

    it('check Prop matchs', function() { 

      expect(wrapper.find(Invitation).prop('signupRequest')).toEqual(props.signupRequest)
      expect(wrapper.find(Invitation).prop('addFlashMessage')).toEqual(props.addFlashMessage)
      expect(wrapper.find(Invitation).prop('isUserExist')).toEqual(props.isUserExist)
    })

  })

})

