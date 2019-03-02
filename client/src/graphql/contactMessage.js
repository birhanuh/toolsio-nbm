import gql from "graphql-tag";

export const CREATE_CONTACT_MESSAGE_MUTATION = gql`
  mutation createContactMessage(
    $name: String!
    $email: String!
    $messageBody: String!
  ) {
    createContactMessage(
      name: $name
      email: $email
      messageBody: $messageBody
    ) {
      success
      error
    }
  }
`;
