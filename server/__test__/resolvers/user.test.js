// Schema
import axios from "axios";

//import { truncate } from '../helpers/macros'
import { registerUser, loginUser, logoutUser } from "../helpers/authentication";

// Subdomain assinged
let subdomainLocal;

describe("User", () => {
  beforeAll(async () => {
    //await truncate()
    let response = await registerUser();
    const { success, email, password, subdomain } = response;

    if (success) {
      // Assign subdomain
      subdomainLocal = subdomain;

      tokens = await loginUser(email, password, subdomain);
    }
  });

  afterAll(async () => {
    //await truncate()

    await resetDb();

    await logoutUser();
  });

  test("getUsers", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `query {
        getUsers {
          id
          firstName
          lastName
          email
        }
      }`
      },
      {
        headers: {
          subdomain: subdomainLocal
        }
      }
    );

    const {
      data: { getUsers }
    } = response.data;

    expect(getUsers).not.toHaveLength(0);
  });
});
