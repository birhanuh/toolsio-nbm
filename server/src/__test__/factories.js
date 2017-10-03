import FactoryGirl from 'factory-girl'
import mongoose from 'mongoose'
let id = mongoose.Types.ObjectId()

// Schemas
import User from '../models/user'
import Account from '../models/account'
import Project from '../models/project'
import Sale from '../models/sale'
import Item from '../models/item'
import Task from '../models/task'
import Customer from '../models/customer'
import Invoice from '../models/invoice'

FactoryGirl.define('user', User, {
  account: id,
  firstName: 'User 1',
  lastName: 'User 1',
  email: FactoryGirl.seq('User.email', (n) => `user${n}@ymail.com`),
  password: 'pw',
  admin: true,
  meta: { age: 21, gender: 'm' },
  avatar: { data: null, contentType: '' },
  tenantId: ''
})

FactoryGirl.define('account', Account, {
  users: id,
  subdomain: FactoryGirl.seq('Account.subdomain', (n) => `Company ${n}`),
  industry: 'IT',
  contact: { phoneNumber: '12345678910' },
  email: FactoryGirl.seq('User.email', (n) => `user${n}@ymail.com`),
  address: { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' },
  logo: { data: null, contentType: '' },
  tenantId: ''
})

FactoryGirl.define('customer', Customer, {
  name: 'Customer 1',
  vatNumber: '1234', 
  contact: { phoneNumber: '12345678910' },
  includeContactOnInvoice: false,
  projects: [],
  sales: [],
  invoices: [],
  address: { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' }
})

FactoryGirl.define('sale', Sale, {
  customer: id,
  name: 'Sale 1',
  deadline: new Date(), 
  status: 'new',
  description: 'Description 1...',
  items: []
})

FactoryGirl.define('project', Project, {
  customer: id,
  name: 'Project 1',
  deadline: new Date(), 
  status: 'new',
  description: 'Description 1...',
  tasks: []
})

FactoryGirl.define('task', Task, {
  _creator: id,
  name: 'Task 1',
  hours: 2, 
  paymentType: 'Per hour',
  price: 20,
  vat: 10
})

FactoryGirl.define('item', Item, {
  _creator: id,
  name: 'Item 1',
  unit: 'meter', 
  quantity: 15,
  price: 20,
  vat: 10
})

module.exports = FactoryGirl
