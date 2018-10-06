import gql from 'graphql-tag'

export const GET_ACCOUNT_QUERY = gql`
  query getAccount($subdomain: String!) {
    getAccount(subdomain: $subdomain) {
      id
      subdomain
      industry
      currencyCode
      companyId
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
  mutation updateAccount($subdomain: String!, $industry: String, $currencyCode: String, $companyId: String, $email: String, $phoneNumber: String, $logoUrl: String, $street: String, $postalCode: String, $region: String, $country: String) {
    updateAccount(subdomain: $subdomain, industry: $industry, currencyCode: $currencyCode, companyId: $companyId, email: $email, phoneNumber: $phoneNumber, logoUrl: $logoUrl, street: $street, postalCode: $postalCode, region: $region, country: $country) {
      success
      account {
        id
        subdomain
        industry
        currencyCode
        companyId
        email
        phoneNumber
        street
        postalCode
        region
        country
        logoUrl
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
      errors {
        path
        message
      }
    }
  }
`


