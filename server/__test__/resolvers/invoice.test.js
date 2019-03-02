// Schema
import axios from "axios";

import { resetDb } from "../helpers/macros";

// Load factories
import invoiceFactory from "../factories/invoice";

// Authentication
import { registerUser, loginUser } from "../helpers/authentication";
import { createCustomer, createProject } from "../helpers/related_objects";

// Tokens
let tokens;
let subdomainLocal;

describe("Invoice", () => {
  beforeAll(async () => {
    await resetDb();
    let response = await registerUser();
    const { success, email, password, subdomain } = response;
    // Assign subdomain
    subdomainLocal = subdomain;

    if (success) {
      tokens = await loginUser(email, password, subdomain);
    }
  });

  afterAll(async () => {
    //await resetDb()
  });

  it("should fail with validation errors for each required field", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation createInvoice($deadline: Date, $paymentTerm: Int, $interestInArrears: Int!, $status: String, 
        $description: String, $tax: Float!, $projectId: Int, $saleId: Int, $customerId: Int!) {
        createInvoice(deadline: $deadline, paymentTerm: $paymentTerm, interestInArrears: $interestInArrears, status: $status,
          description: $description, tax: $tax, projectId: $projectId, saleId: $saleId, customerId: $customerId) {
          success
          invoice {
            id
            deadline
          }
          errors {
            path
            message
          }
        }
      }`,
        variables: {
          deadline: "",
          paymentTerm: null,
          interestInArrears: 0,
          status: "",
          description: "",
          projectId: 1,
          saleId: null,
          tax: 0,
          customerId: 1
        }
      },
      {
        headers: {
          "x-auth-token": tokens.authToken,
          "x-refresh-auth-token": tokens.refreshAuthToken,
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        createInvoice: { success }
      }
    } = response.data;

    expect(success).toBe(false);
  });

  it("createInvoice", async () => {
    let invoiceFactoryLocal = await invoiceFactory();
    // Create customer
    let customer = await createCustomer(
      tokens.authToken,
      tokens.refreshAuthToken,
      subdomainLocal
    );
    // Create project
    console.log("customerId", customer);
    let project = await createProject(
      tokens.authToken,
      tokens.refreshAuthToken,
      customer.id,
      subdomainLocal
    );

    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation createInvoice($deadline: Date, $paymentTerm: Int, $interestInArrears: Int!, $status: String, 
        $description: String, $tax: Float!, $projectId: Int, $saleId: Int, $customerId: Int!) {
        createInvoice(deadline: $deadline, paymentTerm: $paymentTerm, interestInArrears: $interestInArrears, status: $status,
          description: $description, tax: $tax, projectId: $projectId, saleId: $saleId, customerId: $customerId) {
          success
          invoice {
            id
            deadline
          }
          errors {
            path
            message
          }
        }
      }`,
        variables: {
          deadline: invoiceFactoryLocal.deadline,
          paymentTerm: invoiceFactoryLocal.paymentTerm,
          interestInArrears: invoiceFactoryLocal.interestInArrears,
          status: invoiceFactoryLocal.status,
          description: invoiceFactoryLocal.description,
          projectId: project.id,
          saleId: null,
          tax: invoiceFactoryLocal.tax,
          customerId: customer.id
        }
      },
      {
        headers: {
          "x-auth-token": tokens.authToken,
          "x-refresh-auth-token": tokens.refreshAuthToken,
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        createInvoice: { success, invoice }
      }
    } = response.data;

    expect(success).toBe(true);
    expect(invoice).not.toBe(null);
  });

  it("updateInvoice", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation updateInvoice($id: Int!, $deadline: Date, $paymentTerm: Int, $interestInArrears: Int, $status: String, 
        $description: String, $tax: Float, $projectId: Int, $saleId: Int, $customerId: Int) {
        updateInvoice(id: $id, deadline: $deadline, paymentTerm: $paymentTerm, interestInArrears: $interestInArrears, status: $status,
          description: $description, tax: $tax, projectId: $projectId, saleId: $saleId, customerId: $customerId) {
          success
          invoice {
            id
            tax
          }
          errors {
            path
            message
          }
        }
      }`,
        variables: {
          id: 1,
          tax: 5
        }
      },
      {
        headers: {
          "x-auth-token": tokens.authToken,
          "x-refresh-auth-token": tokens.refreshAuthToken,
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        updateInvoice: { success, invoice }
      }
    } = response.data;

    expect(success).toBe(true);
    expect(invoice.tax).toEqual(5);
  });

  it("deleteInvoice", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: ` mutation deleteInvoice($id: Int!) {
        deleteInvoice(id: $id) {
          success
          errors {
            path
            message
          }
        } 
      }`,
        variables: {
          id: 1
        }
      },
      {
        headers: {
          "x-auth-token": tokens.authToken,
          "x-refresh-auth-token": tokens.refreshAuthToken,
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        deleteInvoice: { success }
      }
    } = response.data;

    expect(success).toBe(true);
  });
});
