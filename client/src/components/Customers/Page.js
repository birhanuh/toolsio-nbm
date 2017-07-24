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
        <div className="ui clearing segment transparent">
          <Link className="ui right floated primary button" to="/customers/new">
            <i className="add circle icon"></i>
            {T.translate("customers.index.create_new_customer")}
          </Link>
          <h1 className="ui left floated header m-t-n">{T.translate("customers.index.header")}</h1>   
        </div>  
        
        <div className="ui divider"></div>  

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
