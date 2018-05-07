import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE } from '../actions/types'
import shortid from 'shortid'

export default (state = {}, action = {}) => {
  
  switch(action.type) {
    case ADD_FLASH_MESSAGE:
      if (state.id) {
        return {
          id: state.id, 
          type: action.message.type, 
          text: action.message.text 
        }
      }
      return {
        id: shortid.generate(),
        type: action.message.type,
        text: action.message.text
      }
    
    case DELETE_FLASH_MESSAGE:
      if (state.id === action.id) {
        let flash = Object.assign({}, state)
        flash = {} 
        return flash
      } 
      return state

    default: return state
  }

} 