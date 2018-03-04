import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { fetchAccount, updateAccount } from '../../actions/accountActions'
import { updateUser } from '../../actions/userActions'

import AccountShow from './AccountShow'
import UserShow from './UserShow'

// Localization 
import T from 'i18n-react'

import Breadcrumb from '../Layouts/Breadcrumb'

class Page extends Component {

  componentDidMount() {
    
    this.props.fetchAccount()
  }

  render() {
    
    return (
      <div className="row column">  

        <AccountShow account={this.props.account} />

        <UserShow user={this.props.user} />

      </div>  
    )
  }
}

Page.propTypes = {
  updateAccount: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    account: state.account,
    user: state.authentication.account
  }
}

export default connect(mapSateToProps, { updateAccount })(Page)
