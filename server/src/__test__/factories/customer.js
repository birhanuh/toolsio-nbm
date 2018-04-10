// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.name.firstName(),
    vatNumber: faker.random.number(),
    phoneNumber: "12345678910",
    email: faker.internet.email(),
    isContactIncludedInInvoice: faker.random.boolean(),
    street: faker.address.streetName(),
    postalCode: "1234",
    region: faker.address.county(),
    country: "Finland"
  }
  console.log('postalCode: ', defaultProps.postalCode)
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)