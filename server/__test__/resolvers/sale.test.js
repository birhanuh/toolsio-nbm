// Schema
import axios from "axios";

import { resetDb } from "../helpers/macros";

// Load factories
import saleFactory from "../factories/sale";

// Authentication
import { registerUser, loginUser } from "../helpers/authentication";
import { createCustomer } from "../helpers/related_objects";

// Tokens
let tokens;
let subdomainLocal;

describe("Sale", () => {
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
    await resetDb();
  });

  it("should fail with validation errors for each required field", async () => {
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
          name: "",
          deadline: "",
          status: "",
          progress: 0,
          description: "",
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
        createSale: { success }
      }
    } = response.data;

    expect(success).toBe(false);
  });

  it("createSale", async () => {
    let saleFactoryLocal = await saleFactory();
    // Create customer
    let customer = await createCustomer(
      tokens.authToken,
      tokens.refreshAuthToken,
      subdomainLocal
    );

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
        createSale: { success, sale }
      }
    } = response.data;

    expect(success).toBe(true);
    expect(sale).not.toBe(null);
  });

  it("updateSale", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation updateSale($id: Int!, $name: String, $deadline: Date, $status: String, $description: String, $customerId: Int) {
        updateSale(id: $id, name: $name, deadline: $deadline, status: $status, description: $description, customerId: $customerId) {
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
          id: 1,
          name: "Sale name updated"
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
        updateSale: { success, sale }
      }
    } = response.data;

    expect(success).toBe(true);
    expect(sale.name).toEqual("Sale name updated");
  });

  it("deleteSale", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: ` mutation deleteSale($id: Int!) {
        deleteSale(id: $id) {
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
        deleteSale: { success }
      }
    } = response.data;

    expect(success).toBe(true);
  });
});
