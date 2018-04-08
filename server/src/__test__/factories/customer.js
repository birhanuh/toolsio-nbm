// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.name.firstName(),
    vatNumber: faker.random.number(),
    phoneNumber: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    isContactIncludedInInvoice: faker.random.boolean(),
    street: faker.address.streetName(),
    postalCode: faker.address.zipCode(),
    region: faker.address.county(),
    country: faker.address.country()
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)