import FactoryGirl from 'factory_girl'
import mongoose from 'mongoose'
let id = mongoose.Types.ObjectId()

FactoryGirl.define('user', function() {
  this.account = id
  this.firstName = 'User 1'
  this.lastName = 'User 1'
  this.email = 'user@email.com' 
  this.password = 'pw'
  this.admin = true
  this.meta = { age: 21, gender: 'm' }
  this.avatar = { data: null, contentType: '' }
  this.tenantId = ''
})

FactoryGirl.define('customer', function() {
  this.name = 'Customer 1'
  this.vatNumber = '1234' 
  this.contact = { phoneNumber: '12345678910' }
  this.includeContactOnInvoice = false
  this.projects = []
  this.sales = []
  this.invoices = []
  this.address = { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' }
})

FactoryGirl.define('sale', function() {
  this.customer = id
  this.name = 'Sale 1'
  this.deadline = new Date() 
  this.status = 'new'
  this.description = 'Description 1...'
  this.items = []
})

FactoryGirl.define('project', function() {
  this.customer = id
  this.name = 'Project 1'
  this.deadline = new Date() 
  this.status = 'new'
  this.description = 'Description 1...'
  this.tasks = []
})

FactoryGirl.define('task', function() {
  this._creator = id
  this.name = 'Task 1'
  this.hours = 2 
  this.paymentType = 'Per hour'
  this.price = 20
  this.vat = 10
})

FactoryGirl.define('item', function() {
  this._creator = id
  this.name = 'Item 1'
  this.unit = 'meter' 
  this.quantity = 15
  this.price = 20
  this.vat = 10
})

module.exports = FactoryGirl
