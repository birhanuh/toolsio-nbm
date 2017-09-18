import React from 'react'
//import { shallow } from 'enzyme'
import ReactDOM from 'react-dom'
import TestUtils from 'react-dom/test-utils' // ES6
import FormPage from '../../../client/src/components/Sales/FormPage'
//import Page from '../../../client/src/components/Sales/Page'
//import Show from '../../../client/src/components/Sales/Show'

describe("Sale", function() { 

  beforeEach(function() {
    let props = {
      createSale: '',
      fetchSale: '',
      updateSale: '',
      fetchCustomers: ''
    }

    // const result = TestUtils.renderIntoDocument(<FormPage {...props} />)
    // const result2 = TestUtils.renderIntoDocument(<Page {...props} />)
    // const result3 = TestUtils.renderIntoDocument(<Show {...props} />)
    // const button = TestUtils.scryRenderDOMComponentsWithTag(result, 'button')
    // const button2 = TestUtils.scryRenderDOMComponentsWithTag(result2, 'button')
    // const button3 = TestUtils.scryRenderDOMComponentsWithTag(result3, 'button')
  })

  it("creates Sale", function() { 
    // let props = {
    //   createSale: '',
    //   fetchSale: '',
    //   updateSale: '',
    //   fetchCustomers: ''
    // }
    // let context = {
    // }
    // const formPage = shallow(<FormPage {...props } />)
    // expect(formPage.find('ui.primary.button')).to.have.length(1);


    // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'name')).value = 'Sale 1'
    // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'deadline')).value = new Date()
    // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'status')).value = 'NEW'
    // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'describtion')).value = 'Sale 1 ...'
    // ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'customer')).value = customer
    // TestUtils.Simulate.click(button[0])
    // expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sale 1')  
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