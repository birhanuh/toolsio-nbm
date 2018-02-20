import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchUsers } from '../../actions/customerActions'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  componentDidMount() {
    this.props.fetchUsers()
  }

  render() {
    return (
      <div className="row column">  

        <Breadcrumb />

        <div className="ui vertical segment">
          <Link className="ui primary button" to="/users/new">
            <i className="add circle icon"></i>
            {T.translate("users.page.add_new_customer")}
          </Link>
        </div>  

        <List users={this.props.users} />   
      </div>  
    )
  }
}

Page.propTypes = {
  users: React.PropTypes.array.isRequired,
  fetchUsers: React.PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    users: state.users
  }
}

export default connect(mapSateToProps, { fetchUsers })(Page)