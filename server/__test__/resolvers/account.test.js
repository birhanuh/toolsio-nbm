// Schema
import axios from "axios";

import { resetDb } from "../helpers/macros";
import { registerUser, loginUser, logoutUser } from "../helpers/authentication";

// Subdomain assinged
let subdomainLocal;

// Load factories
import accountFactory from "../factories/account";

describe("Account", () => {
  beforeAll(async () => {
    await resetDb();
    let response = await registerUser();
    const { success, email, password, subdomain } = response;

    if (success) {
      // Assign subdomain
      subdomainLocal = subdomain;

      await loginUser(email, password, subdomain);
    }
  });

  afterAll(async () => {
    await resetDb();

    await logoutUser();
  });

  it("finds Account", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `query getAccount($subdomain: String!) {
        getAccount(subdomain: $subdomain) {
          id
          subdomain
        }
      }`,
        variables: {
          subdomain: subdomainLocal
        }
      },
      {
        headers: {
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: { getAccount }
    } = response.data;

    expect(getAccount).not.toBe(null);
  });

  it("updates Account", async () => {
    let accountFactoryLocal = await accountFactory();

    // Update name
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation updateAccount($subdomain: String!, $industry: String, $email: String, $phoneNumber: String, $logoUrl: String, $street: String, $postalCode: String, $region: String, $country: String) {
        updateAccount(subdomain: $subdomain, industry: $industry, email: $email, phoneNumber: $phoneNumber, logoUrl: $logoUrl, street: $street, postalCode: $postalCode, region: $region, country: $country) {
          success
          account {
            id
            subdomain
            industry
          }
          errors {
            path
            message
          }
        }
      }`,
        variables: {
          subdomain: subdomainLocal,
          industry: accountFactoryLocal.industry,
          email: accountFactoryLocal.email,
          phoneNumber: accountFactoryLocal.phoneNumber,
          logoUrl: accountFactoryLocal.logoUrl,
          street: accountFactoryLocal.street,
          postalCode: accountFactoryLocal.postalCode,
          region: accountFactoryLocal.region,
          country: accountFactoryLocal.country
        }
      },
      {
        headers: {
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: { updateAccount }
    } = response.data;
    let updateAccountUpdated = updateAccount;
    delete updateAccountUpdated["id"]; // Delete id because it increments corresponding to test suites

    expect(updateAccountUpdated).toMatchObject({
      success: true,
      account: {
        subdomain: subdomainLocal,
        industry: accountFactoryLocal.industry
      },
      errors: null
    });
  });

  it("deletes Account", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation deleteAccount($subdomain: String!) {
        deleteAccount(subdomain: $subdomain) {
          success
          errors {
            path
            message
          }
        }
      }`,
        variables: {
          subdomain: subdomainLocal
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
        deleteAccount: { success }
      }
    } = response.data;

    expect(success).toBe(true);
  });
});
