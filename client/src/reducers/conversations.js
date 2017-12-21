import { SET_CONVERSATIONS, ADD_CONVERSATION, CONVERSATION_FETCHED, CONVERSATION_DELETED } from '../actions/types'

export default function conversations(state = [], action = {}) {
  switch(action.type) {

    case SET_CONVERSATIONS:
      return action.conversations

    case ADD_CONVERSATION:
      return [
        ...state, 
        action.conversation
      ]

    case CONVERSATION_DELETED:
      return state.filter(item => item._id !== action.id)

    case CONVERSATION_FETCHED: 
      const index = state.findIndex(item => item._id === action.conversation._id)
      if (index > -1) {
        return state.map(item => {
          if (item._id === action.conversation._id) return action.conversation
          return item
        })
      } else {
        return [
          ...state,
          action.conversation
        ]
      }  

    default: return state
  }
}