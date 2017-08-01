import React, { Component } from 'react' 
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { createSale, fetchSale, updateSale } from '../../actions/saleActions'
import { fetchCustomers } from '../../actions/customerActions'
import Form from './Form'

class FormPage  extends Component {
  
  state = {
    redirect: false
  }

  componentDidMount = () => {
    // Fetch Project when id is present in params
    const { match } = this.props
    if (match.params.id) {
      this.props.fetchSale(match.params.id)
    } 

    // Fetch Customers
    this.props.fetchCustomers()
  }

  saveSale = ({ _id, name, customer, deadline, status, description }) => {
    if (_id) {
      return this.props.updateSale({ _id, name, customer, deadline, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    } else {        
      return this.props.createSale({ _id, name, customer, deadline, status, description }).then(
        () => { this.setState({ redirect: true }) } )   
    }
  }

  render() {
   return (
      <div>
        {
          this.state.redirect ? 
          <Redirect to="/sales" /> : 
          <Form sale={this.props.sale} saveSale={this.saveSale} customers={this.props.customers} />
        }
      </div>
    )
  }
}

FormPage.propTypes = {
  createSale: React.PropTypes.func.isRequired,
  fetchSale: React.PropTypes.func.isRequired,
  updateSale: React.PropTypes.func.isRequired,
  fetchCustomers: React.PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const { match } = props
  if (match.params.id) {
    return {
      sale: state.sales.find(item => item._id === match.params.id)
    }
  } 
  return { 
    sale: null,
    customers: state.customers
  }
}

export default connect(mapStateToProps, { createSale, fetchSale, updateSale, fetchCustomers })(FormPage)


