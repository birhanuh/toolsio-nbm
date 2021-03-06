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
const data = (props = {}) => {
  const defaultProps = {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: faker.internet.password(),
    isAdmin: true,
    isConfirmed: true,
    avatar_url: faker.image.imageUrl()
  }

  console.log('firstName', defaultProps.firstName)
  console.log('firstName', defaultProps.lastName)
  return Object.assign({}, defaultProps, props)
}
/**
 * Generates a user instance from the properties provided.
 * 
 * @param  {Object} props Properties to use for the user.
 * 
 * @return {Object}       A user instance
 */
export default (props = {}) => data(props)