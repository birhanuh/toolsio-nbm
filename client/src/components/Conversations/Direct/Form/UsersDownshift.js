import React from 'react' 
import { graphql, compose } from 'react-apollo'
import gql from 'graphql-tag'

import Downshift from 'downshift'

const UsersDownshift = (

  const { getUsers } = this.props.data

  return (   

    <Downshift
      onChange={(selectedUser) => history.push(`/conversations/receiver/${selectedUser.id}`)}
      render={({
        getInputProps,
        getItemProps,
        isOpen,
        inputValue,
        selectedItem,
        highlightedIndex,
      }) => (
        <div>
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
                    {...getItemProps({user: user})}
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
  
)

const getUsersQuery = gql`
  {
    getUsers {
      id
      firstName
      lastName
      email
    }
  }
`

export default withRouter(graphql(getTeamMembersQuery)(UsersDownshift))

