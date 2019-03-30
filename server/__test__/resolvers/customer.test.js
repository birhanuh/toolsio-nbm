// Schema
import axios from "axios";

import { resetDb } from "../helpers/macros";
import { registerUser, loginUser, logoutUser } from "../helpers/authentication";

// Load factories
import customerFactory from "../factories/customer";

// Subdomain assinged
let subdomainLocal;

describe("Customer", () => {
  beforeAll(async () => {
    await resetDb();
    let response = await registerUser();
    const { success, email, password, subdomain } = response;

    if (success) {
      // Assign subdomain
      subdomainLocal = subdomain;
      const login = await loginUser(email, password, subdomain);

      console.log("login: ", login);
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
        query: `mutation createCustomer($name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
        createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
          postalCode: $postalCode, region: $region, country: $country) {
          success
          errors {
            path
            message
          }
        }
      }`,
        variables: {
          name: "",
          vatNumber: 0,
          email: "",
          phoneNumber: "",
          isContactIncludedInInvoice: false,
          street: "",
          postalCode: "",
          region: "",
          country: ""
        }
      },
      {
        headers: {
          origin: "http://localhost:8080",
          subdomain: subdomainLocal
        }
      },
      { withCredentials: true }
    );
    console.log("REZ: ", response.data);
    const {
      data: {
        createCustomer: { success }
      }
    } = response.data;

    expect(success).toBe(false);
  });

  xit("saves Customer", async () => {
    let customerFactoryLocal = await customerFactory();

    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation createCustomer($name: String!, $vatNumber: Int!, $email: String!, $phoneNumber: String!, $isContactIncludedInInvoice: Boolean!, $street: String, $postalCode: String, $region: String, $country: String) {
        createCustomer(name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, 
          postalCode: $postalCode, region: $region, country: $country) {
          success
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
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: {
        createCustomer: { success }
      }
    } = response.data;

    expect(success).toBe(true);
  });

  xit("finds Customer", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `query getCustomer($id: Int!) {
        getCustomer(id: $id) {
          id
          name
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
      data: { getCustomer }
    } = response.data;

    expect(getCustomer).not.toBe(null);
  });

  xit("updates Customer", async () => {
    // Update name
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation updateCustomer($id: Int!, $name: String, $vatNumber: Int, $email: String, $phoneNumber: String, $isContactIncludedInInvoice: Boolean, $street: String, $postalCode: String, $region: String, $country: String) {
        updateCustomer(id: $id, name: $name, vatNumber: $vatNumber, email: $email, phoneNumber: $phoneNumber, isContactIncludedInInvoice: $isContactIncludedInInvoice, street: $street, postalCode: $postalCode, region: $region, country: $country) {
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
          id: 1,
          name: "name updated"
        }
      },
      {
        headers: {
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: { updateCustomer }
    } = response.data;

    expect(updateCustomer).toMatchObject({
      success: true,
      customer: {
        id: 1,
        name: "name updated"
      }
    });
  });

  xit("deletes Customer", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: ` mutation deleteCustomer($id: Int!) {
        deleteCustomer(id: $id) {
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
        deleteCustomer: { success }
      }
    } = response.data;

    expect(success).toBe(true);
  });
});
