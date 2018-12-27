import gql from 'graphql-tag'

export const GET_CURRENT_USER_QUERY = gql`
  { 
    getCurrentUser {
      id
      firstName
      email
    }
  }
`

export const GET_USERS_QUERY = gql`
  {
    getUsers {
      id
      firstName
      lastName
      email
      avatarUrl
    }
  }
`

export const SEND_INVITATION_MUTATION = gql`
  mutation sendInvitation($email: String!) {
    sendInvitation(email: $email) {
      success
      errors {
        path
        message
      }
    }
  }
`

export const GET_USER_QUERY = gql`
  query getUser($id: Int!) { 
    getUser(id: $id) {
      id
      firstName
      email
    }
  }
`

export const GET_INVITED_USERS_QUERY = gql`
   {
    getInvitedUsers {
      id
      email
      isInvitationAccepted
    }
  }
`

export const GET_USER_BY_EMAIL_QUERY = gql`
  query getUserByEmail($email: String!) {
    getUserByEmail(email: $email) {
      id
      firstName
      lastName
      email
      avatarUrl
      isAdmin
    }
  }
`

export const UPDATE_USER_MUTATION = gql`
  mutation updateUser($firstName: String, $lastName: String, $email: String!, $avatarUrl: String) {
    updateUser(firstName: $firstName, lastName: $lastName, email: $email, avatarUrl: $avatarUrl) {
      success
      user {
        id
        email
      }
      errors {
        path
        message
      }
    }
  }
`

export const UPDATE_USER_PASSWORD_MUTATION = gql`
  mutation($currentPassword: String!, $newPassword: String!) {
    updateUserPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      errors {
        path
        message
      }
    }
  }
`

export const S3_SIGN_AVATAR_MUTATION = gql`
  mutation s3SignAvatar($fileName: String!, $fileType: String!) {
    s3SignAvatar(fileName: $fileName, fileType: $fileType) {
      signedRequest
      url
      errors {
        path
        message
      }
    }
  }
`