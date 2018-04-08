// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    deadline: faker.date.future(),
    paymentTerm: null,
    interestInArrears: 5,
    referenceNumber: faker.random.number(),
    status: 'new',
    description: faker.lorem.sentence(),
    total: faker.random.number(),
    projectId: 1,
    saleId: null,
    customerId: 1,
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)