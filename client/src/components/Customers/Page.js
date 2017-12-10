import React, { Component } from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'
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

    const customers = this.props.customers.map(customer => {
      let activeProjectsAndSales = ''
      let unpaidInvoices = ''
      let actions = (
        <div className="ui small buttons">
          <a href={`/customers/edit/${customer._id}`} className="ui icon basic button green"><i className="edit icon"></i></a>
          <a href={`/customers/show/${customer._id}`} className="ui icon basic blue button"><i className="unhide icon"></i></a>
        </div>
      )

      return [
        customer.name,
        customer.vatNumber,
        customer.contact.phoneNumber+ '\n' +customer.contact.email,        
        activeProjectsAndSales,
        unpaidInvoices,
        ReactDOMServer.renderToStaticMarkup(actions)        
      ]
    })
    
    return (
      <div className="row column">  
        <div className="ui vertical segment">
          <Link className="ui primary button" to="/customers/new">
            <i className="add circle icon"></i>
            {T.translate("customers.page.add_new_customer")}
          </Link>
        </div>  

        <List customers={customers} deleteCustomer={deleteCustomer} />   
      </div>  
    )
  }
}

Page.propTypes = {
  fetchCustomers: PropTypes.func.isRequired,
  deleteCustomer: PropTypes.func.isRequired
}

function mapSateToProps(state) {
  return {
    customers: state.customers
  }
}

export default connect(mapSateToProps, { fetchCustomers, deleteCustomer })(Page)
