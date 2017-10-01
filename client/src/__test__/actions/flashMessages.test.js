// Actions 
import { 
  addFlashMessage, deleteFlashMessage
} from '../../actions/flashMessages'
import * as types from '../../actions/types'

describe("actions", () => { 

  test('should create an action to add a flashMessage', () => {
    const message = {}
    const expectedAction = {
      type: types.ADD_FLASH_MESSAGE,
      message
    }
    expect(addFlashMessage(message)).toEqual(expectedAction)
  })  

  test('should create an action to delete flashMessage', () => {
    const id = 1
    const expectedAction = {
      type: types.DELETE_FLASH_MESSAGE,
      id
    }
    expect(deleteFlashMessage(id)).toEqual(expectedAction)
  })  

  
})
