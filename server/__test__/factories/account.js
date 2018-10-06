// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    subdomain: faker.lorem.word(),
    industry: faker.commerce.department(),
    phoneNumber: faker.phone.phoneNumberFormat(),
    email: faker.internet.email(),
    street: faker.address.streetName(),
    postalCode: faker.address.zipCode(),
    region: faker.address.county(),
    country: faker.address.country(),
    logoUrl: faker.image.imageUrl()
  }
  console.log('phoneNumber: ', defaultProps.phoneNumber)
  console.log('county: ', defaultProps.country)
  console.log('street: ', defaultProps.street)
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)