import gql from 'graphql-tag'

export const GET_INVOICES_QUERY = gql`
  query getInvoices($offset: Int!, $limit: Int!, $order: String!) {
    getInvoices(offset: $offset, limit: $limit, order: $order) {
      count
      invoices {
        id
        deadline
        referenceNumber
        status
        tax
        total
        project {
          id
          name
        }
        sale {
          id
          name
        }
        customer {
          id
          name
        }
      }
    }
  }
`

export const GET_INVOICE_QUERY = gql`
  query getInvoice($id: Int!) {
    getInvoice(id: $id) {
      id
      deadline
      paymentTerm
      interestInArrears
      referenceNumber
      status
      description
      createdAt
      user {
        firstName
        email
      }
      project {
        id
        name
        deadline
        progress
        status
        tasks {
          id
          name
          hours
          paymentType
          unitPrice
          total
        }
      }
      sale {
        id
        name
        deadline
        status
        items {
          id
          name
          unit
          quantity
          unitPrice
          total
        }
      }
      customer {
        id
        name
        vatNumber
        phoneNumber
        email
        isContactIncludedInInvoice
        street
        postalCode
        region
        country
      }
    }
  }
`

export const GET_INVOICE_FORM_QUERY = gql`
  query getInvoice($id: Int!) {
    getInvoice(id: $id) {
      id
      deadline
      paymentTerm
      interestInArrears
      referenceNumber
      status
      tax
      createdAt
      project {
        id
        name
        deadline
        progress
        status
        total
      }
      sale {
        id
        name
        deadline
        status
        total
      }
      customer {
        id
        name
      }
    }
  }
`

export const CREATE_INVOICE_MUTATION = gql`
  mutation createInvoice($deadline: Date, $paymentTerm: Int, $interestInArrears: Int!, $status: String!, 
    $description: String, $tax: Float!, $projectId: Int, $saleId: Int, $customerId: Int!) {
    createInvoice(deadline: $deadline, paymentTerm: $paymentTerm, interestInArrears: $interestInArrears, status: $status,
      description: $description, tax: $tax, projectId: $projectId, saleId: $saleId, customerId: $customerId) {
      success
      invoice {
        id
        deadline
        referenceNumber
        status
        tax
        project {
          id
          name
        }
        sale {
          id
          name
        }
        customer {
          id
          name
          vatNumber
          email
          phoneNumber
        }
      }
      errors {
        path
        message
      }
    }
  }
`

export const UPDATE_INVOICE_MUTATION = gql`
  mutation updateInvoice($id: Int!, $deadline: Date, $paymentTerm: Int, $interestInArrears: Int, $status: String, 
    $description: String, $tax: Float, $projectId: Int, $saleId: Int, $customerId: Int) {
    updateInvoice(id: $id, deadline: $deadline, paymentTerm: $paymentTerm, interestInArrears: $interestInArrears, status: $status,
      description: $description, tax: $tax, projectId: $projectId, saleId: $saleId, customerId: $customerId) {
      success
      invoice {
        id
        deadline
        referenceNumber
        status
        tax
        project {
          id
          name
        }
        sale {
          id
          name
        }
        customer {
          id
          name
          vatNumber
          email
          phoneNumber
        }
      }
      errors {
        path
        message
      }
    }
  }
`

export const DELETE_INVOICE_MUTATION = gql`
  mutation deleteInvoice($id: Int!) {
    deleteInvoice(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`

export const GET_PROJECTS_WITHOUT_INVOICE_QUERY = gql`
  query getProjectsWithoutInvoice($name: String!) {
    getProjectsWithoutInvoice(name: $name) {
      id
      name 
      deadline
      status
      progress
      description
      total
      customer_id
      customer_name
    }
  }
`

export const GET_SALES_WITHOUT_INVOICE_QUERY = gql`
  query getSalesWithoutInvoice($name: String!) {
    getSalesWithoutInvoice(name: $name) {
      id
      name 
      deadline
      status
      description
      total
      customer_id
      customer_name
    }
  }
`

export const GET_ACCOUNT_QUERY = gql`
  query getAccount($subdomain: String!) {
    getAccount(subdomain: $subdomain) {
      id
      subdomain
      industry
      email
      phoneNumber
      street
      postalCode
      region
      country
      logoUrl
    }
  }
`

