import React from 'react'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import configureMockStore from 'redux-mock-store'
import PureFormPage from '../../components/Sales/FormPage'
import Form from '../../components/Sales/Form'
import Page from '../../components/Sales/Page'
import Show from '../../components/Sales/Show'

function setup() {
  
  const mockStore = configureMockStore([ thunk ])

  const storeStateMockFormPage = {
    sales:{
      sale: 'ABC'
    },
    customers:{
      customer: 'ABC'
    }
  }

  let props = {
    match: {
      params: {
        id: 1
      }
    }
  }
  let storeFormPage = mockStore(storeStateMockFormPage)

  const storeStateMockPage = {
    sales:{
      sales: ['ABC', 'ABC']
    }
  }

  let storePage = mockStore(storeStateMockPage)

  const storeStateMockShow = {
    sales:{
      sale: 'ABC'
    }
  }

  let storeShow = mockStore(storeStateMockShow)

  const propsFormPage = {
    createSale: jest.fn(),
    fetchSale: jest.fn(),
    updateSale: jest.fn(),
    fetchCustomers: jest.fn()
  }

  const propsShow = {
    fetchSale: jest.fn(),
    deleteSale: jest.fn(),
    addFlashMessage: jest.fn()
  }

  const propsPage = {
    fetchSales: jest.fn(),
    deleteeSale: jest.fn()
  }

  //const formPageWrapper = mount(<PureFormPage store={storeFormPage} {...propsFormPage} />)
  const formWrapper = shallow(<Form />)
  //const pageWrapper = mount(<Page {...propsShow} store={storeShow} />)
  //const showWrapper = mount(<Show {...propsPage} store={storePage} />)

  return {
    propsFormPage,
    propsShow,
    propsPage,
    formWrapper,
    //formPageWrapper,
    //pageWrapper,
    //showWrapper
  }
}

describe("components", function() { 

  describe("<Form />", function() { 
    it('renders correctly', () => { 
      
      const { formWrapper } = setup()
     
      expect(formWrapper.find('button').hasClass('ui primary')).toBe(true)

      // const formComponent = shallow(<Form />)
      // const tree = toJson(formComponent)
      //  console.log(tree
      // expect(formComponent.find('button').hasClass('ui primary')).toBe(true)

    })
  })
   
  describe("<FormPage />", function() {  
    it("renders correctly", function() { 
      //const { formPageWrapper } = setup()
      //expect(formPageWrapper.find('button').hasClass('ui primary')).toBe(true)


    })
  })


})