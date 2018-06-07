// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    deadline: faker.date.future(),
    paymentTerm: null,
    interestInArrears: 5,
    status: 'new',
    description: faker.lorem.sentence(),
    total: faker.random.number(),
    tax: 0
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)