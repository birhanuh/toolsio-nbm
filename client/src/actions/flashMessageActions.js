import {
  ADD_FLASH_MESSAGE,
  DELETE_FLASH_MESSAGE,
  SET_CURRENT_ACCOUNT
} from "./types";

export function setCurrentAccount(account) {
  return {
    type: SET_CURRENT_ACCOUNT,
    account
  };
}

// Action creators
export function addFlashMessage(message) {
  return {
    type: ADD_FLASH_MESSAGE,
    message
  };
}

export function deleteFlashMessage(id) {
  return {
    type: DELETE_FLASH_MESSAGE,
    id
  };
}
