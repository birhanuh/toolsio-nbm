import React, { Component } from 'react'
import { getSubdomain, getCookie } from '../../utils'
// Semantic UI Form elements
import { Grid, Segment, Item, Divider } from 'semantic-ui-react'
import AccountForm from './AccountForm'
import UserForm from './UserForm'

class Page extends Component {

  render() {
    
    // Parse subdomain 
    const subdomain =  getSubdomain()
    // Parse current account
    const currentAccount = getCookie('currentAccount') && JSON.parse(getCookie('currentAccount'))
    
    return (
      <Grid.Row>
        <Grid.Column width={12}>         
          <Segment className="account">
            <Item.Group>
              <AccountForm subdomain={subdomain} /> 
            </Item.Group>
          </Segment>

          <Divider />
          
          <Segment className="user">
            <Item.Group>
              { currentAccount.email && <UserForm email={currentAccount.email} /> }
            </Item.Group>
          </Segment>
        </Grid.Column>
      </Grid.Row>  
    )
  }
}

export default Page


