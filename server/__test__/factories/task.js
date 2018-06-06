// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.commerce.productName(),
    hours: '10',
    paymentType: 'per hour',
    unitPrice: 15,
    total: 0
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)