// Schema
import axios from "axios";

// Load factories
import customerFactory from "../factories/customer";
import projectFactory from "../factories/project";
import saleFactory from "../factories/sale";

export async function createCustomer(authToken, refreshAuthToken, subdomain) {
  let customerFactoryLocal = await customerFactory();

  const response = await axios.post(
    "http://localhost:8080/graphql",
    {
      query: `mutation createCustomer($name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
      createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
        postalCode: $postalCode, region: $region, country: $country) {
        success
        customer {
          id
          name
        }
        errors {
          path
          message
        }
      }
    }`,
      variables: {
        name: customerFactoryLocal.name,
        vatNumber: customerFactoryLocal.vatNumber,
        email: customerFactoryLocal.email,
        phoneNumber: customerFactoryLocal.phoneNumber,
        isContactIncludedInInvoice:
          customerFactoryLocal.isContactIncludedInInvoice,
        street: customerFactoryLocal.street,
        postalCode: customerFactoryLocal.postalCode,
        region: customerFactoryLocal.region,
        country: customerFactoryLocal.country
      }
    },
    {
      headers: {
        "x-auth-token": authToken,
        "x-refresh-auth-token": refreshAuthToken,
        subdomain: subdomain
      }
    }
  );

  const {
    data: {
      createCustomer: { customer }
    }
  } = response.data;

  return customer;
}

export async function createProject(
  authToken,
  refreshAuthToken,
  customerId,
  subdomain
) {
  let projectFactoryLocal = await projectFactory();

  const response = await axios.post(
    "http://localhost:8080/graphql",
    {
      query: `mutation createProject($name: String!, $deadline: Date!, $status: String!, $progress: Int, $description: String, $customerId: Int!) {
      createProject(name: $name, deadline: $deadline, status: $status, progress: $progress, description: $description, customerId: $customerId) {
        success
        project {
          id
          name 
        }
        errors {
          path
          message
        }
      }
    }`,
      variables: {
        name: projectFactoryLocal.name,
        deadline: projectFactoryLocal.deadline,
        status: projectFactoryLocal.status,
        description: projectFactoryLocal.description,
        customerId: customerId
      }
    },
    {
      headers: {
        "x-auth-token": authToken,
        "x-refresh-auth-token": refreshAuthToken,
        subdomain: subdomain
      }
    }
  );

  const {
    data: {
      createProject: { project }
    }
  } = response.data;

  return project;
}

export async function createSale(
  authToken,
  refreshAuthToken,
  customerId,
  subdomain
) {
  let saleFactoryLocal = await saleFactory();

  const response = await axios.post(
    "http://localhost:8080/graphql",
    {
      query: `mutation createSale($name: String!, $deadline: Date!, $status: String!, $description: String, $customerId: Int!) {
      createSale(name: $name, deadline: $deadline, status: $status, description: $description, customerId: $customerId) {
        success
        sale {
          id
          name 
        }
        errors {
          path
          message
        }
      }
    }`,
      variables: {
        name: saleFactoryLocal.name,
        deadline: saleFactoryLocal.deadline,
        status: saleFactoryLocal.status,
        description: saleFactoryLocal.description,
        customerId: customerId
      }
    },
    {
      headers: {
        "x-auth-token": authToken,
        "x-refresh-auth-token": refreshAuthToken,
        subdomain: subdomain
      }
    }
  );

  const {
    data: {
      createSale: { sale }
    }
  } = response.data;

  return sale;
}
