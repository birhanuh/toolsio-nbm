// test/factories/user.js
import faker from 'faker'

const data = async (props = {}) => {
  const defaultProps = {
    name: faker.name.findName(),
    isPublic: faker.random.boolean()
  }
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)