// test/factories/user.js
import faker from 'faker'
import models from '../../src/models'

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.commerce.productName(),
    hours: '10',
    paymentType: 'per hour',
    price: 15,
    vat: 20,
    projectId: 1,
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)