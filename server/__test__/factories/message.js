// test/factories/user.js
import faker from 'faker'
/**
 * Generate an object which container attributes needed
 * to successfully create a user instance.
 * 
 * @param  {Object} props Properties to use for the user.
 * 
 * @return {Object}       An object to build the user from.
 */
const data = async (props = {}) => {
  const defaultProps = {
    message: faker.lorem.text(),
    isRead: true
  };
  return Object.assign({}, defaultProps, props)
}

export default async (props = {}) => await data(props)