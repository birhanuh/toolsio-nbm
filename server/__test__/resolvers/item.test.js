// Schema
import axios from "axios";

import { resetDb } from "../helpers/macros";

// Load factories
import itemFactory from "../factories/item";

// Authentication
import { registerUser, loginUser, logoutUser } from "../helpers/authentication";
import { createCustomer, createSale } from "../helpers/related_objects";

// Subdomain assinged
let subdomainLocal;

describe("Item", () => {
  beforeAll(async () => {
    await resetDb();
    let response = await registerUser();
    const { success, email, password, subdomain } = response;

    if (success) {
      // Assign subdomain
      subdomainLocal = subdomain;

      tokens = await loginUser(email, password, subdomain);
    }
  });

  afterAll(async () => {
    await resetDb();

    await logoutUser();
  });

  it("should fail with validation errors for each required field", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation createItem($name: String!, $unit: String!, $quantity: Int!, $unitPrice: Float!, $total: Float!, $saleId: Int!) {
        createItem(name: $name, unit: $unit, quantity: $quantity, unitPrice: $unitPrice, total: $total, saleId: $saleId) {
          success
          errors {
            path
            message
          }
        }
      }`,
        variables: {
          name: "",
          unit: 0,
          quantity: 0,
          unitPrice: 0,
          total: 0,
          saleId: 1
        }
      },
      {
        headers: {
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        createItem: { success }
      }
    } = response.data;

    expect(success).toBe(false);
  });

  it("createItem", async () => {
    let itemFactoryLocal = await itemFactory();
    // Create customer
    let customer = await createCustomer(subdomainLocal);
    // Create sale
    let sale = await createSale(customer.id, subdomainLocal);

    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation createItem($name: String!, $unit: String!, $quantity: Int!, $unitPrice: Float!, $total: Float!, $saleId: Int!) {
        createItem(name: $name, unit: $unit, quantity: $quantity, unitPrice: $unitPrice, total: $total, saleId: $saleId) {
          success
          item {
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
          name: itemFactoryLocal.name,
          unit: itemFactoryLocal.unit,
          quantity: itemFactoryLocal.quantity,
          unitPrice: itemFactoryLocal.unitPrice,
          total: itemFactoryLocal.total,
          saleId: sale.id
        }
      },
      {
        headers: {
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        createItem: { success, item }
      }
    } = response.data;

    expect(success).toBe(true);
    expect(item).not.toBe(null);
  });

  it("updateItem", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation updateItem($id: Int!, $name: String, $unit: String, $quantity: Int, $unitPrice: Float, $total: Float, $saleId: Int) {
        updateItem(id: $id, name: $name, unit: $unit, quantity: $quantity, unitPrice: $unitPrice, total: $total, saleId: $saleId) {
          success
          item {
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
          name: "Item name updated"
        }
      },
      {
        headers: {
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        updateItem: { success, item }
      }
    } = response.data;

    expect(success).toBe(true);
    expect(item.name).toEqual("Item name updated");
  });

  it("deleteItem", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation deleteItem($id: Int!) {
        deleteItem(id: $id) {
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
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        deleteItem: { success }
      }
    } = response.data;

    expect(success).toBe(true);
  });
});
