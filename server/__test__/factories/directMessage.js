// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    message: faker.lorem.text(),
    isRead: true
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)