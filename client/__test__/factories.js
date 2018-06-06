// Account
export const Account = {
  _id: 1,
  subdomain: 'company',
  industry: 'IT',
  contact: { phoneNumber: '12345678910' },
  address: { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' }
}

// Sale
export const Sale = {
  _id: 1,
  name: 'Sale 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Sale 1 description...' 
}

export const Sale2 = {
  _id: 2,
  name: 'Sale 2',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Sale 2 description...' 
}

export const Sales = [{
  _id: 1,
  name: 'Sale 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Sale 1 description...' 
},
{
  _id: 2,
  name: 'Sale 2',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Sale 2 description...' 
}]

// Project
export const Project = {
  _id: 1,
  name: 'Project 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Project 1 description...' 
}

export const Project2 = {
  _id: 2,
  name: 'Project 2',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Project 2 description...' 
}

export const Projects = [{
  _id: 1,
  name: 'Project 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Project 1 description...' 
},
{
  _id: 2,
  name: 'Project 2',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Project 2 description...' 
}]


// Customer
export const Customer = {
  _id: 1,
  name: 'Customer 1',
  vatNumber: '1234',
  contact: { phoneNumber: '12345678910' },
  includeContactOnInvoice: false,
  projects: [],
  sales: [],
  invoices: [],
  address: { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' }
}

export const Customer2 = {
  _id: 2,
  name: 'Customer 2',
  vatNumber: '1234',
  contact: { phoneNumber: '12345678910' },
  includeContactOnInvoice: false,
  projects: [],
  sales: [],
  invoices: [],
  address: { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' }
}

export const Customers = [{
  _id: 1,
  name: 'Customer 1',
  vatNumber: '1234',
  contact: { phoneNumber: '12345678910' },
  includeContactOnInvoice: false,
  projects: [],
  sales: [],
  invoices: [],
  address: { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' }
},
{
  _id: 2,
  name: 'Customer 2',
  vatNumber: '1234',
  contact: { phoneNumber: '12345678910' },
  includeContactOnInvoice: false,
  projects: [],
  sales: [],
  invoices: [],
  address: { street: 'Street 1', postalCode: '1234', region: 'Espoo', country: 'Finland' }
}]

// Invoice
export const Invoice = {
  _id: 1,
  sale: Sale,
  project: Project,
  customer: Customer,
  createdAt: new Date().toDateString(),
  deadline: new Date().toDateString(),
  paymentTerm: '',
  interestInArrears: 2,
  status: 'new',
  referenceNumber: 1234567890,
  description: 'Invoice 1 description...' 
}

export const Invoice2 = {
  _id: 2,
  sale: Sale2,
  project: Project2,
  customer: Customer2,
  createdAt: new Date().toDateString(),
  deadline: new Date().toDateString(),
  paymentTerm: '',
  interestInArrears: 2,
  status: 'new',
  referenceNumber: 1234567890,
  description: 'Invoice 2 description...' 
}

export const Invoices = [{
  _id: 1,
  sale: Sale._id,
  project: Project._id,
  customer: Customer,
  createdAt: new Date().toDateString(),
  deadline: new Date().toDateString(),
  paymentTerm: '',
  interestInArrears: 2,
  status: 'new',
  referenceNumber: 1234567890,
  description: 'Invoice 1 description...' 
},
{
 _id: 2,
  sale: Sale2._id,
  project: Project2._id,
  customer: Customer2,
  createdAt: new Date().toDateString(),
  deadline: new Date().toDateString(),
  paymentTerm: '',
  interestInArrears: 2,
  status: 'new',
  referenceNumber: 1234567890,
  description: 'Invoice 2 description...' 
}]
