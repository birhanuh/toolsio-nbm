import gql from "graphql-tag";

export const GET_CUSTOMERS_QUERY = gql`
  query getCustomers(
    $offset: Int!
    $limit: Int!
    $order: String!
    $name: String
  ) {
    getCustomers(offset: $offset, limit: $limit, order: $order, name: $name) {
      count
      customers {
        id
        name
        vatNumber
        phoneNumber
        email
      }
    }
  }
`;

export const GET_CUSTOMER_QUERY = gql`
  query getCustomer($id: Int!) {
    getCustomer(id: $id) {
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
      projects {
        id
        name
        deadline
        progress
        status
      }
      sales {
        id
        name
        deadline
        status
      }
      invoices {
        id
        deadline
        paymentTerm
        interestInArrears
        referenceNumber
        status
      }
      user {
        firstName
      }
    }
  }
`;

export const CREATE_CUSTOMER_MUTATION = gql`
  mutation createCustomer(
    $name: String!
    $vatNumber: String!
    $email: String!
    $phoneNumber: String!
    $isContactIncludedInInvoice: Boolean!
    $street: String
    $postalCode: String
    $region: String
    $country: String
  ) {
    createCustomer(
      name: $name
      vatNumber: $vatNumber
      email: $email
      phoneNumber: $phoneNumber
      isContactIncludedInInvoice: $isContactIncludedInInvoice
      street: $street
      postalCode: $postalCode
      region: $region
      country: $country
    ) {
      success
      customer {
        id
        name
        vatNumber
        phoneNumber
        email
      }
      errors {
        path
        message
      }
    }
  }
`;

export const UPDATE_CUSTOMER_MUTATION = gql`
  mutation updateCustomer(
    $id: Int!
    $name: String
    $vatNumber: String
    $email: String
    $phoneNumber: String
    $isContactIncludedInInvoice: Boolean
    $street: String
    $postalCode: String
    $region: String
    $country: String
  ) {
    updateCustomer(
      id: $id
      name: $name
      vatNumber: $vatNumber
      email: $email
      phoneNumber: $phoneNumber
      isContactIncludedInInvoice: $isContactIncludedInInvoice
      street: $street
      postalCode: $postalCode
      region: $region
      country: $country
    ) {
      success
      customer {
        id
        name
        vatNumber
        phoneNumber
        email
      }
      errors {
        path
        message
      }
    }
  }
`;

export const DELETE_CUSTOMER_MUTATION = gql`
  mutation deleteCustomer($id: Int!) {
    deleteCustomer(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`;
