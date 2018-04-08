// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.commerce.productName(),
    unit: 'meter',
    quantity: 10,
    price: 15,
    vat: 20,
    saleId: 1,
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)