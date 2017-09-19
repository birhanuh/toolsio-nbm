import React from 'react'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { fromJS } from 'immutable'
import { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import configureMockStore from 'redux-mock-store'
import FormPage from '../../components/Sales/FormPage'
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

  const propsForm = {
    fetchSale: jest.fn(),
    deleteSale: jest.fn(),
    addFlashMessage: jest.fn()
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

  //const formPageWrapper = mount(<Provider store={storeFormPage}><FormPage {...propsForm} /></Provider>)
  const formWrapper = mount(<Form />)
  //const pageWrapper = mount(<Page {...propsShow} store={storeShow} />)
  //const showWrapper = mount(<Show {...propsPage} store={storePage} />)

  return {
    propsForm,
    propsShow,
    propsPage,
    formWrapper
  }
}

describe("components", function() { 

  beforeEach(function() {
    let propsForm = {
      fetchSale: jest.fn(),
      deleteSale: jest.fn(),
      addFlashMessage: jest.fn()
    }

    let propsShow = {
      fetchSale: jest.fn(),
      deleteSale: jest.fn(),
      addFlashMessage: jest.fn()
    }

    let propsPage = {
      fetchSales: jest.fn(),
      deleteeSale: jest.fn()
    }

    // const result = TestUtils.renderIntoDocument(<FormPage {...propsForm} />)
    // const result2 = TestUtils.renderIntoDocument(<Page {...propsPage} />)
    // const result3 = TestUtils.renderIntoDocument(<Show {...propsShow} />)
    // const button = TestUtils.scryRenderDOMComponentsWithTag(result, 'button')
    // const button2 = TestUtils.scryRenderDOMComponentsWithTag(result2, 'button')
    // const button3 = TestUtils.scryRenderDOMComponentsWithTag(result3, 'button')
  })

  describe("<FormPage />", function() { 
    it('renders correctly', () => { 
      
      //const { formWrapper } = setup()
      //expect(formWrapper.find('button').hasClass('ui primary')).toBe(true)

      const formComponent = shallow(<Form />)
      expect(formComponent.find('button').hasClass('ui primary')).toBe(true)

      // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'name')).value = 'Sale 1'
      // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'deadline')).value = new Date()
      // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'status')).value = 'NEW'
      // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'describtion')).value = 'Sale 1 ...'
      // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'customer')).value = customer
      // TestUtils.Simulate.click(button[0])
      // expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sale 1')  
    })
  })
    
  // it("edits Sale", function() { 
  //   expect(TestUtils.findRenderDOMComponentWithTag(result2, 'table')).toBeDefined()     
  //   expect(textContent).toContain('View')  
  //   TestUtils.Simulate.click(button2[0])
  //   expect(ReactDOM.findDOMNode(result3).textContent).toContain('Sale 1') 
  //   TestUtils.Simulate.click(button3[0])
  //   expect(ReactDOM.findDOMNode(result).textContent).toContain('Sale 1') 
  //   ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'name')).value = 'Sale 1 edited'
  //   TestUtils.Simulate.click(button[0])
  //   expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sale 1 edited') 
  // })

  // it("views Sale", function() { 
  //   expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sales')      
  //   TestUtils.Simulate.click(button[0])
  //   expect(ReactDOM.findDOMNode(result3).textContent).toContain('Sale 1') 
  //   expect(button3.length).toEqual(1)  
  // })
  
  // it("deletes Sale", function() { 
  //   expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sales')  
  //   expect(button2[1].textContent).toContain('Delete')      
  //   TestUtils.Simulate.click(button2[1])
  //   expect(ReactDOM.findDOMNode(result2).textContent).not.toContain('Sale 1 edited')
  // }) 

})