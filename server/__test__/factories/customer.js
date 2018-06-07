// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.name.firstName(),
    vatNumber: faker.random.number(),
    phoneNumber: faker.phone.phoneNumberFormat(),
    email: faker.internet.email(),
    isContactIncludedInInvoice: faker.random.boolean(),
    street: faker.address.streetName(),
    postalCode: faker.address.zipCode(),
    region: faker.address.county(),
    country: faker.address.county()
  }
  console.log('phoneNumber: ', defaultProps.phoneNumber)
  console.log('county: ', defaultProps.country)
  console.log('street: ', defaultProps.street)
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)