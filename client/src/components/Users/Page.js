import React, { Component } from 'react'
import decode from 'jwt-decode'
import { Grid, Container} from 'semantic-ui-react'
import { graphql } from 'react-apollo'
import { GET_INVITED_USERS_QUERY } from '../../graphql/users'

import List from './List' 
import Form from './Form'

class Page extends Component {

  render() {
    /* eslint-disable no-unused-vars */
    let currentUser
    
    try {
      const authToken = localStorage.getItem('authToken')
      const { user } = decode(authToken)

      currentUser = user

    } catch(err) {
      console.log('err: ', err)
    }

    const { data: { getInvitedUsers } } = this.props

    return (
      <Grid.Row columns={1}>
        <Container text>
        
          <Form />  

          { getInvitedUsers && <List users={getInvitedUsers} /> }

        </Container>
      </Grid.Row>  
    )
  }
}

export default graphql(GET_INVITED_USERS_QUERY)(Page)
