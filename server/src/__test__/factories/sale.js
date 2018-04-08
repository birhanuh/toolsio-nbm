// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.commerce.productName(),
    deadline: faker.date.future(),
    status: 'new',
    description: faker.lorem.sentence(),
    total: faker.random.number()
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)