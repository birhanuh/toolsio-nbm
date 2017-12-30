import { SET_CONVERSATIONS, ADD_CONVERSATION, CONVERSATION_FETCHED, INBOX_OR_SENT_FETCHED, CONVERSATION_DELETED } from '../actions/types'

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

    case INBOX_OR_SENT_FETCHED: 
      const isStateSizeEqual = state.length === action.inboxOrSent.length
  
      if (isStateSizeEqual) {
        return action.inboxOrSent
      } else {
        return action.inboxOrSent
      }  

    case CONVERSATION_FETCHED: 
      const index = state.conversations && state.conversations.findIndex(item => item.length !==0 && item[0]._id === action.conversation[0]._id)
   
      if (index > -1) {
        return state.conversations.map(item => {
          if (item.length !==0 && item[0]._id === action.conversation[0]._id) return action.conversation
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