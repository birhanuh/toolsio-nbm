// Sale
export const Sale = {
  _id: 1,
  name: 'Sale 1',
  deadline: new Date().toDateString(),
  status: 'new',
  description: 'Sale 1 description...' 
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
