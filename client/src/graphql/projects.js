import gql from "graphql-tag";

// const fragments = gql`
//   fragment ProjectsPageProject on Project {
//     id
//     name
//     deadline
//     status
//     progress
//     description
//     customer {
//       id
//       name
//     }
//   }
// `

export const GET_PROJECTS_QUERY = gql`
  query getProjects(
    $offset: Int!
    $limit: Int!
    $order: String!
    $name: String
  ) {
    getProjects(offset: $offset, limit: $limit, order: $order, name: $name) {
      id
      name
      deadline
      status
      progress
      description
      isInvoiced
      customer {
        id
        name
      }
      user {
        firstName
      }
    }
  }
`;

export const GET_PROJECT_QUERY = gql`
  query getProject($id: Int!) {
    getProject(id: $id) {
      id
      name
      deadline
      status
      progress
      description
      isInvoiced
      customer {
        id
        name
      }
      tasks {
        id
        name
        hours
        paymentType
        unitPrice
        total
        projectId
      }
      user {
        firstName
      }
    }
  }
`;

export const CREATE_PROJECT_MUTATION = gql`
  mutation createProject(
    $name: String!
    $deadline: Date!
    $status: String
    $progress: Int
    $description: String
    $customerId: Int!
  ) {
    createProject(
      name: $name
      deadline: $deadline
      status: $status
      progress: $progress
      description: $description
      customerId: $customerId
    ) {
      success
      project {
        id
        name
        deadline
        status
        progress
        description
        isInvoiced
        customer {
          id
          name
        }
        user {
          firstName
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

export const UPDATE_PROJECT_MUTATION = gql`
  mutation updateProject(
    $id: Int!
    $name: String
    $deadline: Date
    $status: String
    $progress: Int
    $description: String
    $customerId: Int
  ) {
    updateProject(
      id: $id
      name: $name
      deadline: $deadline
      status: $status
      progress: $progress
      description: $description
      customerId: $customerId
    ) {
      success
      project {
        id
        name
        deadline
        status
        progress
        description
        isInvoiced
        customer {
          id
          name
        }
        user {
          firstName
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

export const DELETE_PROJECT_MUTATION = gql`
  mutation deleteProject($id: Int!) {
    deleteProject(id: $id) {
      success
      errors {
        path
        message
      }
    }
  }
`;
