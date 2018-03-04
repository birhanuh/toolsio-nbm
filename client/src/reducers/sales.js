import { SET_SALES, ADD_SALE, SALE_FETCHED, SALE_UPDATED, SALE_DELETED, ADD_ITEM, ITEM_UPDATED, ITEM_DELETED  } from '../actions/types'

export default function sales(state = [], action = {}) {
  
  switch(action.type) {    

    case SET_SALES:
      return action.sales
      
    case ADD_SALE:
      if (state.list) {
        return  {
          ...state,
          list: [...state.list, action.sale]
        }
      } else {
        return [
          ...state, 
          action.sale
        ]
      }

    case SALE_DELETED:
      return state.list.filter(item => item._id !== action.id)
    
    case SALE_UPDATED:
      return  {
        ...state,
        list: state.list.map(item => {
          if (item._id === action.sale._id) return action.sale
          return item
        })
      }

    case SALE_FETCHED:
      const index = state.list && state.list.findIndex(item => item._id === action.sale._id)
      if (index > -1) {
        return {
          ...state,
          list: state.list.map(item => {
            if (item._id === action.sale._id) return action.sale
            return item
          })
        }
      } else {
        return {
          ...state,
          list: [action.sale]
        }
      }

    case ADD_ITEM:
      const creatorIndexAddItem = state.list && state.list.findIndex(item => item._id === action.item._creator)
      if (creatorIndexAddItem > -1) {
        return {
          ...state,
          list:  state.list.map(item => {
            if (item._id === action.item._creator) return {...item, items: [...item.items, action.item]}

            return item           
          })
        }  
      } else {
        return [...state]
      }
    
    case ITEM_UPDATED:
      const creatorIndexUpdateItem = state.list && state.list.findIndex(item => item._id === action.item._creator)
      if (creatorIndexUpdateItem > -1) {
        return {
          ...state,
          list: state.list.map(item => {
            if (item._id === action.item._creator) {
              return {
                ...item,
                items: [...item.items.filter(itemItem => itemItem._id !== action.item._id), action.item]     
              }  
            }
            return item 
          })
        }
      } else {
        return [...state]
      }

    case ITEM_DELETED:
      const creatorIndexDeleteItem = state.list && state.list.findIndex(item => item._id === action.item._creator)
      if (creatorIndexDeleteItem > -1) {
        return {
          ...state,
          list: state.list.map(item => {
            if (item._id === action.item._creator) {
              return {
                ...item,
                items: [...item.items.filter(itemItem => itemItem._id !== action.item._id)]        
              }  
            }
            return item 
          })
        }
      } else {
        return [...state]
      }

    default: return state
  }
}