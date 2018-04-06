import React from 'react' 
import { withRouter } from 'react-router-dom'
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Downshift from 'downshift'

const UsersDownshift = ({ onClose, history, data: { getUsers } }) => (   

  <Downshift
    onChange={(selectedUser) => {
      history.push(`/conversations/receiver/${selectedUser.id}`)
      onClose()
    }}
    render={({
      getInputProps,
      getItemProps,
      isOpen,
      inputValue,
      selectedItem,
      highlightedIndex,
    }) => (
      <div className="ui form">
        <input {...getInputProps({placeholder: 'Users'})} />
        {isOpen ? (
          <div style={{border: '1px solid #ccc'}}>
            {getUsers && getUsers
              .filter(
                i =>
                  !inputValue ||
                  i.firstName.toLowerCase().includes(inputValue.toLowerCase()),
              )
              .map((user, index) => (
                <div
                  {...getItemProps({item: user})}
                  key={user.id}
                  style={{
                    backgroundColor:
                      highlightedIndex === index ? 'lightgrey' : 'white',
                    fontWeight: selectedItem === user ? 'bold' : 'normal',
                    padding: '10px'
                  }}
                >
                  {user.firstName}
                </div>
              ))}
          </div>
        ) : null}
      </div>
    )}
  />      
)
  
const getUsersQuery = gql`
  {
    getUsers {
      id
      firstName
      email
    }
}
`

export default withRouter(graphql(getUsersQuery)(UsersDownshift))

