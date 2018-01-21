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
      return action.inboxOrSent
  
    case CONVERSATION_FETCHED: 
      const index = state.conversations && state.conversations.findIndex(item => item.conversationId === action.conversation[0].conversationId)
     
      if (index > -1) {
        return {
          ...state,
          conversations: state.conversations.map(item => {
            if (item.conversationId === action.conversation[0].conversationId) return  action.conversation
            return item
          })
        }
      } else {
        console.log('return')
        return {
          ...state,
          conversations: action.conversation
        }
      }  

    default: return state
  }
}