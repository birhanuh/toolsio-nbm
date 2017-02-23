import { APIManager } from '../../utils'

export function userSignupRequest(userData) {
  return dispatch => {
    return APIManager.post('/users/register', userData, (err, response) => {
      if (err) {
        alert('ERROR' +err.message)
        return
      }

      console.log('Project created: '+JSON.stringify(response.result))
    })
  }
}