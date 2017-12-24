import axios from 'axios'
import { SET_CONVERSATIONS, ADD_CONVERSATION, CONVERSATION_FETCHED, CONVERSATION_DELETED } from './types'

export function addConversation(conversation) {
  return {
    type: ADD_CONVERSATION,
    conversation
  }
}

export function setConversations(conversations) {
  return { 
    type: SET_CONVERSATIONS,
    conversations
  }
}

export function conversationFetched(conversation) {
  return {
    type: CONVERSATION_FETCHED,
    conversation
  }
}

export function conversationDeleted(id) {
  return {
    type: CONVERSATION_DELETED,
    id
  }
}

export function createConversation(conversation) {
  return dispatch => {
    return axios.post('/api/conversations', conversation)
      .then(res => {
        dispatch(addConversation(res.data.result))
      })
  }
}

export function fetchConversations() {
  return dispatch => {
    return axios.get('/api/conversations')
      .then(res => {
        dispatch(setConversations(res.data.results))
      })
  }
}

export function fetchConversation(id) {
  return dispatch => {
    return axios.get(`/api/conversations/${id}`)
      .then(res => {
        dispatch(conversationFetched(res.data.result))
      })
  }
}

export function deleteConversation(id) {
  return dispatch => {
    return axios.delete(`/api/conversations/${id}`)
      .then(res => {
        dispatch(conversationDeleted(id))
      })
  }
}


