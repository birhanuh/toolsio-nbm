import React from 'react'
import ReactTestUtils from 'react-dom/test-utils' // ES6
import FormPage from '../../../client/src/components/Sales/FormPage'
import Page from '../../../client/src/components/Sales/Page'
import Show from '../../../client/src/components/Sales/Show'

// Load factories 
import FactoryGirl from '../factories'

let customer = FactoryGirl.create('customer')

'use strict'

// describe("Sale", function() { 
//   let result, result2, props, button

//   beforeEach(function() {
//     props = {
//       createSale: '',
//       fetchSale: '',
//       updateSale: ''
//     }
//     result = TestUtils.renderIntoDocument(<FormPage {...props} />)
//     result2 = TestUtils.renderIntoDocument(<Page {...props} />)
//     result3 = TestUtils.renderIntoDocument(<Show {...props} />)
//     button = TestUtils.scryRenderDOMComponentsWithTag(result, 'button')
//     button2 = TestUtils.scryRenderDOMComponentsWithTag(result2, 'button')
//     button3 = TestUtils.scryRenderDOMComponentsWithTag(result3, 'button')
//   })

//   it("creates Sale", function() { 
//     ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'name')).value = 'Sale 1'
//     ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'date')).value = new Date()
//     ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'status')).value = 'NEW'
//     ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'describtion')).value = 'Sale 1 ...'
//     ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'customer')).value = customer
//     TestUtils.Simulate.click(button[0])
//     expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sale 1')  
//   })

//   it("edits Sale", function() { 
//     expect(TestUtils.findRenderDOMComponentWithTag(result2, 'table')).toBeDefined()     
//     expect.textContent).toContain('View')  
//     TestUtils.Simulate.click(button2[0])
//     expect(ReactDOM.findDOMNode(result3).textContent).toContain('Sale 1') 
//     TestUtils.Simulate.click(button3[0])
//     expect(ReactDOM.findDOMNode(result).textContent).toContain('Sale 1') 
//     ReactDOM.findDOMNode(TestUtils.findRenderDOMComponentWithName(result, 'name')).value = 'Sale 1 edited'
//     TestUtils.Simulate.click(button[0])
//     expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sale 1 edited') 
//   })

//   it("views Sale", function() { 
//     expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sales')      
//     TestUtils.Simulate.click(button[0])
//     expect(ReactDOM.findDOMNode(result3).textContent).toContain('Sale 1') 
//     expect(button3.length).toEqual(1)  
//   })
  
//   it("deletes Sale", function() { 
//     expect(ReactDOM.findDOMNode(result2).textContent).toContain('Sales')  
//     expect(button2[1].textContent).toContain('Delete')      
//     TestUtils.Simulate.click(button2[1])
//     expect(ReactDOM.findDOMNode(result2).textContent).not.toContain('Sale 1 edited')
//   }) 

// })