import gql from 'graphql-tag'

export const GET_ACCOUNT_QUERY = gql`
  query getAccount($subdomain: String!) {
    getAccount(subdomain: $subdomain) {
      id
      subdomain
      industry
      email
      phoneNumber
      street
      postalCode
      region
      country
      logoUrl
    }
  }
`

export const UPDATE_ACCOUNT_MUTATION = gql`
  mutation updateAccount($subdomain: String!, $industry: String, $email: String!, $phoneNumber: String, $logoUrl: String, $street: String, $postalCode: String, $region: String, $country: String) {
    updateAccount(subdomain: $subdomain, industry: $industry, email: $email, phoneNumber: $phoneNumber, logoUrl: $logoUrl, street: $street, postalCode: $postalCode, region: $region, country: $country) {
      success
      account {
        id
        subdomain
      }
      errors {
        path
        message
      }
    }
  }
`

export const S3_SIGN_LOGO_MUTATION = gql`
  mutation s3SignLogo($fileName: String!, $fileType: String!) {
    s3SignLogo(fileName: $fileName, fileType: $fileType) {
      signedRequest
      url
      errors
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
  mutation updateUser($firstName: String!, $lastName: String, $email: String!, $avatarUrl: String) {
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

export const S3_SIGN_AVATAR_MUTATION = gql`
  mutation s3SignAvatar($fileName: String!, $fileType: String!) {
    s3SignAvatar(fileName: $fileName, fileType: $fileType) {
      signedRequest
      url
      errors
    }
  }
`
