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
    return (
      <div className="row column">  

        <Breadcrumb />

        <div className="ui text container"> 
        
          <Form />  

          <List users={this.props.users} />   

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
    users: state.users
  }
}

export default connect(mapSateToProps, { fetchUsers })(Page)