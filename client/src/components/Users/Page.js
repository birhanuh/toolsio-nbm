import React, { Component } from 'react'
import PropTypes from 'prop-types'
import List from './List' 
import { connect } from 'react-redux'
import { fetchUsers } from '../../actions/userActions'

import Breadcrumb from '../Layouts/Breadcrumb'
import Form from './Form'

class Page extends Component {

  componentDidMount() {
    this.props.fetchUsers()
  }

  render() {

    const { users, currentAccount } = this.props
    let usersNotCurrentUserIncluded = users.filter(user => user.email !== currentAccount.email)

    return (
      <div className="row column">  

        <Breadcrumb />

        <div className="ui text container"> 
        
          <Form />  

          <List users={usersNotCurrentUserIncluded} />   

        </div>
      </div>  
    )
  }
}

Page.propTypes = {
  users: PropTypes.array.isRequired,
  fetchUsers: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    users: state.users,
    currentAccount: state.authentication.currentAccount
  }
}

export default connect(mapSateToProps, { fetchUsers })(Page)