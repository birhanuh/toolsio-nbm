import { SET_CURRENT_ACCOUNT } from './types'

export function setCurrentAccount(account) {
  return {
    type: SET_CURRENT_ACCOUNT,
    account
  }
}
