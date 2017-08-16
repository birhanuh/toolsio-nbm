import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import List from './List' 
import { connect } from 'react-redux'
import { fetchCustomers, deleteCustomer } from '../../actions/customerActions'

// Localization 
import T from 'i18n-react'

class Page extends Component {

  componentDidMount() {
    this.props.fetchCustomers()
  }

  render() {
    return (
      <div className="row column">  
        <div className="ui segment transparent">
          <Link className="ui primary button" to="/customers/new">
            <i className="add circle icon"></i>
            {T.translate("customers.page.add_new_customer")}
          </Link>
        </div>  

        <List customers={this.props.customers} deleteCustomer={deleteCustomer} />   
      </div>  
    )
  }
}

Page.propTypes = {
  customers: React.PropTypes.array.isRequired,
  fetchCustomers: React.PropTypes.func.isRequired,
  deleteCustomer: React.PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    customers: state.customers
  }
}

export default connect(mapSateToProps, { fetchCustomers, deleteCustomer })(Page)
