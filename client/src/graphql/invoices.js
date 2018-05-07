import gql from 'graphql-tag'

export const GET_INVOICES_QUERY = gql`
  query {
    getInvoices {
      id
      deadline
      referenceNumber
      status
      tax
      total
      project {
        id
        name
        status
      }
      sale {
        id
        name
        status
      }
      customer {
        id
        name
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
          price
          vat
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
          price
          vat
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
  mutation updateInvoice($id: Int!, $deadline: Date, $paymentTerm: Int, $interestInArrears: Int!, $status: String!, 
    $description: String, $tax: Float!, $projectId: Int, $saleId: Int, $customerId: Int!) {
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

export const GET_PROJECTS_SALES_WITHOUT_INVOICE_QUERY = gql`
  {
    getProjectsWithoutInvoice {
      id
      name 
      deadline
      status
      progress
      description
      total
      customer {
        id
        name
      }
    }
    getSalesWithoutInvoice {
      id
      name 
      deadline
      status
      description
      total
      customer {
        id
        name
      }
    }
}
`

export const GET_PROJECTS_SALES_WITH_INVOICE_QUERY = gql`
  {
    getProjectsWithInvoice {
      id
      name 
      deadline
      status
      progress
      description
      total
      customer {
        id
        name
      }
    }
    getSalesWithInvoice {
      id
      name 
      deadline
      status
      description
      total
      customer {
        id
        name
      }
    }
}
`
