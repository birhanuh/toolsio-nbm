// Schema
import axios from "axios";

import { resetDb } from "../helpers/macros";

// Load factories
import taskFactory from "../factories/task";

// Authentication
import { registerUser, loginUser, logoutUser } from "../helpers/authentication";
import { createCustomer, createProject } from "../helpers/related_objects";

// Subdomain assinged
let subdomainLocal;

describe("Task", () => {
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
        query: `mutation createTask($name: String!, $hours: String!, $paymentType: String!, $unitPrice: Float!, $total: Float!, $projectId: Int!) {
        createTask(name: $name, hours: $hours, paymentType: $paymentType, unitPrice: $unitPrice, total: $total, projectId: $projectId) {
          success
          errors {
            path
            message
          }
        }
      }`,
        variables: {
          name: "",
          hours: "",
          paymentType: "",
          unitPrice: 0,
          total: 0,
          projectId: 1
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
        createTask: { success }
      }
    } = response.data;

    expect(success).toBe(false);
  });

  it("createTask", async () => {
    let taskFactoryLocal = await taskFactory();
    // Create customer
    let customer = await createCustomer(subdomainLocal);
    // Create project
    let project = await createProject(customer.id, subdomainLocal);

    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation createTask($name: String!, $hours: String!, $paymentType: String!, $unitPrice: Float!, $total: Float!, $projectId: Int!) {
        createTask(name: $name, hours: $hours, paymentType: $paymentType, unitPrice: $unitPrice, total: $total, projectId: $projectId) {
          success
          task {
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
          name: taskFactoryLocal.name,
          hours: taskFactoryLocal.hours,
          paymentType: taskFactoryLocal.paymentType,
          unitPrice: taskFactoryLocal.unitPrice,
          total: taskFactoryLocal.total,
          projectId: project.id
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
        createTask: { success, task }
      }
    } = response.data;

    expect(success).toBe(true);
    expect(task).not.toBe(null);
  });

  it("updateTask", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation updateTask($id: Int!, $name: String, $hours: String, $paymentType: String, $unitPrice: Float, $total: Float, $projectId: Int) {
        updateTask(id: $id, name: $name, hours: $hours, paymentType: $paymentType, unitPrice: $unitPrice, total: $total, projectId: $projectId) {
          success
          task {
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
          name: "Task name updated"
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
        updateTask: { success, task }
      }
    } = response.data;

    expect(success).toBe(true);
    expect(task.name).toEqual("Task name updated");
  });

  it("deleteTask", async () => {
    const response = await axios.post(
      "http://localhost:8080/graphql",
      {
        query: `mutation deleteTask($id: Int!) {
        deleteTask(id: $id) {
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
        deleteTask: { success }
      }
    } = response.data;

    expect(success).toBe(true);
  });
});
